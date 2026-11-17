import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';

/**
 * [dsc] Account Select — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Account Select | state=default, avatar=undefined, variant=user, collapsed=false]
 * Use em um <button>: <button dscAccountSelect name="…" label1="…" label2="…"></button>
 */
@Component({
  selector: 'button[dscAccountSelect]',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-account-select' },
  template: `
    <span class="dsc-account-select__avatar" aria-hidden="true">
      <dsc-icon name="user" size="medium" />
    </span>
    <span class="dsc-account-select__text">
      <span class="dsc-account-select__name">{{ name() }}</span>
      <span class="dsc-account-select__labels">
        <span class="dsc-account-select__label1">{{ label1() }}</span>
        @if (label2()) {
          <span class="dsc-account-select__dot" aria-hidden="true">•</span>
          <span class="dsc-account-select__label2">{{ label2() }}</span>
        }
      </span>
    </span>
    <dsc-icon class="dsc-account-select__chevron" name="nav-arrow-down" size="small" />
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--dsc-spacing-micro);
      width: 256px;
      max-width: 100%;
      height: 64px;
      padding: 0 var(--dsc-spacing-micro);
      border: none;
      background: transparent;
      text-align: left;
      cursor: pointer;
    }
    :host(:hover) {
      background: var(--dsc-color-state-neutral-hover-1);
    }
    :host(:focus-visible) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: calc(-1 * var(--dsc-border-width-thick));
    }
    .dsc-account-select__avatar {
      display: inline-flex;
      flex: none;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-neutral-bg-3);
      color: var(--dsc-color-on-neutral-3);
    }
    .dsc-account-select__text {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
    }
    .dsc-account-select__name {
      overflow: hidden;
      color: var(--dsc-color-on-neutral-1);
      letter-spacing: var(--dsc-font-letter-spacing-broad);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dsc-account-select__labels {
      display: flex;
      gap: var(--dsc-spacing-quark);
      font-weight: var(--dsc-font-weight-500);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
    }
    .dsc-account-select__label1 {
      color: var(--dsc-color-highlight);
    }
    .dsc-account-select__dot {
      color: var(--dsc-color-state-disabled-outlined-2);
    }
    .dsc-account-select__label2 {
      color: var(--dsc-color-on-neutral-3);
    }
    .dsc-account-select__chevron {
      color: var(--dsc-color-on-neutral-3);
    }
    @media (max-width: 767px) {
      :host {
        width: auto;
      }
      .dsc-account-select__text {
        display: none;
      }
    }
  `,
})
export class DscAccountSelect {
  readonly name = input.required<string>();
  readonly label1 = input<string>('');
  readonly label2 = input<string>('');
}
