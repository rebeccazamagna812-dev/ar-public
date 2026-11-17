import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { ModalidadeCertificado } from '@domain/certificado/solicitacao-certificado.models';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from '../../state/solicitacao-certificado.store';
import { SolicitacaoEnviada } from './solicitacao-enviada';

/** 03.N2 (nuvem) e 03.05 (mídia física). */
describe('SolicitacaoEnviada', () => {
  function renderizar(modalidade: ModalidadeCertificado) {
    TestBed.configureTestingModule({
      imports: [SolicitacaoEnviada],
      providers: [
        provideRouter([]),
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(true) } },
        { provide: SolicitacaoCertificadoApi, useValue: {} },
      ],
    });
    const jornada = TestBed.inject(SolicitacaoCertificadoJornada);
    jornada.responderTriagem('primeiro');
    TestBed.inject(SolicitacaoCertificadoStore).registrarSolicitacao({
      referencia: '2026-00012345',
      emailValidacao: 'usuario@caixa.gov.br',
    });
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const fixture = TestBed.createComponent(SolicitacaoEnviada);
    fixture.componentRef.setInput('modalidade', modalidade);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const rotulos = Array.from(el.querySelectorAll('dsc-list-item .dsc-list-item__label')).map((r) =>
      r.textContent?.trim(),
    );
    return { el, rotulos, jornada, navegar };
  }

  it('nuvem: referência, e-mail e orientações, sem a linha "Certificado e mídia"', () => {
    const { el, rotulos } = renderizar('nuvem');
    expect(el.textContent).toContain('Seu certificado em nuvem foi solicitado.');
    expect(el.textContent).toContain('2026-00012345');
    expect(el.textContent).toContain('usuario@caixa.gov.br');
    expect(rotulos).toEqual([
      'Referência',
      'Verifique seu e-mail',
      'Não encontrou a mensagem?',
      'Acompanhe a solicitação',
    ]);
  });

  it('mídia física: inclui a linha "Certificado e mídia"', () => {
    const { el, rotulos } = renderizar('midia-fisica');
    expect(el.textContent).toContain('Seu certificado em mídia física foi solicitado.');
    expect(rotulos[1]).toBe('Certificado e mídia');
  });

  it('"Voltar ao início" recomeça a solicitação (a triagem volta a aparecer)', () => {
    const { el, jornada, navegar } = renderizar('nuvem');
    Array.from(el.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Voltar ao início')
      ?.click();
    expect(jornada.triagemConcluida()).toBeFalse();
    expect(navegar).toHaveBeenCalledWith('/solicitar');
  });

  it('"Meus pedidos" leva a Acompanhar solicitações', () => {
    const { el } = renderizar('nuvem');
    const link = Array.from(el.querySelectorAll('a')).find((a) => a.textContent?.trim() === 'Meus pedidos');
    expect(link?.getAttribute('href')).toBe('/acompanhar-solicitacoes');
  });
});
