import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscCardAlert, DscTitleBar } from '@dsc/web';
import { IdOrientacao, ORIENTACOES } from './orientacoes';

/**
 * Tela de orientação da jornada de mídia física, guiada por configuração (orientacoes.ts).
 * [FIGMA: 03.02B — Aguardar consulta à unidade; 03.02C — Unidade sem mídia disponível]
 * A orientação vem do `data` da rota.
 */
@Component({
  selector: 'app-orientacao',
  imports: [RouterLink, DscButton, DscCardAlert, DscTitleBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  template: `
    @let c = conteudo();
    <dsc-title-bar [title]="c.titulo" [subtitle]="c.subtitulo">
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="arrow-left" [routerLink]="c.voltar">Voltar</a>
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="home" routerLink="/">Página principal</a>
    </dsc-title-bar>

    <dsc-card-alert [title]="c.alerta.titulo">{{ c.alerta.texto }}</dsc-card-alert>
    <p class="dsc-typography-body-standard">{{ c.texto }}</p>

    <div class="pagina__acoes pagina__acoes--apos-conteudo">
      @for (acao of c.acoes; track acao.rotulo) {
        <a dscButton [appearance]="acao.aparencia" [routerLink]="acao.destino">{{ acao.rotulo }}</a>
      }
    </div>
  `,
})
export class Orientacao {
  /** `data.orientacao` da rota. */
  readonly orientacao = input.required<IdOrientacao>();

  protected readonly conteudo = computed(() => ORIENTACOES[this.orientacao()]);
}
