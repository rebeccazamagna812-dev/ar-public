import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DscIcon } from '../icon/icon';

export type DscTextFieldState = 'default' | 'read-only' | 'disabled';

let proximoId = 0;

/**
 * [dsc] Text Field Form — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Text Field Form | state=read-only, status=default, filled=true]
 * Nesta etapa só o estado `read-only` foi desenhado no Figma da jornada. O estado `default` segue a mesma estrutura.
 * Também funciona com formulários reativos (ControlValueAccessor).
 */
@Component({
  selector: 'dsc-text-field-form',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DscTextFieldForm),
      multi: true,
    },
  ],
  host: {
    '[class]': '"dsc-text-field-form dsc-text-field-form--" + state()',
  },
  template: `
    <div class="dsc-text-field">
      <div class="dsc-text-field__container">
        <label class="dsc-text-field__label" [for]="inputId">{{ label() }}</label>
        <input
          class="dsc-text-field__input"
          [id]="inputId"
          [type]="type()"
          [value]="currentValue()"
          [readOnly]="state() === 'read-only'"
          [disabled]="state() === 'disabled' || disabledByForm()"
          [attr.autocomplete]="autocomplete() || null"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>
      @if (state() === 'read-only') {
        <span class="dsc-text-field__right">
          <dsc-icon name="lock" size="medium" label="Campo somente leitura" />
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-quark);
      min-width: 0;
    }
    .dsc-text-field {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 48px;
      padding-left: var(--dsc-spacing-smaller);
      border: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-2);
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-neutral-bg-1);
    }
    .dsc-text-field:focus-within {
      border-color: var(--dsc-color-highlight);
      box-shadow: 0 0 0 var(--dsc-border-width-thin) var(--dsc-color-highlight);
    }
    :host(.dsc-text-field-form--read-only) .dsc-text-field,
    :host(.dsc-text-field-form--disabled) .dsc-text-field {
      background: var(--dsc-color-neutral-bg-2);
    }
    .dsc-text-field__container {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      justify-content: center;
    }
    .dsc-text-field__label {
      color: var(--dsc-color-on-neutral-2);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-quark);
      line-height: var(--dsc-font-line-height-16);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-text-field__input {
      width: 100%;
      min-width: 0;
      padding: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
      text-overflow: ellipsis;
    }
    :host(.dsc-text-field-form--read-only) .dsc-text-field__input,
    :host(.dsc-text-field-form--disabled) .dsc-text-field__input {
      color: var(--dsc-color-on-neutral-2);
    }
    .dsc-text-field__right {
      display: inline-flex;
      padding-right: var(--dsc-spacing-tiny);
      padding-left: var(--dsc-spacing-quark);
      color: var(--dsc-color-on-neutral-3);
    }
  `,
})
export class DscTextFieldForm implements ControlValueAccessor {
  readonly label = input.required<string>();
  /** Valor exibido quando o campo não está ligado a um formulário. */
  readonly value = input<string | null | undefined>(undefined);
  readonly state = input<DscTextFieldState>('default');
  readonly type = input<string>('text');
  readonly autocomplete = input<string>('');

  protected readonly inputId = `dsc-text-field-${++proximoId}`;
  private readonly formValue = signal<string | null>(null);
  protected readonly disabledByForm = signal(false);
  protected readonly currentValue = computed(() => this.formValue() ?? this.value() ?? '');

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formValue.set(value);
    this.onChange(value);
  }

  writeValue(value: string | null): void {
    this.formValue.set(value);
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }
}
