import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';
import { DscSeparator } from '../separator/separator';

export type DscCardConfiguration = 'static' | 'radio-button' | 'button';

/**
 * [dsc] Card — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Card | variant=default, configuration=static|radio button|button, status=checked|unchecked]
 * Pode ser usado como elemento (<dsc-card>) ou como atributo em <label>, <a> ou <button> (ex.: o card de rádio é um <label>).
 */
@Component({
  selector: 'dsc-card, [dscCard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"dsc-card dsc-card--" + configuration()',
    '[class.dsc-card--checked]': 'checked()',
  },
  template: `<ng-content />`,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      min-width: 0;
      border: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
      border-radius: var(--dsc-border-radius-large);
      background: var(--dsc-color-neutral-bg-1);
      box-shadow: var(--dsc-elevation-1);
      color: inherit;
      text-decoration: none;
    }
    :host(.dsc-card--radio-button),
    :host(.dsc-card--button) {
      cursor: pointer;
    }
    :host(.dsc-card--button:hover) {
      background: var(--dsc-color-state-neutral-hover-1);
    }
    :host(.dsc-card--radio-button:hover) {
      border-color: var(--dsc-color-outlined-2);
    }
    :host(.dsc-card--checked),
    :host(.dsc-card--checked:hover) {
      border-color: var(--dsc-color-highlight);
    }
    :host(.dsc-card--button:focus-visible),
    :host(.dsc-card--radio-button:has(:focus-visible)) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: var(--dsc-border-width-thick);
    }
  `,
})
export class DscCard {
  readonly configuration = input<DscCardConfiguration>('static');
  readonly checked = input<boolean>(false);
}

/**
 * .[base] Card Header — CÓPIA LOCAL. [FIGMA: Super DSC | Web → .[base] Card Header | content=default]
 */
@Component({
  selector: 'dsc-card-header',
  imports: [DscIcon, DscSeparator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-card-header' },
  template: `
    <div class="dsc-card-header__row">
      @if (icon(); as name) {
        <dsc-icon class="dsc-card-header__icon" [name]="name" [size]="iconSize()" />
      }
      <div class="dsc-card-header__title"><ng-content /></div>
    </div>
    @if (separator()) {
      <dsc-separator />
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-tiny);
      padding: var(--dsc-spacing-tiny) var(--dsc-spacing-tiny) 0;
    }
    :host:has(dsc-separator) {
      padding-bottom: 0;
    }
    :host dsc-separator {
      margin: 0 calc(-1 * var(--dsc-spacing-tiny));
    }
    .dsc-card-header__row {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-tiny);
    }
    .dsc-card-header__icon {
      color: var(--dsc-color-on-neutral-1);
    }
    .dsc-card-header__title {
      flex: 1;
      min-width: 0;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-smaller);
      line-height: var(--dsc-font-line-height-28);
    }
  `,
})
export class DscCardHeader {
  readonly icon = input<DscIconName | undefined>(undefined);
  readonly iconSize = input<'small' | 'medium' | 'huge'>('small');
  readonly separator = input<boolean>(false);
}

/**
 * .[base] Card Body — CÓPIA LOCAL. [FIGMA: Super DSC | Web → .[base] Card Body | spacing=top + sides (+ spacer 16)]
 */
@Component({
  selector: 'dsc-card-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-card-body' },
  template: `<ng-content />`,
  styles: `
    :host {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--dsc-spacing-micro);
      padding: var(--dsc-spacing-tiny);
    }
  `,
})
export class DscCardBody {}
