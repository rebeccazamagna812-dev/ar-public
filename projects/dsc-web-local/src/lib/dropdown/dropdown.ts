import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';

/**
 * [dsc] Dropdown — CÓPIA LOCAL. [FIGMA: Super DSC | Web → [dsc] Dropdown | variant=default (Menu da conta)]
 */
@Component({
  selector: 'dsc-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-dropdown', role: 'menu' },
  template: `<ng-content />`,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: 320px;
      max-width: calc(100vw - 2 * var(--dsc-spacing-tiny));
      padding: var(--dsc-spacing-quark) 0;
      border: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
      border-radius: var(--dsc-border-radius-large);
      background: var(--dsc-color-neutral-bg-1);
      box-shadow: var(--dsc-elevation-2);
    }
  `,
})
export class DscDropdown {}

/** .[base] Dropdown Item — CÓPIA LOCAL. [FIGMA: Super DSC | Web → .[base] Dropdown Item | variant=default] */
@Component({
  selector: 'button[dscDropdownItem], a[dscDropdownItem]',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-dropdown-item', role: 'menuitem' },
  template: `
    @if (icon(); as name) {
      <dsc-icon [name]="name" size="medium" />
    }
    <span class="dsc-dropdown-item__text"><ng-content /></span>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-micro);
      width: 100%;
      min-height: 48px;
      padding: var(--dsc-spacing-micro) var(--dsc-spacing-tiny);
      border: none;
      background: transparent;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }
    :host(:hover) {
      background: var(--dsc-color-state-neutral-hover-1);
    }
    :host(:focus-visible) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: calc(-1 * var(--dsc-border-width-thick));
    }
  `,
})
export class DscDropdownItem {
  readonly icon = input<DscIconName | undefined>(undefined);
}
