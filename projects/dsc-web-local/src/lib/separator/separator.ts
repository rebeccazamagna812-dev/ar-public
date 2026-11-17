import { ChangeDetectionStrategy, Component } from '@angular/core';

/** [dsc] Separator — CÓPIA LOCAL. [FIGMA: Super DSC | Web → [dsc] Separator | direction=horizontal] */
@Component({
  selector: 'dsc-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'separator', class: 'dsc-separator' },
  template: '',
  styles: `
    :host {
      display: block;
      height: 0;
      border-top: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
    }
  `,
})
export class DscSeparator {}
