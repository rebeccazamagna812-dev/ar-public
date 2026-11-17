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
import { SolicitacaoNuvemStore } from '../../state/solicitacao-nuvem.store';

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
  templateUrl: './solicitacao-enviada.html',
  styleUrls: ['../../../../shared/styles/pagina.css', './solicitacao-enviada.css'],
})
export class SolicitacaoEnviada {
  protected readonly solicitacao = inject(SolicitacaoNuvemStore).solicitacao;
}
