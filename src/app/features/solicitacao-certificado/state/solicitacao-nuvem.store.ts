import { Injectable, signal } from '@angular/core';
import {
  DadosCadastrais,
  ModalidadeCertificado,
  SolicitacaoRegistrada,
} from '@core/models/solicitacao-certificado.models';

/**
 * Estado da jornada de solicitação, feito com signals. Sobrevive à troca de rotas dentro da jornada.
 * Guarda só o necessário para as telas. Nenhum dado é persistido no navegador [DOC: RNF01].
 */
@Injectable({ providedIn: 'root' })
export class SolicitacaoNuvemStore {
  private readonly _modalidade = signal<ModalidadeCertificado | null>(null);
  private readonly _dados = signal<DadosCadastrais | null>(null);
  private readonly _solicitacao = signal<SolicitacaoRegistrada | null>(null);

  readonly modalidade = this._modalidade.asReadonly();
  readonly dados = this._dados.asReadonly();
  readonly solicitacao = this._solicitacao.asReadonly();

  selecionarModalidade(modalidade: ModalidadeCertificado | null): void {
    this._modalidade.set(modalidade);
  }

  definirDados(dados: DadosCadastrais): void {
    this._dados.set(dados);
  }

  registrarSolicitacao(solicitacao: SolicitacaoRegistrada): void {
    this._solicitacao.set(solicitacao);
  }

  /** Limpa a jornada (ao recomeçar a solicitação). */
  reiniciar(): void {
    this._modalidade.set(null);
    this._dados.set(null);
    this._solicitacao.set(null);
  }
}
