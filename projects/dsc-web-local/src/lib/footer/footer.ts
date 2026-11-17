import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscBrandSymbol } from '../brand-symbol/brand-symbol';

/**
 * [dsc] Footer — CÓPIA LOCAL. [FIGMA: Super DSC | Web → [dsc] Footer | device=desktop]
 */
@Component({
  selector: 'dsc-footer',
  imports: [DscBrandSymbol],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-footer', role: 'contentinfo' },
  template: `
    <div class="dsc-footer__primary">
      <dsc-brand-symbol />
      <span class="dsc-footer__info">
        @if (cgc()) {
          <span class="dsc-footer__strong">{{ cgc() }}</span>
        }
        @if (sigla()) {
          <span class="dsc-footer__strong">{{ sigla() }}</span>
        }
        @if (supportingText()) {
          <span>{{ supportingText() }}</span>
        }
      </span>
    </div>
    <div class="dsc-footer__secondary">
      @if (version()) {
        <span>{{ version() }}</span>
      }
      <span>{{ copyright() }}</span>
    </div>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--dsc-spacing-tiny) var(--dsc-spacing-small);
      padding: var(--dsc-spacing-small) var(--dsc-spacing-large);
      border-top: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
      background: var(--dsc-color-background);
      color: var(--dsc-color-on-neutral-3);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-broad);
    }
    .dsc-footer__primary,
    .dsc-footer__secondary,
    .dsc-footer__info {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--dsc-spacing-tiny);
    }
    .dsc-footer__strong {
      font-weight: var(--dsc-font-weight-600);
    }
    @media (max-width: 767px) {
      :host {
        padding: var(--dsc-spacing-smaller) var(--dsc-spacing-tiny);
      }
    }
  `,
})
export class DscFooter {
  readonly cgc = input<string>('');
  readonly sigla = input<string>('');
  readonly supportingText = input<string>('');
  readonly version = input<string>('');
  readonly copyright = input.required<string>();
}
