import { Injectable, computed, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import {
  DadosCadastrais,
  ModalidadeCertificado,
  PedidoCertificado,
  SituacaoCertificadoAnterior,
} from '@domain/certificado/solicitacao-certificado.models';
import { ROTAS_SOLICITACAO } from '../solicitacao-certificado.paths';
import { SolicitacaoCertificadoStore } from './solicitacao-certificado.store';

/** Respostas de 03.02 — "Você já possui uma mídia física?". */
export type RespostaMidiaExistente = 'cartao' | 'token' | 'nenhuma';

/** Respostas de 03.02A — "Qual foi o retorno da sua área ou gestor?". */
export type RespostaEstoqueUnidade = 'disponivel' | 'indisponivel' | 'nao-consultado';

/**
 * Só "ainda tenho certificado válido e não revoguei" impede seguir [FIGMA: 03.00 — o "Continuar" some].
 */
export function situacaoPermiteSolicitar(situacao: SituacaoCertificadoAnterior | null): boolean {
  return situacao !== null && situacao !== 'valido-nao-revogado';
}

/**
 * Fachada da jornada de solicitação de certificado (nuvem e mídia física): concentra as regras de negócio
 * e as decisões de navegação. Telas e guards só chamam estes métodos; nenhum deles fala direto com a API
 * ou altera o store. Os métodos que respondem a uma pergunta devolvem a URL da próxima tela.
 *
 * Fluxo [FIGMA: Fluxo V1 (em andamento) → seção 03 — Solicitação guiada de certificado]: veja docs/jornada-solicitacao.md.
 * Fornecida na rota da funcionalidade (solicitacao-certificado.routes.ts), junto com o store.
 */
@Injectable()
export class SolicitacaoCertificadoJornada {
  private readonly api = inject(SolicitacaoCertificadoApi);
  private readonly elegibilidade = inject(ElegibilidadeService);
  private readonly store = inject(SolicitacaoCertificadoStore);

  readonly situacaoAnterior = this.store.situacaoAnterior;
  readonly modalidade = this.store.modalidade;
  readonly midia = this.store.midia;
  readonly dados = this.store.dados;
  readonly solicitacao = this.store.solicitacao;

  /** A triagem (03.00) foi respondida com uma situação que permite seguir. */
  readonly triagemConcluida = computed(() => situacaoPermiteSolicitar(this.store.situacaoAnterior()));

  /** Recomeça a jornada: a triagem (03.00) volta a ser exibida. */
  reiniciar(): void {
    this.store.reiniciar();
  }

  /**
   * Registra a situação do certificado anterior [FIGMA: 03.00].
   * Devolve se a jornada pode seguir para a escolha da modalidade.
   */
  responderTriagem(situacao: SituacaoCertificadoAnterior): boolean {
    this.store.definirSituacaoAnterior(situacao);
    return situacaoPermiteSolicitar(situacao);
  }

  /** 03.01 → 03.N1 (nuvem) ou 03.02 (mídia física). */
  escolherModalidade(modalidade: ModalidadeCertificado): string {
    this.store.definirModalidade(modalidade);
    return modalidade === 'nuvem' ? ROTAS_SOLICITACAO.dados('nuvem') : ROTAS_SOLICITACAO.midiaFisica;
  }

  /** 03.02: cartão ou token → 03.04; nenhuma mídia → 03.02A. */
  informarMidiaExistente(resposta: RespostaMidiaExistente): string {
    this.store.definirModalidade('midia-fisica');
    if (resposta === 'nenhuma') {
      return ROTAS_SOLICITACAO.estoque;
    }
    this.store.definirMidia(resposta);
    return ROTAS_SOLICITACAO.dados('midia-fisica');
  }

  /** 03.02A: mídia disponível na unidade → 03.04; sem mídia → 03.02C; ainda não consultou → 03.02B. */
  informarEstoqueUnidade(resposta: RespostaEstoqueUnidade): string {
    this.store.definirModalidade('midia-fisica');
    switch (resposta) {
      case 'disponivel':
        this.store.definirMidia('disponibilizada-pela-unidade');
        return ROTAS_SOLICITACAO.dados('midia-fisica');
      case 'indisponivel':
        return ROTAS_SOLICITACAO.semMidia;
      case 'nao-consultado':
        return ROTAS_SOLICITACAO.aguardarUnidade;
    }
  }

  /**
   * Decide se o empregado pode abrir a conferência de dados em nuvem (03.N1).
   * Devolve `null` quando pode, ou a URL para onde deve ser levado:
   * 1. sem elegibilidade à nuvem → 01.E1 [DOC: HU02 CA02, HU03c]
   *    (na escolha a opção nem aparece; esta tela só é vista se a rota for acessada direto pela URL);
   * 2. já existe certificado em nuvem ativo → 01.E2, sem envio ao SERPRO e sem registro [DOC: HU04];
   * 3. falha na consulta → volta à escolha de modalidade. [PENDENTE] Comportamento esperado em falha.
   */
  verificarEntradaNuvem(): Observable<string | null> {
    if (!this.elegibilidade.podeSolicitarNuvem()) {
      return of(ROTAS_SOLICITACAO.interrupcao('nao-elegivel'));
    }
    return this.api.possuiCertificadoNuvemAtivo().pipe(
      map((ativo) => (ativo ? ROTAS_SOLICITACAO.interrupcao('certificado-ativo') : null)),
      catchError(() => of(ROTAS_SOLICITACAO.inicio)),
    );
  }

  /** Mídia física só segue para a conferência (03.04) com a mídia definida em 03.02 ou 03.02A. */
  podeConferirMidiaFisica(): boolean {
    return this.store.modalidade() === 'midia-fisica' && this.store.midia() !== null;
  }

  /** Carrega os dados do IntegraMais (somente leitura) e os guarda na jornada [DOC: HU05] [FIGMA: 03.N1, 03.04]. */
  carregarDados(): Observable<DadosCadastrais> {
    return this.api.obterDadosCadastrais().pipe(tap((dados) => this.store.definirDados(dados)));
  }

  /**
   * Envia o pedido ao SERPRO e devolve a URL da próxima tela [FIGMA: 03.N1 → 03.N2; 03.04 → 03.05]:
   * sucesso → tela de enviada da modalidade | divergência CAIXA×SERPRO → 01.E3 |
   * SERPRO indisponível ou falha técnica → 01.E4. Nada é registrado sem a referência do SERPRO [ADR-10].
   */
  confirmar(): Observable<string> {
    const pedido = this.montarPedido();
    if (!pedido) {
      return of(ROTAS_SOLICITACAO.inicio);
    }
    return this.api.enviarSolicitacao(pedido).pipe(
      map((resultado) => {
        if (resultado.tipo === 'registrada') {
          this.store.registrarSolicitacao(resultado.solicitacao);
          return ROTAS_SOLICITACAO.enviada(pedido.modalidade);
        }
        return ROTAS_SOLICITACAO.interrupcao(resultado.motivo);
      }),
      catchError(() => of(ROTAS_SOLICITACAO.interrupcao('serpro-indisponivel'))),
    );
  }

  private montarPedido(): PedidoCertificado | null {
    const midia = this.store.midia();
    switch (this.store.modalidade()) {
      case 'nuvem':
        return { modalidade: 'nuvem' };
      case 'midia-fisica':
        return midia ? { modalidade: 'midia-fisica', midia } : null;
      default:
        return null;
    }
  }
}
