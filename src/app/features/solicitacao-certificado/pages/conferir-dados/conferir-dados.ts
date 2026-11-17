import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DscButton, DscCardAlert, DscTextFieldForm, DscTitleBar } from '@dsc/web';
import { ModalidadeCertificado } from '@domain/certificado/solicitacao-certificado.models';
import { MascaraCpfPipe } from '@shared/pipes/mascara-cpf.pipe';
import { PARAM_MODALIDADE, ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';

/** Textos que mudam entre as modalidades. */
const TEXTOS = {
  /** [FIGMA: 03.N1 — Nuvem — conferir dados] */
  nuvem: {
    conferencia:
      'Se algum dado estiver incorreto, atualize-o no Portal IntegraMais. Após a atualização, você poderá retornar e conferir seus dados por aqui.',
    alerta: {
      titulo: 'Você está solicitando um certificado em nuvem',
      texto:
        'Seu certificado ficará na infraestrutura do SERPRO. Você usará o celular para autorizar o uso, sem cartão, token ou leitora. Acompanhe as orientações de emissão após o pedido.',
    },
  },
  /** [FIGMA: 03.04 — Conferir dados — certificado físico] */
  'midia-fisica': {
    conferencia: 'Se algum dado estiver incorreto, atualize-o no Portal IntegraMais.',
    alerta: {
      titulo: 'Este pedido não inclui uma nova mídia',
      texto:
        'Você está solicitando somente o certificado digital. Utilize o cartão ou token que já possui ou que sua unidade disponibilizou. Nenhuma mídia física será enviada por este pedido.',
    },
  },
} as const satisfies Record<ModalidadeCertificado, unknown>;

/**
 * Confira seus dados e confirme. [FIGMA: 03.N1 — Nuvem — conferir dados; 03.04 — Conferir dados — certificado físico]
 * A modalidade vem do `data` da rota (withComponentInputBinding).
 * - Dados do IntegraMais, somente leitura; para corrigir, Portal IntegraMais [DOC: HU05].
 * - CPF mascarado [DOC: RNF01] — o protótipo mostra o CPF completo; a máscara foi mantida por decisão de produto.
 * - "Voltar": nuvem → 03.01 com a nuvem selecionada; mídia física → a pergunta respondida antes (03.02 ou 03.02A).
 * - "Confirmar solicitação" envia ao SERPRO; a próxima tela é decidida por SolicitacaoCertificadoJornada.confirmar().
 * [PENDENTE] Link do Portal IntegraMais (sublinhado no protótipo, sem URL definida).
 */
@Component({
  selector: 'app-conferir-dados',
  imports: [RouterLink, DatePipe, MascaraCpfPipe, DscButton, DscCardAlert, DscTextFieldForm, DscTitleBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './conferir-dados.html',
  styleUrl: './conferir-dados.css',
})
export class ConferirDados {
  private readonly jornada = inject(SolicitacaoCertificadoJornada);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** `data.modalidade` da rota. */
  readonly modalidade = input.required<ModalidadeCertificado>();

  protected readonly textos = computed(() => TEXTOS[this.modalidade()]);
  protected readonly dados = this.jornada.dados;
  protected readonly carregando = signal(true);
  protected readonly erroCarregamento = signal(false);
  protected readonly enviando = signal(false);

  protected readonly voltar = computed(() => {
    if (this.modalidade() === 'nuvem') {
      return { url: ROTAS_SOLICITACAO.inicio, query: { [PARAM_MODALIDADE]: 'nuvem' } };
    }
    const url =
      this.jornada.midia() === 'disponibilizada-pela-unidade'
        ? ROTAS_SOLICITACAO.estoque
        : ROTAS_SOLICITACAO.midiaFisica;
    return { url, query: {} };
  });

  constructor() {
    this.jornada
      .carregarDados()
      .pipe(
        finalize(() => this.carregando.set(false)),
        takeUntilDestroyed(),
      )
      .subscribe({ error: () => this.erroCarregamento.set(true) });
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
