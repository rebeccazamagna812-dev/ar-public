import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';

/**
 * [dsc] Icon Button — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Icon Button | variant=highlight, size=standard, type=chromeless (44×44)]
 * `aria-label` é obrigatório no elemento host, porque o botão não tem texto visível.
 */
@Component({
  selector: 'button[dscIconButton]',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-icon-button' },
  template: `<dsc-icon [name]="icon()" size="small" />`,
  styles: `
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: none;
      border-radius: var(--dsc-border-radius-pill);
      background: transparent;
      color: var(--dsc-color-highlight);
      cursor: pointer;
    }
    :host(:hover) {
      background: var(--dsc-color-state-highlight-hover-1);
    }
    :host(:active) {
      background: var(--dsc-color-state-highlight-pressed-1);
    }
    :host(:focus-visible) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: calc(-1 * var(--dsc-border-width-thick));
    }
  `,
})
export class DscIconButton {
  readonly icon = input.required<DscIconName>();
}
