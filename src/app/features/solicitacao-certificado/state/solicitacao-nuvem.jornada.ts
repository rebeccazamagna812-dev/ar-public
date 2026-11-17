import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { DadosCadastrais } from '@domain/certificado/solicitacao-certificado.models';
import { ROTAS_SOLICITACAO } from '../solicitacao-certificado.paths';
import { SolicitacaoNuvemStore } from './solicitacao-nuvem.store';

/**
 * Fachada da jornada de certificado em nuvem: concentra as regras de negócio e as decisões de navegação.
 * Telas e guards só chamam estes métodos. Nenhum deles fala direto com a API ou altera o store.
 *
 * Fornecida na rota da funcionalidade (solicitacao-certificado.routes.ts), junto com o store.
 */
@Injectable()
export class SolicitacaoNuvemJornada {
  private readonly api = inject(SolicitacaoCertificadoApi);
  private readonly elegibilidade = inject(ElegibilidadeService);
  private readonly store = inject(SolicitacaoNuvemStore);

  readonly dados = this.store.dados;
  readonly solicitacao = this.store.solicitacao;

  /** Recomeça a jornada. Chamado ao abrir a etapa 1. */
  reiniciar(): void {
    this.store.reiniciar();
  }

  /**
   * Decide se o empregado pode entrar na etapa 2 (01.02).
   * Devolve `null` quando pode, ou a URL para onde deve ser levado:
   * 1. sem elegibilidade à nuvem → 01.E1 [DOC: HU02 CA02, HU03c] [FIGMA: 01.E1]
   *    (na etapa 1 a opção nem aparece; esta tela só é vista se a rota for acessada direto pela URL);
   * 2. já existe certificado em nuvem ativo → 01.E2, sem envio ao SERPRO e sem registro [DOC: HU04] [FIGMA: 01.E2];
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

  /** Carrega os dados do IntegraMais (somente leitura) e os guarda na jornada [DOC: HU05] [FIGMA: 01.02]. */
  carregarDados(): Observable<DadosCadastrais> {
    return this.api.obterDadosCadastrais().pipe(tap((dados) => this.store.definirDados(dados)));
  }

  /**
   * Envia a solicitação ao SERPRO e devolve a URL da próxima tela [FIGMA: protótipo 01.02 → 01.04]:
   * sucesso → 01.04 | divergência CAIXA×SERPRO → 01.E3 | SERPRO indisponível ou falha técnica → 01.E4.
   * A solicitação só é registrada depois do retorno com a referência [ADR-10].
   */
  confirmar(): Observable<string> {
    return this.api.enviarSolicitacao({ modalidade: 'nuvem' }).pipe(
      map((resultado) => {
        if (resultado.tipo === 'registrada') {
          this.store.registrarSolicitacao(resultado.solicitacao);
          return ROTAS_SOLICITACAO.enviada;
        }
        return ROTAS_SOLICITACAO.interrupcao(resultado.motivo);
      }),
      catchError(() => of(ROTAS_SOLICITACAO.interrupcao('serpro-indisponivel'))),
    );
  }
}
