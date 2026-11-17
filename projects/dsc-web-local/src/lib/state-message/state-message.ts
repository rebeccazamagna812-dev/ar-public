import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIllustration, DscIllustrationName } from '../illustration/illustration';

/**
 * [dsc-tc] State Message — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc-tc] State Message | variant=custom, configuration=illustration]
 * O título (`label`) é renderizado como cabeçalho de nível `headingLevel` (padrão h1), porque nas telas de
 * feedback ele é o título da página.
 */
@Component({
  selector: 'dsc-state-message',
  imports: [DscIllustration],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-state-message' },
  template: `
    <dsc-illustration [name]="illustration()" />
    <div class="dsc-state-message__textual">
      <div class="dsc-state-message__label" role="heading" [attr.aria-level]="headingLevel()">
        {{ label() }}
      </div>
      <div class="dsc-state-message__text"><ng-content /></div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--dsc-spacing-nano);
      width: 100%;
      text-align: center;
    }
    .dsc-state-message__textual {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-nano);
      width: 100%;
    }
    .dsc-state-message__label {
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-small);
      line-height: var(--dsc-font-line-height-32);
    }
    .dsc-state-message__text {
      color: var(--dsc-color-on-neutral-3);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
  `,
})
export class DscStateMessage {
  readonly illustration = input.required<DscIllustrationName>();
  readonly label = input.required<string>();
  readonly headingLevel = input<number>(1);
}
