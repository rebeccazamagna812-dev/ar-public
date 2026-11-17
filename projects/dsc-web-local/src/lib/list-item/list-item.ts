import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * [dsc] List Item — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] List Item | variant=default, selection=none; Text Content configuration=inverted]
 * Rótulo pequeno acima do valor, com separador inferior. O valor vem do input `value` ou do conteúdo projetado.
 * Use dentro de um contêiner com role="list".
 */
@Component({
  selector: 'dsc-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-list-item', role: 'listitem' },
  template: `
    <span class="dsc-list-item__label">{{ label() }}</span>
    <span class="dsc-list-item__value">{{ value() }}<ng-content /></span>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-quark);
      padding: var(--dsc-spacing-micro) var(--dsc-spacing-tiny);
      border-bottom: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
    }
    :host(:last-child) {
      border-bottom: none;
    }
    .dsc-list-item__label {
      color: var(--dsc-color-on-neutral-2);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-list-item__value {
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
  `,
})
export class DscListItem {
  readonly label = input.required<string>();
  readonly value = input<string>('');
}
