import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from '../../state/solicitacao-certificado.store';
import { Pergunta } from './pergunta';
import { IdPergunta } from './perguntas';

/** 03.02 (mídia existente) e 03.02A (estoque da unidade). */
describe('Pergunta', () => {
  function renderizar(pergunta: IdPergunta) {
    TestBed.configureTestingModule({
      imports: [Pergunta],
      providers: [
        provideRouter([]),
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(true) } },
        { provide: SolicitacaoCertificadoApi, useValue: {} },
      ],
    });
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const fixture = TestBed.createComponent(Pergunta);
    fixture.componentRef.setInput('pergunta', pergunta);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const continuar = () =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Continuar') as HTMLButtonElement;
    const responder = (valor: string) => {
      el.querySelector<HTMLInputElement>(`input[value="${valor}"]`)?.click();
      fixture.detectChanges();
      continuar().click();
    };
    return { el, continuar, responder, navegar, jornada: TestBed.inject(SolicitacaoCertificadoJornada) };
  }

  it('03.02: mostra as 3 opções e "Continuar" desabilitado até responder', () => {
    const { el, continuar } = renderizar('midia-existente');
    expect(el.querySelector('h1')?.textContent).toContain('Você já possui um cartão ou token?');
    expect(el.querySelectorAll('input[type=radio]').length).toBe(3);
    expect(continuar().disabled).toBeTrue();
  });

  it('03.02: "Sim, tenho um token" segue para 03.04 com a mídia registrada', () => {
    const { responder, navegar, jornada } = renderizar('midia-existente');
    responder('token');
    expect(navegar).toHaveBeenCalledWith('/solicitar/midia-fisica/dados');
    expect(jornada.midia()).toBe('token');
  });

  it('03.02: "Não tenho cartão nem token" segue para 03.02A', () => {
    const { responder, navegar } = renderizar('midia-existente');
    responder('nenhuma');
    expect(navegar).toHaveBeenCalledWith('/solicitar/midia-fisica/estoque');
  });

  it('03.02A: cada retorno da unidade leva à tela certa', () => {
    let r = renderizar('estoque-unidade');
    r.responder('indisponivel');
    expect(r.navegar).toHaveBeenCalledWith('/solicitar/midia-fisica/sem-midia');

    TestBed.resetTestingModule();
    r = renderizar('estoque-unidade');
    r.responder('nao-consultado');
    expect(r.navegar).toHaveBeenCalledWith('/solicitar/midia-fisica/aguardar-unidade');

    TestBed.resetTestingModule();
    r = renderizar('estoque-unidade');
    r.responder('disponivel');
    expect(r.navegar).toHaveBeenCalledWith('/solicitar/midia-fisica/dados');
  });
});
