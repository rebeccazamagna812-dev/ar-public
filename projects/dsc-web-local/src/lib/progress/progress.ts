import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * [dsc] Progress — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Progress (rótulo label/small + indicador body/small + barra de 8 px)]
 */
@Component({
  selector: 'dsc-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dsc-progress',
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'clamped()',
    '[attr.aria-valuetext]': 'label() + ", " + indicatorText()',
  },
  template: `
    <div class="dsc-progress__labels">
      <span class="dsc-progress__label">{{ label() }}</span>
      <span class="dsc-progress__indicator">{{ indicatorText() }}</span>
    </div>
    <div class="dsc-progress__bar">
      <div class="dsc-progress__fill" [style.width.%]="clamped()"></div>
      <span class="dsc-progress__stop"></span>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-nano);
      width: 100%;
      max-width: 520px;
    }
    .dsc-progress__labels {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-nano);
    }
    .dsc-progress__label {
      flex: 1;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-airy);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-progress__indicator {
      color: var(--dsc-color-on-neutral-2);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-broad);
    }
    .dsc-progress__bar {
      position: relative;
      height: 8px;
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-highlight-bg);
    }
    .dsc-progress__fill {
      height: 100%;
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-highlight);
    }
    .dsc-progress__stop {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 4px;
      height: 4px;
      border-radius: var(--dsc-border-radius-pill);
      background: var(--dsc-color-highlight);
    }
  `,
})
export class DscProgress {
  readonly label = input.required<string>();
  /** Percentual de 0 a 100. */
  readonly value = input.required<number>();
  /** Texto à direita; por padrão "<valor>%". */
  readonly indicator = input<string | undefined>(undefined);

  protected readonly clamped = computed(() => Math.min(100, Math.max(0, Math.round(this.value()))));
  protected readonly indicatorText = computed(() => this.indicator() ?? `${this.clamped()}%`);
}
