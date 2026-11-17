import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DSC_ICONS, DscIconName } from './icons';

export type DscIconSize = 'nano' | 'small' | 'medium' | 'huge';

/**
 * [dsc] Icon — CÓPIA LOCAL. [FIGMA: Super DSC | Web → [dsc] Icon (size: nano 16 | small 20 | medium 24 | huge 48)]
 * Decorativo por padrão (aria-hidden). Informe `label` quando o ícone transmitir significado sozinho.
 */
@Component({
  selector: 'dsc-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"dsc-icon dsc-icon--" + size()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[innerHTML]': 'svg()',
  },
  template: '',
  styles: `
    :host {
      display: inline-flex;
      flex: none;
      color: inherit;
      line-height: 0;
    }
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
    }
    :host(.dsc-icon--nano) {
      width: var(--dsc-icon-size-nano);
      height: var(--dsc-icon-size-nano);
    }
    :host(.dsc-icon--small) {
      width: var(--dsc-icon-size-small);
      height: var(--dsc-icon-size-small);
    }
    :host(.dsc-icon--medium) {
      width: var(--dsc-icon-size-medium);
      height: var(--dsc-icon-size-medium);
    }
    :host(.dsc-icon--huge) {
      width: var(--dsc-icon-size-huge);
      height: var(--dsc-icon-size-huge);
    }
  `,
})
export class DscIcon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<DscIconName>();
  readonly size = input<DscIconSize>('medium');
  readonly label = input<string>('');

  protected readonly svg = computed<SafeHtml>(() => {
    const def = DSC_ICONS[this.name()];
    // Conteúdo estático, definido no código-fonte (icons.ts), sem dado de usuário.
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${def.viewBox}" focusable="false">${def.body}</svg>`,
    );
  });
}
