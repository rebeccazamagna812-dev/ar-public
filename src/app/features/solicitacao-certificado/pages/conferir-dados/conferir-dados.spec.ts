import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { ModalidadeCertificado } from '@domain/certificado/solicitacao-certificado.models';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from '../../state/solicitacao-certificado.store';
import { ConferirDados } from './conferir-dados';

/** 03.N1 (nuvem) e 03.04 (mídia física). */
describe('ConferirDados', () => {
  function renderizar(modalidade: ModalidadeCertificado, preparar?: (j: SolicitacaoCertificadoJornada) => void) {
    TestBed.configureTestingModule({
      imports: [ConferirDados],
      providers: [
        provideRouter([]),
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(true) } },
        {
          provide: SolicitacaoCertificadoApi,
          useValue: {
            obterDadosCadastrais: () =>
              of({
                nomeCompleto: 'João da Silva',
                cpf: '12345678910',
                matricula: 'C000000',
                emailCorporativo: 'nome.sobrenome@caixa.gov.br',
                dataNascimento: '1990-01-31',
              }),
          },
        },
      ],
    });
    preparar?.(TestBed.inject(SolicitacaoCertificadoJornada));
    const fixture = TestBed.createComponent(ConferirDados);
    fixture.componentRef.setInput('modalidade', modalidade);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const voltar = Array.from(el.querySelectorAll('a')).find((a) => a.textContent?.trim() === 'Voltar');
    return { el, voltar };
  }

  it('mostra os 5 campos do protótipo, com o CPF mascarado [DOC: RNF01]', () => {
    const { el } = renderizar('nuvem');
    const valores = Array.from(el.querySelectorAll('dsc-text-field-form input')).map(
      (i) => (i as HTMLInputElement).value,
    );
    expect(valores).toEqual([
      'João da Silva',
      '***.***.***-**',
      'C000000',
      '31/01/1990',
      'nome.sobrenome@caixa.gov.br',
    ]);
    expect(el.textContent).not.toContain('Documento de Identidade');
  });

  it('nuvem: alerta da modalidade e "Voltar" para a escolha com a nuvem selecionada', () => {
    const { el, voltar } = renderizar('nuvem');
    expect(el.textContent).toContain('Você está solicitando um certificado em nuvem');
    expect(voltar?.getAttribute('href')).toBe('/solicitar?modalidade=nuvem');
  });

  it('mídia física: alerta "não inclui nova mídia" e "Voltar" para a pergunta respondida', () => {
    let resultado = renderizar('midia-fisica', (j) => j.informarMidiaExistente('cartao'));
    expect(resultado.el.textContent).toContain('Este pedido não inclui uma nova mídia');
    expect(resultado.voltar?.getAttribute('href')).toBe('/solicitar/midia-fisica');

    TestBed.resetTestingModule();
    resultado = renderizar('midia-fisica', (j) => j.informarEstoqueUnidade('disponivel'));
    expect(resultado.voltar?.getAttribute('href')).toBe('/solicitar/midia-fisica/estoque');
  });
});
