import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { DscButton, DscCardAlert, DscProgress, DscTextFieldForm } from '@dsc/web';
import { SolicitacaoCertificadoApi } from '@core/api/solicitacao-certificado.api';
import { MascaraCpfPipe } from '@shared/pipes/mascara-cpf.pipe';
import { ROTA_INTERRUPCAO } from '../../guards/jornada-nuvem.guard';
import { SolicitacaoNuvemStore } from '../../state/solicitacao-nuvem.store';

/**
 * Etapa 2 de 3 — Confira seus dados e confirme. [FIGMA: 01.02 — Conferir dados]
 * - Dados do IntegraMais, somente leitura; para corrigir, Portal IntegraMais [FIGMA: 01.02] [DOC: HU05].
 * - "Confirmar solicitação" envia ao SERPRO [FIGMA: protótipo 01.02 → 01.04]:
 *     sucesso → 01.04 | divergência CAIXA×SERPRO → 01.E3 | SERPRO indisponível → 01.E4.
 */
@Component({
  selector: 'app-conferir-dados',
  imports: [DatePipe, MascaraCpfPipe, DscButton, DscCardAlert, DscProgress, DscTextFieldForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conferir-dados.html',
  styleUrls: ['../../../../shared/styles/pagina.css', './conferir-dados.css'],
})
export class ConferirDados {
  private readonly api = inject(SolicitacaoCertificadoApi);
  private readonly store = inject(SolicitacaoNuvemStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly dados = this.store.dados;
  protected readonly carregando = signal(true);
  protected readonly erroCarregamento = signal(false);
  protected readonly enviando = signal(false);

  constructor() {
    this.api
      .obterDadosCadastrais()
      .pipe(
        finalize(() => this.carregando.set(false)),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (dados) => this.store.definirDados(dados),
        error: () => this.erroCarregamento.set(true),
      });
  }

  protected voltar(): void {
    void this.router.navigate(['/solicitar'], { queryParams: { modalidade: 'nuvem' } });
  }

  protected confirmar(): void {
    if (this.enviando() || !this.dados()) {
      return;
    }
    this.enviando.set(true);
    this.api
      .enviarSolicitacaoNuvem()
      .pipe(
        finalize(() => this.enviando.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (resultado) => {
          if (resultado.tipo === 'registrada') {
            this.store.registrarSolicitacao(resultado.solicitacao);
            void this.router.navigateByUrl('/solicitar/nuvem/enviada');
          } else {
            void this.router.navigate([ROTA_INTERRUPCAO, resultado.motivo]);
          }
        },
        // Falha técnica no envio: mesma orientação de indisponibilidade do SERPRO [FIGMA: 01.E4].
        error: () => void this.router.navigate([ROTA_INTERRUPCAO, 'serpro-indisponivel']),
      });
  }
}
