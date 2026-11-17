import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Orientacao } from './orientacao';
import { IdOrientacao } from './orientacoes';

/** 03.02B (aguardar consulta) e 03.02C (unidade sem mídia). */
describe('Orientacao', () => {
  function links(orientacao: IdOrientacao) {
    TestBed.configureTestingModule({ imports: [Orientacao], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Orientacao);
    fixture.componentRef.setInput('orientacao', orientacao);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return Object.fromEntries(
      Array.from(el.querySelectorAll('a')).map((a) => [a.textContent?.trim(), a.getAttribute('href')]),
    );
  }

  it('03.02B: "Já consultei minha unidade" → 03.02A; "Rever modalidade" → 03.01', () => {
    const l = links('aguardar-unidade');
    expect(l['Já consultei minha unidade']).toBe('/solicitar/midia-fisica/estoque');
    expect(l['Rever modalidade']).toBe('/solicitar');
    expect(l['Voltar']).toBe('/solicitar/midia-fisica/estoque');
  });

  it('03.02C: "Solicitar primeira mídia" → Nova mídia física; "Rever modalidade" → 03.01', () => {
    const l = links('sem-midia');
    expect(l['Solicitar primeira mídia']).toBe('/nova-midia-fisica');
    expect(l['Rever modalidade']).toBe('/solicitar');
  });
});
