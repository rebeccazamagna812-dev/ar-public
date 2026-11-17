import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DscBrandSymbol } from '../brand-symbol/brand-symbol';
import { DscIconButton } from '../icon-button/icon-button';

/**
 * [dsc] Header — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Header | breakpoint=extra large, type=system name + icon buttons]
 * Slots: [dscHeaderFeatures] (ex.: "Dúvidas frequentes") e [dscHeaderAccount] (Account Select).
 * O divisor vertical de 32 px é o componente local "AR-CAIXA / Divisor vertical do header" do arquivo do projeto
 * [FIGMA: AR CAIXA → Componentes]. Ele foi incluído aqui para reproduzir o Header como aparece nas telas.
 */
@Component({
  selector: 'dsc-header',
  imports: [DscBrandSymbol, DscIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-header' },
  template: `
    <div class="dsc-header__primary">
      <button
        dscIconButton
        icon="menu"
        type="button"
        [attr.aria-label]="menuLabel()"
        [attr.aria-expanded]="menuExpanded()"
        [attr.aria-controls]="menuControls() || null"
        (click)="menuClick.emit()"
      ></button>
      <div class="dsc-header__brand">
        <dsc-brand-symbol />
        <span class="dsc-header__divider" aria-hidden="true"></span>
        <span class="dsc-header__system">
          <span class="dsc-header__acronym">{{ acronym() }}</span>
          <span class="dsc-header__name">{{ systemName() }}</span>
        </span>
      </div>
    </div>
    <div class="dsc-header__secondary">
      <div class="dsc-header__features"><ng-content select="[dscHeaderFeatures]" /></div>
      <div class="dsc-header__account"><ng-content select="[dscHeaderAccount]" /></div>
    </div>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 var(--dsc-spacing-quark);
      background: var(--dsc-color-background);
    }
    .dsc-header__primary,
    .dsc-header__secondary,
    .dsc-header__features,
    .dsc-header__account {
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .dsc-header__secondary {
      gap: var(--dsc-spacing-nano);
    }
    .dsc-header__brand {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-tiny);
      min-width: 0;
      padding: 0 var(--dsc-spacing-micro);
    }
    .dsc-header__divider {
      display: block;
      width: 0;
      height: 32px;
      border-left: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
    }
    .dsc-header__system {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-micro);
      min-width: 0;
      color: var(--dsc-color-on-neutral-2);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-broad);
      white-space: nowrap;
    }
    .dsc-header__acronym {
      font-weight: var(--dsc-font-weight-600);
    }
    .dsc-header__name {
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Breakpoints do DSC: medium < 1024px, small < 768px [FIGMA: Super DSC | Web → coleção responsive] */
    @media (max-width: 767px) {
      .dsc-header__divider,
      .dsc-header__system {
        display: none;
      }
    }
  `,
})
export class DscHeader {
  readonly acronym = input.required<string>();
  readonly systemName = input.required<string>();
  readonly menuLabel = input<string>('Abrir menu');
  readonly menuExpanded = input<boolean>(false);
  readonly menuControls = input<string>('');
  readonly menuClick = output<void>();
}
