import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SolicitacaoCertificadoApi } from '@core/api/solicitacao-certificado.api';
import { Elegibilidade } from '@core/models/solicitacao-certificado.models';

/**
 * Guarda a elegibilidade do empregado, carregada uma vez após o login.
 * [DOC: HU03a RN04 — avaliada logo após o login, antes de qualquer tela de solicitação]
 * [DOC: HU02 CA02 / HU03c CA02 — modalidade inelegível não é exibida]
 */
@Injectable({ providedIn: 'root' })
export class ElegibilidadeService {
  private readonly api = inject(SolicitacaoCertificadoApi);

  private readonly _elegibilidade = signal<Elegibilidade | null>(null);
  private readonly _falhou = signal(false);

  readonly elegibilidade = this._elegibilidade.asReadonly();
  /** Verdadeiro quando a avaliação não pôde ser feita. [PENDENTE] Comportamento esperado (Fase 1, item 15). */
  readonly falhou = this._falhou.asReadonly();
  readonly podeSolicitarNuvem = computed(() => this._elegibilidade()?.nuvem === true);
  readonly podeSolicitarMidiaFisica = computed(() => this._elegibilidade()?.midiaFisica === true);

  async carregar(): Promise<void> {
    try {
      this._elegibilidade.set(await firstValueFrom(this.api.obterElegibilidade()));
      this._falhou.set(false);
    } catch {
      // Sem elegibilidade confirmada, nenhuma modalidade é oferecida.
      this._elegibilidade.set({ nuvem: false, midiaFisica: false });
      this._falhou.set(true);
    }
  }
}
