import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DscButton, DscCardAlert, DscProgress, DscTextFieldForm } from '@dsc/web';
import { MascaraCpfPipe } from '@shared/pipes/mascara-cpf.pipe';
import { ETAPAS_JORNADA } from '../../solicitacao-certificado.etapas';
import { PARAM_MODALIDADE, ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';

/**
 * Etapa 2 de 3 — Confira seus dados e confirme. [FIGMA: 01.02 — Conferir dados]
 * - Dados do IntegraMais, somente leitura; para corrigir, Portal IntegraMais [FIGMA: 01.02] [DOC: HU05].
 * - "Confirmar solicitação" envia ao SERPRO; a próxima tela é decidida por SolicitacaoCertificadoJornada.confirmar().
 */
@Component({
  selector: 'app-conferir-dados',
  imports: [DatePipe, MascaraCpfPipe, DscButton, DscCardAlert, DscProgress, DscTextFieldForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './conferir-dados.html',
  styleUrl: './conferir-dados.css',
})
export class ConferirDados {
  private readonly jornada = inject(SolicitacaoCertificadoJornada);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly etapa = ETAPAS_JORNADA.dados;
  protected readonly dados = this.jornada.dados;
  protected readonly carregando = signal(true);
  protected readonly erroCarregamento = signal(false);
  protected readonly enviando = signal(false);

  constructor() {
    this.jornada
      .carregarDados()
      .pipe(
        finalize(() => this.carregando.set(false)),
        takeUntilDestroyed(),
      )
      .subscribe({ error: () => this.erroCarregamento.set(true) });
  }

  protected voltar(): void {
    void this.router.navigate([ROTAS_SOLICITACAO.inicio], { queryParams: { [PARAM_MODALIDADE]: 'nuvem' } });
  }

  protected confirmar(): void {
    if (this.enviando() || !this.dados()) {
      return;
    }
    this.enviando.set(true);
    this.jornada
      .confirmar()
      .pipe(
        finalize(() => this.enviando.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((proximaTela) => void this.router.navigateByUrl(proximaTela));
  }
}
