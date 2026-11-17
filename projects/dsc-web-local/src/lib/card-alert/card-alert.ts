import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';

export type DscCardAlertVariant = 'informative' | 'warning' | 'danger' | 'success';

/**
 * [dsc] Card Alert — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Card Alert | variant=informative, action=false|true]
 * Conteúdo projetado = texto do alerta; o slot `[dscCardAlertAction]` recebe a ação (ex.: "Saiba mais").
 */
@Component({
  selector: 'dsc-card-alert',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'note',
    '[class]': '"dsc-card-alert dsc-card-alert--" + variant()',
  },
  template: `
    <dsc-icon class="dsc-card-alert__icon" [name]="iconName()" size="medium" />
    <div class="dsc-card-alert__content">
      @if (title()) {
        <p class="dsc-card-alert__title">{{ title() }}</p>
      }
      <div class="dsc-card-alert__text"><ng-content /></div>
      <div class="dsc-card-alert__actions"><ng-content select="[dscCardAlertAction]" /></div>
    </div>
  `,
  styles: `
    :host {
      --_bg: var(--dsc-color-information-bg);
      --_accent: var(--dsc-color-information);
      --_title: var(--dsc-color-on-informantion-bg);
      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
      gap: var(--dsc-spacing-tiny);
      width: 100%;
      padding: var(--dsc-spacing-micro) var(--dsc-spacing-tiny);
      border-radius: var(--dsc-border-radius-large);
      background: var(--_bg);
    }
    :host(.dsc-card-alert--warning) {
      --_bg: var(--dsc-color-warning-bg);
      --_accent: var(--dsc-color-warning);
      --_title: var(--dsc-color-on-warning-bg);
    }
    :host(.dsc-card-alert--danger) {
      --_bg: var(--dsc-color-danger-bg);
      --_accent: var(--dsc-color-danger);
      --_title: var(--dsc-color-on-danger-bg);
    }
    :host(.dsc-card-alert--success) {
      --_bg: var(--dsc-color-success-bg);
      --_accent: var(--dsc-color-success);
      --_title: var(--dsc-color-on-success-bg);
    }
    .dsc-card-alert__icon {
      color: var(--_accent);
    }
    .dsc-card-alert__content {
      display: flex;
      flex: 1;
      min-width: 0;
      flex-direction: column;
      gap: var(--dsc-spacing-nano);
    }
    .dsc-card-alert__title {
      margin: 0;
      color: var(--_title);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-tiny);
      line-height: var(--dsc-font-line-height-28);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
    .dsc-card-alert__text {
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
    .dsc-card-alert__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dsc-spacing-micro);
      margin-top: calc(-1 * var(--dsc-spacing-nano));
      margin-bottom: calc(-1 * var(--dsc-spacing-micro));
      --dsc-button-fg: var(--_title);
    }
    .dsc-card-alert__actions:empty {
      display: none;
    }
  `,
})
export class DscCardAlert {
  readonly variant = input<DscCardAlertVariant>('informative');
  readonly title = input<string>('');
  readonly icon = input<DscIconName | undefined>(undefined);

  protected readonly iconName = computed<DscIconName>(() => this.icon() ?? 'info-circle');
}
