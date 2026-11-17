import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DscModal } from './modal';

@Component({
  imports: [DscModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dsc-modal title="Antes de solicitar" [open]="aberto()" (dismiss)="dispensado = dispensado + 1">
      <p>Corpo</p>
      <button dscModalFooter type="button">Continuar</button>
    </dsc-modal>
  `,
})
class Hospedeiro {
  readonly aberto = signal(false);
  dispensado = 0;
}

describe('DscModal', () => {
  function renderizar() {
    const fixture = TestBed.createComponent(Hospedeiro);
    fixture.detectChanges();
    const dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog') as HTMLDialogElement;
    return { fixture, dialog };
  }

  it('abre e fecha conforme o input open', () => {
    const { fixture, dialog } = renderizar();
    expect(dialog.open).toBeFalse();

    fixture.componentInstance.aberto.set(true);
    fixture.detectChanges();
    expect(dialog.open).toBeTrue();

    fixture.componentInstance.aberto.set(false);
    fixture.detectChanges();
    expect(dialog.open).toBeFalse();
  });

  it('é rotulado pelo título e projeta corpo e rodapé', () => {
    const { dialog } = renderizar();
    const titulo = dialog.querySelector('h2');
    expect(titulo?.textContent?.trim()).toBe('Antes de solicitar');
    expect(dialog.getAttribute('aria-labelledby')).toBe(titulo?.id ?? 'sem-id');
    expect(dialog.querySelector('.dsc-modal__footer button')?.textContent).toBe('Continuar');
  });

  it('emite dismiss no Esc, sem fechar por conta própria', () => {
    const { fixture, dialog } = renderizar();
    fixture.componentInstance.aberto.set(true);
    fixture.detectChanges();

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(fixture.componentInstance.dispensado).toBe(1);
    expect(dialog.open).toBeTrue();
  });
});
