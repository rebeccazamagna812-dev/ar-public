import { Injectable, signal } from '@angular/core';
import {
  DadosCadastrais,
  MidiaFisica,
  ModalidadeCertificado,
  SituacaoCertificadoAnterior,
  SolicitacaoRegistrada,
} from '@domain/certificado/solicitacao-certificado.models';

/**
 * Estado da jornada de solicitação, feito com signals. Sobrevive à troca de rotas dentro da jornada.
 * Guarda só o necessário para as telas. Nenhum dado é persistido no navegador [DOC: RNF01].
 *
 * Fornecido na rota da funcionalidade (solicitacao-certificado.routes.ts). Só a fachada
 * SolicitacaoCertificadoJornada escreve nele.
 */
@Injectable()
export class SolicitacaoCertificadoStore {
  private readonly _situacaoAnterior = signal<SituacaoCertificadoAnterior | null>(null);
  private readonly _modalidade = signal<ModalidadeCertificado | null>(null);
  private readonly _midia = signal<MidiaFisica | null>(null);
  private readonly _dados = signal<DadosCadastrais | null>(null);
  private readonly _solicitacao = signal<SolicitacaoRegistrada | null>(null);

  readonly situacaoAnterior = this._situacaoAnterior.asReadonly();
  readonly modalidade = this._modalidade.asReadonly();
  readonly midia = this._midia.asReadonly();
  readonly dados = this._dados.asReadonly();
  readonly solicitacao = this._solicitacao.asReadonly();

  definirSituacaoAnterior(situacao: SituacaoCertificadoAnterior): void {
    this._situacaoAnterior.set(situacao);
  }

  /** Trocar de modalidade descarta a mídia escolhida antes. */
  definirModalidade(modalidade: ModalidadeCertificado): void {
    this._modalidade.set(modalidade);
    this._midia.set(null);
  }

  definirMidia(midia: MidiaFisica | null): void {
    this._midia.set(midia);
  }

  definirDados(dados: DadosCadastrais): void {
    this._dados.set(dados);
  }

  registrarSolicitacao(solicitacao: SolicitacaoRegistrada): void {
    this._solicitacao.set(solicitacao);
  }

  /** Limpa a jornada (ao recomeçar a solicitação). */
  reiniciar(): void {
    this._situacaoAnterior.set(null);
    this._modalidade.set(null);
    this._midia.set(null);
    this._dados.set(null);
    this._solicitacao.set(null);
  }
}
