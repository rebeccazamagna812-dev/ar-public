import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';

export type DscButtonVariant = 'highlight';
export type DscButtonSize = 'standard' | 'small';
/** Corresponde à propriedade "type" do componente no Figma (plain | outline | chromeless). */
export type DscButtonAppearance = 'plain' | 'outline' | 'chromeless';

/**
 * [dsc] Button — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Button | variant=highlight, size=standard|small, type=plain|outline|chromeless]
 * Uso: <button dscButton appearance="plain">Continuar</button>
 * A propriedade "type" do Figma virou `appearance`, para não colidir com o atributo nativo `type` do <button>.
 */
@Component({
  selector: 'button[dscButton], a[dscButton]',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"dsc-button dsc-button--" + appearance() + " dsc-button--" + size() + " dsc-button--" + variant()',
  },
  template: `
    @if (iconLeft(); as icon) {
      <dsc-icon [name]="icon" [size]="size() === 'small' ? 'nano' : 'small'" />
    }
    <span class="dsc-button__text"><ng-content /></span>
    @if (iconRight(); as icon) {
      <dsc-icon [name]="icon" [size]="size() === 'small' ? 'nano' : 'small'" />
    }
  `,
  styles: `
    :host {
      --_fg: var(--dsc-button-fg, var(--dsc-color-highlight));
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dsc-spacing-micro);
      min-height: 44px;
      padding: 0 var(--dsc-spacing-tiny);
      border: var(--dsc-border-width-thin) solid transparent;
      border-radius: var(--dsc-border-radius-pill);
      background: transparent;
      color: var(--_fg);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-loose);
      font-weight: var(--dsc-font-weight-500);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
    }
    :host(.dsc-button--small) {
      gap: var(--dsc-spacing-quark);
      padding: 0 var(--dsc-spacing-nano);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
    }
    :host(.dsc-button--plain) {
      background: var(--dsc-color-highlight);
      border-color: var(--dsc-color-highlight);
      color: var(--dsc-color-on-highlight);
    }
    :host(.dsc-button--plain:hover) {
      background: var(--dsc-color-state-highlight-hover-2);
      border-color: var(--dsc-color-state-highlight-hover-2);
    }
    :host(.dsc-button--plain:active) {
      background: var(--dsc-color-state-highlight-pressed-2);
      border-color: var(--dsc-color-state-highlight-pressed-2);
    }
    :host(.dsc-button--outline) {
      border-color: var(--dsc-color-highlight);
    }
    :host(.dsc-button--outline:hover),
    :host(.dsc-button--chromeless:hover) {
      background: var(--dsc-color-state-highlight-hover-1);
    }
    :host(.dsc-button--outline:active),
    :host(.dsc-button--chromeless:active) {
      background: var(--dsc-color-state-highlight-pressed-1);
    }
    :host(:focus-visible) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: var(--dsc-border-width-thick);
    }
    :host(:disabled),
    :host([aria-disabled='true']) {
      cursor: not-allowed;
      color: var(--dsc-color-state-on-disabled-1);
      background: transparent;
      border-color: transparent;
    }
    :host(.dsc-button--plain:disabled),
    :host(.dsc-button--plain[aria-disabled='true']) {
      background: var(--dsc-color-state-disabled-1);
      border-color: var(--dsc-color-state-disabled-1);
    }
    :host(.dsc-button--outline:disabled),
    :host(.dsc-button--outline[aria-disabled='true']) {
      border-color: var(--dsc-color-state-disabled-outlined-1);
    }
    .dsc-button__text {
      display: inline-block;
    }
  `,
})
export class DscButton {
  readonly variant = input<DscButtonVariant>('highlight');
  readonly size = input<DscButtonSize>('standard');
  readonly appearance = input<DscButtonAppearance>('plain');
  readonly iconLeft = input<DscIconName | undefined>(undefined);
  readonly iconRight = input<DscIconName | undefined>(undefined);
}
