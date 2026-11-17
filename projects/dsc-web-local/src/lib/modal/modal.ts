import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  input,
  output,
  viewChild,
} from '@angular/core';

let proximoId = 0;

/**
 * [dsc] Modal — CÓPIA LOCAL.
 * [FIGMA: Super DSC | Web → [dsc] Modal | device=desktop, show overlay=true]
 * Usa o <dialog> nativo com showModal(): o navegador cuida da camada sobreposta, do foco preso dentro do modal
 * e do Esc. Esc (ou "cancelar" do navegador) emite `dismiss`; quem usa decide o que fazer.
 * Conteúdo projetado = corpo; slot `[dscModalFooter]` = botões do rodapé (alinhados à direita).
 */
@Component({
  selector: 'dsc-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'dsc-modal' },
  template: `
    <dialog
      #dialog
      class="dsc-modal__dialog"
      [attr.aria-labelledby]="tituloId"
      (cancel)="$event.preventDefault(); dismiss.emit()"
    >
      <h2 class="dsc-modal__title" [id]="tituloId">{{ title() }}</h2>
      <div class="dsc-modal__body"><ng-content /></div>
      <div class="dsc-modal__footer"><ng-content select="[dscModalFooter]" /></div>
    </dialog>
  `,
  styles: `
    .dsc-modal__dialog {
      box-sizing: border-box;
      display: none;
      flex-direction: column;
      width: min(680px, calc(100vw - 2 * var(--dsc-spacing-smaller)));
      max-height: calc(100vh - 2 * var(--dsc-spacing-smaller));
      padding: 0;
      overflow: auto;
      border: var(--dsc-border-width-thin) solid var(--dsc-color-outlined-1);
      border-radius: var(--dsc-border-radius-large);
      background: var(--dsc-color-neutral-bg-1);
      color: var(--dsc-color-on-neutral-1);
    }
    .dsc-modal__dialog[open] {
      display: flex;
    }
    .dsc-modal__dialog::backdrop {
      background: var(--dsc-color-fixed-neutral-bg-inverse);
      opacity: var(--dsc-opacity-56);
    }
    .dsc-modal__title {
      margin: 0;
      padding: var(--dsc-spacing-smaller) var(--dsc-spacing-smaller) 0;
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-smaller);
      line-height: var(--dsc-font-line-height-28);
      font-weight: var(--dsc-font-weight-400);
    }
    .dsc-modal__body {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-tiny);
      padding: var(--dsc-spacing-smaller) var(--dsc-spacing-smaller) 0;
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
    .dsc-modal__footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: var(--dsc-spacing-tiny);
      padding: var(--dsc-spacing-smaller);
    }
  `,
})
export class DscModal {
  /** Abre (`true`) ou fecha (`false`) o modal. */
  readonly open = input<boolean>(false);
  readonly title = input.required<string>();
  /** Esc pressionado ou cancelamento pelo navegador. */
  readonly dismiss = output<void>();

  protected readonly tituloId = `dsc-modal-titulo-${++proximoId}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
      } else if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }
}
