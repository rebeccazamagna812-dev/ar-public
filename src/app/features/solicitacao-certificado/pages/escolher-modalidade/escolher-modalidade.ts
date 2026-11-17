import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DscButton, DscCardAlert, DscModal, DscTitleBar } from '@dsc/web';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { ModalidadeCertificado, SituacaoCertificadoAnterior } from '@domain/certificado/solicitacao-certificado.models';
import { OpcaoRadio, OpcoesRadio } from '@shared/ui/opcoes-radio/opcoes-radio';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';

/** [FIGMA: 03.01 — cards "Respostas — Modalidade"] */
const OPCOES_MODALIDADE: readonly OpcaoRadio<ModalidadeCertificado>[] = [
  {
    valor: 'nuvem',
    rotulo: 'Em nuvem — autorização pelo celular',
    descricao:
      'O certificado fica na infraestrutura do SERPRO. Você autoriza o uso pelo celular, sem cartão, token ou leitora.',
  },
  {
    valor: 'midia-fisica',
    rotulo: 'Em mídia física — cartão ou token',
    descricao:
      'O certificado fica guardado no dispositivo físico. O cartão precisa de leitora; o token conecta diretamente à USB.',
  },
];

/** [FIGMA: 03.00 — Modal "Antes de solicitar seu certificado"] */
const OPCOES_SITUACAO: readonly OpcaoRadio<SituacaoCertificadoAnterior>[] = [
  { valor: 'primeiro', rotulo: 'É meu primeiro certificado digital' },
  { valor: 'revogado', rotulo: 'Já revoguei meu certificado anterior' },
  { valor: 'vencido', rotulo: 'Meu certificado anterior já venceu' },
  { valor: 'valido-nao-revogado', rotulo: 'Ainda tenho certificado válido e não revoguei' },
];

/**
 * Escolha da modalidade, com a triagem do certificado anterior em modal.
 * [FIGMA: Fluxo V1 (em andamento) → 03.00 — Entrada — situação do certificado anterior;
 *  03.01 — Escolher modalidade — após orientação]
 * - Ao entrar na jornada, o modal 03.00 pergunta a situação do certificado anterior. "Ainda tenho certificado
 *   válido e não revoguei" esconde o "Continuar": resta "Consultar meus certificados" ou "Cancelar".
 * - Só aparecem as modalidades elegíveis [DOC: HU02 CA02, HU03a CA02, HU03c CA02]. Simulação: `?cenario=nao-elegivel`.
 * - "Continuar" fica desabilitado até escolher; "Entender as diferenças" abre 03.01A.
 * - `?modalidade=nuvem` deixa a nuvem pré-selecionada (usado por "Tentar novamente", 01.E4).
 * - 03.00b (autorização de segundo certificado) não foi implementada: ainda em discussão.
 */
@Component({
  selector: 'app-escolher-modalidade',
  imports: [RouterLink, DscButton, DscCardAlert, DscModal, DscTitleBar, OpcoesRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './escolher-modalidade.html',
})
export class EscolherModalidade {
  private readonly router = inject(Router);
  private readonly jornada = inject(SolicitacaoCertificadoJornada);
  private readonly elegibilidade = inject(ElegibilidadeService);

  /** Query param `modalidade` (withComponentInputBinding). */
  readonly modalidade = input<string | undefined>(undefined);

  protected readonly rotaModalidades = ROTAS_SOLICITACAO.modalidades;
  protected readonly falhaElegibilidade = this.elegibilidade.falhou;

  protected readonly opcoesModalidade = computed(() =>
    OPCOES_MODALIDADE.filter((opcao) =>
      opcao.valor === 'nuvem' ? this.elegibilidade.podeSolicitarNuvem() : this.elegibilidade.podeSolicitarMidiaFisica(),
    ),
  );

  protected readonly selecionada = linkedSignal<string | null>(() =>
    this.modalidade() === 'nuvem' && this.elegibilidade.podeSolicitarNuvem() ? 'nuvem' : null,
  );

  // Triagem (modal 03.00)
  protected readonly opcoesSituacao = OPCOES_SITUACAO;
  protected readonly triagemAberta = computed(() => !this.jornada.triagemConcluida());
  protected readonly situacao = signal<string | null>(null);
  protected readonly precisaRevogar = computed(() => this.situacao() === 'valido-nao-revogado');

  protected continuarTriagem(): void {
    const situacao = OPCOES_SITUACAO.find((o) => o.valor === this.situacao())?.valor;
    if (situacao) {
      this.jornada.responderTriagem(situacao);
    }
  }

  /** "Cancelar" ou Esc no modal: volta à Página principal [FIGMA: 03.00 — Cancelar → 01.00]. */
  protected cancelarTriagem(): void {
    void this.router.navigateByUrl('/');
  }

  protected continuar(): void {
    const modalidade = OPCOES_MODALIDADE.find((o) => o.valor === this.selecionada())?.valor;
    if (modalidade) {
      void this.router.navigateByUrl(this.jornada.escolherModalidade(modalidade));
    }
  }
}
