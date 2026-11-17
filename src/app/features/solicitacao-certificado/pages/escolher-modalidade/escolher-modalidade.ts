import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DscButton, DscCard, DscCardAlert, DscProgress, DscRadio } from '@dsc/web';
import { ElegibilidadeService } from '@core/elegibilidade/elegibilidade.service';
import { ModalidadeCertificado } from '@core/models/solicitacao-certificado.models';
import { ETAPAS_JORNADA } from '../../solicitacao-certificado.etapas';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoNuvemJornada } from '../../state/solicitacao-nuvem.jornada';

/**
 * Etapa 1 de 3 — Escolher modalidade.
 * [FIGMA: 01.01 — Escolher modalidade; 01.01A — Modalidade em nuvem selecionada]
 * - Só aparecem as modalidades elegíveis [DOC: HU02 CA02, HU03a CA02, HU03c CA02].
 * - Sem seleção: "Continuar" desabilitado e sem "Voltar" [FIGMA: 01.01].
 * - Com seleção: "Voltar" limpa a escolha e volta ao estado 01.01 [FIGMA: protótipo 01.01A → Voltar → 01.01].
 * - `?modalidade=nuvem` deixa a nuvem pré-selecionada (usado por "Tentar novamente", 01.E4 → 01.01A).
 */
@Component({
  selector: 'app-escolher-modalidade',
  imports: [RouterLink, DscButton, DscCard, DscCardAlert, DscProgress, DscRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './escolher-modalidade.html',
  styleUrl: './escolher-modalidade.css',
})
export class EscolherModalidade implements OnInit {
  private readonly router = inject(Router);
  private readonly jornada = inject(SolicitacaoNuvemJornada);
  private readonly elegibilidade = inject(ElegibilidadeService);

  /** Query param `modalidade` (withComponentInputBinding). */
  readonly modalidade = input<string | undefined>(undefined);

  protected readonly etapa = ETAPAS_JORNADA.escolha;
  protected readonly podeNuvem = this.elegibilidade.podeSolicitarNuvem;
  protected readonly podeMidiaFisica = this.elegibilidade.podeSolicitarMidiaFisica;
  protected readonly falhaElegibilidade = this.elegibilidade.falhou;

  protected readonly selecionada = linkedSignal<ModalidadeCertificado | null>(() =>
    this.modalidade() === 'nuvem' && this.podeNuvem() ? 'nuvem' : null,
  );

  protected readonly alerta = computed(() =>
    this.selecionada() === 'nuvem'
      ? {
          titulo: 'Certificado em nuvem',
          texto: 'O certificado fica disponível para uso no dispositivo móvel, sem necessidade de mídia física.',
        }
      : {
          titulo: 'Selecione a categoria',
          texto: 'Escolha entre certificado em Nuvem ou mídia física, que poderá ser Token ou Cartão.',
        },
  );

  ngOnInit(): void {
    // Voltar a esta etapa recomeça a jornada.
    this.jornada.reiniciar();
  }

  protected selecionar(modalidade: string): void {
    if (modalidade === 'nuvem' || modalidade === 'midia-fisica') {
      this.selecionada.set(modalidade);
    }
  }

  protected limparSelecao(): void {
    this.selecionada.set(null);
  }

  protected continuar(): void {
    const modalidade = this.selecionada();
    if (!modalidade) {
      return;
    }
    void this.router.navigateByUrl(
      modalidade === 'nuvem' ? ROTAS_SOLICITACAO.dadosNuvem : ROTAS_SOLICITACAO.midiaFisica,
    );
  }
}
