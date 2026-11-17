import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscCardAlert } from '@dsc/web';
import { ITENS_NAVEGACAO, ItemNavegacao, ORDEM_HOME } from '@core/navegacao/navegacao';
import { CardAcesso } from '@shared/ui/card-acesso/card-acesso';

/**
 * Página principal. [FIGMA: Fluxo V1 (em andamento) 2 → 00.01 — Home]
 * Os "Saiba mais" abrem modais no Figma (00.01.A1/A2); nesta etapa eles levam a rotas placeholder.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, DscButton, DscCardAlert, CardAcesso],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrls: ['../../shared/styles/pagina.css', './home.css'],
})
export class Home {
  protected readonly cards = ORDEM_HOME.map((rota) => ITENS_NAVEGACAO.find((i) => i.rota === rota)).filter(
    (i): i is ItemNavegacao & { home: NonNullable<ItemNavegacao['home']> } => !!i?.home,
  );
}
