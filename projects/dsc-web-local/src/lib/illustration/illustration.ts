import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DscIllustrationName = 'success' | 'warning' | 'error';

/**
 * [dsc] Illustration — CÓPIA LOCAL APROXIMADA.
 * [FIGMA: Super DSC | Web → [dsc] Illustration - Success - Positive Alert | Warning - Amber Alert | Error - Danger Alert (128×128)]
 * No DSC estas ilustrações são imagens (PNG) da biblioteca. Aqui elas foram redesenhadas em SVG
 * com os tokens de cor, só para a prototipação. Na troca pela biblioteca oficial, valem as imagens do DSC.
 */
@Component({
  selector: 'dsc-illustration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-illustration', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <filter id="dsc-illus-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.12" />
        </filter>
      </defs>
      @switch (name()) {
        @case ('success') {
          <circle class="bg bg--success" cx="64" cy="64" r="64" />
          <path
            class="badge"
            filter="url(#dsc-illus-shadow)"
            d="M64 24l8.2 5.6 9.9-.6 4.4 8.9 8.9 4.4-.6 9.9L100.4 60l-5.6 8.2.6 9.9-8.9 4.4-4.4 8.9-9.9-.6L64 96.4l-8.2-5.6-9.9.6-4.4-8.9-8.9-4.4.6-9.9L27.6 60l5.6-8.2-.6-9.9 8.9-4.4 4.4-8.9 9.9.6z"
          />
          <path class="mark mark--success" d="M50 61l10 10 19-20" />
        }
        @case ('warning') {
          <circle class="bg bg--warning" cx="64" cy="64" r="64" />
          <path
            class="badge"
            filter="url(#dsc-illus-shadow)"
            d="M58.8 33.5a6 6 0 0 1 10.4 0l27.6 47.8a6 6 0 0 1-5.2 9H36.4a6 6 0 0 1-5.2-9z"
          />
          <path class="mark mark--warning" d="M64 52v16" />
          <circle class="dot dot--warning" cx="64" cy="78" r="2.6" />
        }
        @case ('error') {
          <circle class="bg bg--error" cx="64" cy="64" r="64" />
          <path
            class="badge"
            filter="url(#dsc-illus-shadow)"
            d="M47 34.6a6 6 0 0 1 5.2-3h23.6a6 6 0 0 1 5.2 3l11.8 20.4a6 6 0 0 1 0 6L81 81.4a6 6 0 0 1-5.2 3H52.2a6 6 0 0 1-5.2-3L35.2 61a6 6 0 0 1 0-6z"
          />
          <path class="mark mark--error" d="M64 47v15" />
          <circle class="dot dot--error" cx="64" cy="71" r="2.6" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 128px;
      height: 128px;
      flex: none;
    }
    .bg--success {
      fill: var(--dsc-color-success-outlined);
    }
    .bg--warning {
      fill: var(--dsc-color-warning-outlined);
    }
    .bg--error {
      fill: var(--dsc-color-danger-outlined);
    }
    .badge {
      fill: var(--dsc-color-neutral-bg-1);
    }
    .mark {
      fill: none;
      stroke-width: 5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .mark--success {
      stroke: var(--dsc-color-success);
    }
    .mark--warning {
      stroke: var(--dsc-color-warning);
    }
    .mark--error {
      stroke: var(--dsc-color-danger);
    }
    .dot--warning {
      fill: var(--dsc-color-warning);
    }
    .dot--error {
      fill: var(--dsc-color-danger);
    }
  `,
})
export class DscIllustration {
  readonly name = input.required<DscIllustrationName>();
}
