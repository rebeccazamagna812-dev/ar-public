import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DscButton, DscListItem, DscProgress, DscStateMessage } from '@dsc/web';
import { ModalidadeCertificado } from '@domain/certificado/solicitacao-certificado.models';
import { ETAPAS_JORNADA } from '../../solicitacao-certificado.etapas';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';

/**
 * Solicitação enviada. [FIGMA: 03.N2 — Nuvem — solicitação enviada; 03.05 — Solicitação enviada (mídia física)]
 * A modalidade vem do `data` da rota (withComponentInputBinding). Mídia física tem a linha extra "Certificado e mídia".
 * Ações: "Voltar ao início" recomeça a solicitação (decisão de produto; no protótipo, volta uma tela);
 * "Meus pedidos" → Acompanhar solicitações [FIGMA: 08.01].
 */
@Component({
  selector: 'app-solicitacao-enviada',
  imports: [RouterLink, DscButton, DscListItem, DscProgress, DscStateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  templateUrl: './solicitacao-enviada.html',
  styleUrl: './solicitacao-enviada.css',
})
export class SolicitacaoEnviada {
  private readonly jornada = inject(SolicitacaoCertificadoJornada);
  private readonly router = inject(Router);

  /** `data.modalidade` da rota. */
  readonly modalidade = input.required<ModalidadeCertificado>();

  protected readonly etapa = ETAPAS_JORNADA.concluido;
  protected readonly solicitacao = this.jornada.solicitacao;

  protected recomecar(): void {
    this.jornada.reiniciar();
    void this.router.navigateByUrl(ROTAS_SOLICITACAO.inicio);
  }
}
