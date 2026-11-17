import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DscIcon } from '../icon/icon';
import { DscIconName } from '../icon/icons';

/**
 * [dsc] Sidebar Menu — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Sidebar Menu | device=desktop, level=menu, compact=false (largura 288 px)]
 * Só o painel. Abrir, fechar e posicionar como overlay fica com o shell da aplicação.
 */
@Component({
  selector: 'dsc-sidebar-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-sidebar-menu' },
  template: `
    <nav class="dsc-sidebar-menu__body" [attr.aria-label]="groupTitle()">
      <p class="dsc-sidebar-menu__group" aria-hidden="true">{{ groupTitle() }}</p>
      <ul class="dsc-sidebar-menu__list" role="list">
        <ng-content />
      </ul>
    </nav>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      width: var(--dsc-sidebar-menu-width);
      max-width: 100vw;
      height: 100%;
      overflow-y: auto;
      background: var(--dsc-color-background);
    }
    .dsc-sidebar-menu__body {
      padding: var(--dsc-spacing-nano) var(--dsc-spacing-tiny) var(--dsc-spacing-nano) 0;
    }
    .dsc-sidebar-menu__group {
      margin: 0;
      padding: var(--dsc-spacing-quark) var(--dsc-spacing-tiny);
      color: var(--dsc-color-on-neutral-2);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-quark);
      line-height: var(--dsc-font-line-height-16);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
      font-weight: var(--dsc-font-weight-500);
    }
    .dsc-sidebar-menu__list {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  `,
})
export class DscSidebarMenu {
  readonly groupTitle = input<string>('Menu principal');
}

/**
 * [dsc] Sidebar Menu Item — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Sidebar Menu Item | level=parent, state=default, selected=false]
 * Use em um <a> dentro de <li>: <li><a dscSidebarMenuItem icon="home" routerLink="/">Página principal</a></li>
 */
@Component({
  selector: 'a[dscSidebarMenuItem], button[dscSidebarMenuItem]',
  imports: [DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dsc-sidebar-menu-item',
    '[class.dsc-sidebar-menu-item--selected]': 'selected()',
    '[attr.aria-current]': 'selected() ? "page" : null',
  },
  template: `
    @if (icon(); as name) {
      <dsc-icon class="dsc-sidebar-menu-item__icon" [name]="name" size="small" />
    }
    <span class="dsc-sidebar-menu-item__text"><ng-content /></span>
  `,
  styles: `
    :host {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-micro);
      width: 100%;
      min-height: 44px;
      padding: 0 var(--dsc-spacing-micro) 0 var(--dsc-spacing-tiny);
      border: none;
      border-radius: 0 var(--dsc-border-radius-pill) var(--dsc-border-radius-pill) 0;
      background: transparent;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-nano);
      line-height: var(--dsc-font-line-height-20);
      letter-spacing: var(--dsc-font-letter-spacing-broad);
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }
    :host(:hover) {
      background: var(--dsc-color-state-neutral-hover-1);
    }
    :host(.dsc-sidebar-menu-item--selected) {
      background: var(--dsc-color-highlight-bg);
      color: var(--dsc-color-on-highlight-bg);
      font-weight: var(--dsc-font-weight-600);
    }
    :host(:focus-visible) {
      outline: var(--dsc-border-width-thick) solid var(--dsc-color-state-focus-outlined-dark-tone);
      outline-offset: calc(-1 * var(--dsc-border-width-thick));
    }
    .dsc-sidebar-menu-item__icon {
      color: var(--dsc-color-highlight);
    }
    .dsc-sidebar-menu-item__text {
      flex: 1;
      padding: var(--dsc-spacing-micro) 0;
    }
  `,
})
export class DscSidebarMenuItem {
  readonly icon = input<DscIconName | undefined>(undefined);
  readonly selected = input<boolean>(false);
}
