import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscCardAlert } from '@dsc/web';

/**
 * Tela genérica das funcionalidades ainda não implementadas.
 * Os inputs vêm de `data` da rota (withComponentInputBinding). [PADRÃO DE MERCADO]
 */
@Component({
  selector: 'app-placeholder',
  imports: [RouterLink, DscButton, DscCardAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  template: `
    <div class="pagina__cabecalho">
      <h1 class="pagina__titulo">{{ titulo() }}</h1>
      <a dscButton appearance="chromeless" iconLeft="home" routerLink="/">Página principal</a>
    </div>
    <dsc-card-alert title="Em construção">
      Esta funcionalidade ainda não foi implementada nesta etapa do projeto.
      @if (origem()) {
        Referência de design: {{ origem() }}.
      }
    </dsc-card-alert>
  `,
})
export class Placeholder {
  readonly titulo = input.required<string>();
  readonly origem = input<string>('');
}
