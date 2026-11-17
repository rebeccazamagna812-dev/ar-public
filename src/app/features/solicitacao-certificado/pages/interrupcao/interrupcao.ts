import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscProgress, DscStateMessage } from '@dsc/web';
import { PARAM_MODALIDADE, ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { INTERRUPCOES, isMotivoInterrupcao } from './interrupcoes';

/**
 * Interrupções da jornada. [FIGMA: 01.E1 — Não elegível; 01.E2 — Certificado em nuvem ativo;
 * 01.E3 — Divergência cadastral; 01.E4 — SERPRO indisponível]
 * Destinos dos botões conforme o protótipo: todos voltam a 01.01, exceto "Tentar novamente" (01.E4 → 01.01A).
 */
@Component({
  selector: 'app-interrupcao',
  imports: [RouterLink, DscButton, DscProgress, DscStateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './interrupcao.html',
  styleUrl: '../../../../shared/styles/pagina.css',
})
export class Interrupcao {
  /** Parâmetro de rota `:motivo` (withComponentInputBinding). Validado pelo guard da rota. */
  readonly motivo = input.required<string>();

  protected readonly rotaInicio = ROTAS_SOLICITACAO.inicio;
  protected readonly paramNuvem = { [PARAM_MODALIDADE]: 'nuvem' };

  protected readonly conteudo = computed(() => {
    const motivo = this.motivo();
    return isMotivoInterrupcao(motivo) ? INTERRUPCOES[motivo] : INTERRUPCOES['serpro-indisponivel'];
  });
}
