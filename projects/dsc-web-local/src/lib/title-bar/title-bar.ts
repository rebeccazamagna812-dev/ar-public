import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * [dsc] Title Bar — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Title Bar | device=desktop, variant=home, container=wide]
 * Subtítulo (opcional) acima do título da página; ações à direita no slot `[dscTitleBarAction]`
 * (ex.: "Voltar", "Página principal"); separador inferior.
 * O título é o <h1> da página.
 */
@Component({
  selector: 'dsc-title-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-title-bar' },
  template: `
    @if (subtitle()) {
      <p class="dsc-title-bar__subtitle">{{ subtitle() }}</p>
    }
    <div class="dsc-title-bar__row">
      <h1 class="dsc-title-bar__title">{{ title() }}</h1>
      <div class="dsc-title-bar__actions"><ng-content select="[dscTitleBarAction]" /></div>
    </div>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-quark);
      padding: var(--dsc-spacing-smaller) 0 var(--dsc-spacing-tiny);
      border-bottom: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
    }
    .dsc-title-bar__subtitle {
      margin: 0;
      color: var(--dsc-color-on-neutral-3);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-title-bar__row {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-smaller);
      min-height: 44px;
    }
    .dsc-title-bar__title {
      flex: 1;
      min-width: 0;
      margin: 0;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-small);
      line-height: var(--dsc-font-line-height-32);
      font-weight: var(--dsc-font-weight-400);
    }
    .dsc-title-bar__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--dsc-spacing-nano);
    }
    .dsc-title-bar__actions:empty {
      display: none;
    }
    /* Breakpoint small do DSC (< 768px): ações abaixo do título. */
    @media (max-width: 767px) {
      .dsc-title-bar__row {
        flex-wrap: wrap;
      }
      .dsc-title-bar__title {
        flex-basis: 100%;
      }
    }
  `,
})
export class DscTitleBar {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
