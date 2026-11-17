import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DscButton,
  DscCard,
  DscCardBody,
  DscCardHeader,
  DscLabelValuePair,
  DscProgress,
  DscStateMessage,
} from '@dsc/web';
import { ETAPAS_JORNADA } from '../../solicitacao-certificado.etapas';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';

/**
 * Solicitação enviada. [FIGMA: 01.04 — Solicitação enviada]
 * Ações conforme o protótipo: "Voltar ao início" → 01.01; "Acompanhar solicitações" → 07.01.
 */
@Component({
  selector: 'app-solicitacao-enviada',
  imports: [
    RouterLink,
    DscButton,
    DscCard,
    DscCardBody,
    DscCardHeader,
    DscLabelValuePair,
    DscProgress,
    DscStateMessage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './solicitacao-enviada.html',
  styleUrl: './solicitacao-enviada.css',
})
export class SolicitacaoEnviada {
  protected readonly etapa = ETAPAS_JORNADA.concluido;
  protected readonly rotaInicio = ROTAS_SOLICITACAO.inicio;
  protected readonly solicitacao = inject(SolicitacaoCertificadoJornada).solicitacao;
}
