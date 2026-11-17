import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * [dsc] Label Value Pair — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Label Value Pair | variant=default|emphasized, alignment=left, configuration=column]
 * O valor pode ser passado pelo input `value` ou projetado como conteúdo.
 */
@Component({
  selector: 'dsc-label-value-pair',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"dsc-label-value-pair dsc-label-value-pair--" + variant()',
  },
  template: `
    <span class="dsc-lvp__label">{{ label() }}</span>
    <span class="dsc-lvp__value">{{ value() }}<ng-content /></span>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      margin: 0;
    }
    .dsc-lvp__label {
      color: var(--dsc-color-on-neutral-3);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-lvp__value {
      margin: 0;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
    :host(.dsc-label-value-pair--emphasized) .dsc-lvp__value {
      font-weight: var(--dsc-font-weight-600);
    }
  `,
})
export class DscLabelValuePair {
  readonly label = input.required<string>();
  readonly value = input<string>('');
  readonly variant = input<'default' | 'emphasized'>('default');
}
