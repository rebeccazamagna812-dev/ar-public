import { Injectable, signal } from '@angular/core';
import { DadosCadastrais, SolicitacaoRegistrada } from '@domain/certificado/solicitacao-certificado.models';

/**
 * Estado da jornada de solicitação, feito com signals. Sobrevive à troca de rotas dentro da jornada.
 * Guarda só o necessário para as telas. Nenhum dado é persistido no navegador [DOC: RNF01].
 *
 * Fornecido na rota da funcionalidade (solicitacao-certificado.routes.ts). Só a fachada
 * SolicitacaoNuvemJornada escreve nele.
 */
@Injectable()
export class SolicitacaoNuvemStore {
  private readonly _dados = signal<DadosCadastrais | null>(null);
  private readonly _solicitacao = signal<SolicitacaoRegistrada | null>(null);

  readonly dados = this._dados.asReadonly();
  readonly solicitacao = this._solicitacao.asReadonly();

  definirDados(dados: DadosCadastrais): void {
    this._dados.set(dados);
  }

  registrarSolicitacao(solicitacao: SolicitacaoRegistrada): void {
    this._solicitacao.set(solicitacao);
  }

  /** Limpa a jornada (ao recomeçar a solicitação). */
  reiniciar(): void {
    this._dados.set(null);
    this._solicitacao.set(null);
  }
}
