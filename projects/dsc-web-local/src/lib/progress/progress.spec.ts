import { TestBed } from '@angular/core/testing';
import { DscProgress } from './progress';

/** Teste de exemplo da camada de componente (cópia local do DSC). */
describe('DscProgress', () => {
  it('exibe o rótulo, o percentual e os atributos de acessibilidade', () => {
    const fixture = TestBed.createComponent(DscProgress);
    fixture.componentRef.setInput('label', 'Etapa 2 de 3');
    fixture.componentRef.setInput('value', 67);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuenow')).toBe('67');
    expect(host.textContent).toContain('Etapa 2 de 3');
    expect(host.textContent).toContain('67%');
  });

  it('limita o valor entre 0 e 100', () => {
    const fixture = TestBed.createComponent(DscProgress);
    fixture.componentRef.setInput('label', 'Concluído');
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('aria-valuenow')).toBe('100');
  });
});
