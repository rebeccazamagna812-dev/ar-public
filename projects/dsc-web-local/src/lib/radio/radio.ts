import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

let proximoId = 0;

/**
 * [dsc] Radio — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Radio | state=default, variant=highlight, status=checked|unchecked]
 * Usa um <input type="radio"> nativo (acessível por teclado) com o controle visual do DSC.
 */
@Component({
  selector: 'dsc-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-radio' },
  template: `
    <input
      class="dsc-radio__input"
      type="radio"
      [id]="inputId"
      [name]="name()"
      [value]="value()"
      [checked]="checked()"
      [disabled]="disabled()"
      (change)="selected.emit(value())"
    />
    <span class="dsc-radio__control" aria-hidden="true"></span>
    <label class="dsc-radio__label" [for]="inputId"><ng-content /></label>
  `,
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--dsc-spacing-micro);
      min-height: 44px;
    }
    .dsc-radio__input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
    .dsc-radio__control {
      box-sizing: border-box;
      position: relative;
      flex: none;
      width: 24px;
      height: 24px;
      border: var(--dsc-border-width-thick) solid var(--dsc-color-on-neutral-2);
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-neutral-bg-1);
    }
    .dsc-radio__input:checked + .dsc-radio__control {
      border-color: var(--dsc-color-highlight);
      background: var(--dsc-color-highlight);
    }
    .dsc-radio__input:checked + .dsc-radio__control::after {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: var(--dsc-border-radius-pill);
      background: radial-gradient(
        circle,
        var(--dsc-color-highlight) 0 3px,
        var(--dsc-color-on-highlight) 3.5px
      );
    }
    .dsc-radio__input:focus-visible + .dsc-radio__control {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: var(--dsc-border-width-thick);
    }
    .dsc-radio__input:disabled + .dsc-radio__control {
      border-color: var(--dsc-color-state-disabled-outlined-2);
      background: var(--dsc-color-state-disabled-1);
    }
    .dsc-radio__label {
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
      cursor: pointer;
    }
  `,
})
export class DscRadio {
  readonly name = input.required<string>();
  readonly value = input.required<string>();
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly selected = output<string>();

  protected readonly inputId = `dsc-radio-${++proximoId}`;
}
