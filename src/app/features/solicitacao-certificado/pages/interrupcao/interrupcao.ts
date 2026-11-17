import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscProgress, DscStateMessage } from '@dsc/web';
import { PARAM_MODALIDADE, ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';
import { INTERRUPCOES, isMotivoInterrupcao } from './interrupcoes';

/**
 * Interrupções da jornada. [FIGMA: 01.E1 — Não elegível; 01.E2 — Certificado em nuvem ativo;
 * 01.E3 — Divergência cadastral; 01.E4 — SERPRO indisponível]
 * Telas do fluxo anterior, MANTIDAS por decisão de produto (saíram do protótipo da seção 03).
 * "Voltar" e as ações principais retornam à escolha da modalidade (03.01), exceto "Tentar novamente" (01.E4):
 * nuvem → 03.01 com a nuvem selecionada; mídia física → conferir dados (03.04), com a mídia já informada.
 */
@Component({
  selector: 'app-interrupcao',
  imports: [RouterLink, DscButton, DscProgress, DscStateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './interrupcao.html',
})
export class Interrupcao {
  /** Parâmetro de rota `:motivo` (withComponentInputBinding). Validado pelo guard da rota. */
  readonly motivo = input.required<string>();

  private readonly jornada = inject(SolicitacaoCertificadoJornada);

  protected readonly rotaInicio = ROTAS_SOLICITACAO.inicio;

  protected readonly conteudo = computed(() => {
    const motivo = this.motivo();
    return isMotivoInterrupcao(motivo) ? INTERRUPCOES[motivo] : INTERRUPCOES['serpro-indisponivel'];
  });

  protected readonly acaoPrincipal = computed(() => {
    if (!this.conteudo().acaoPrincipal.tentarNovamente) {
      return { url: ROTAS_SOLICITACAO.inicio, query: {} };
    }
    if (this.jornada.podeConferirMidiaFisica()) {
      return { url: ROTAS_SOLICITACAO.dados('midia-fisica'), query: {} };
    }
    return { url: ROTAS_SOLICITACAO.inicio, query: { [PARAM_MODALIDADE]: 'nuvem' } };
  });
}
