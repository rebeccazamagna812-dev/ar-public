import { TestBed } from '@angular/core/testing';
import { SolicitacaoCertificadoStore } from './solicitacao-certificado.store';

describe('SolicitacaoCertificadoStore', () => {
  let store: SolicitacaoCertificadoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SolicitacaoCertificadoStore] });
    store = TestBed.inject(SolicitacaoCertificadoStore);
  });

  it('começa vazio', () => {
    expect(store.situacaoAnterior()).toBeNull();
    expect(store.modalidade()).toBeNull();
    expect(store.midia()).toBeNull();
    expect(store.dados()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });

  it('descarta a mídia ao trocar de modalidade', () => {
    store.definirModalidade('midia-fisica');
    store.definirMidia('token');
    store.definirModalidade('nuvem');
    expect(store.midia()).toBeNull();
  });

  it('limpa tudo ao reiniciar', () => {
    store.definirSituacaoAnterior('vencido');
    store.definirModalidade('midia-fisica');
    store.definirMidia('cartao');
    store.registrarSolicitacao({ referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' });

    store.reiniciar();
    expect(store.situacaoAnterior()).toBeNull();
    expect(store.modalidade()).toBeNull();
    expect(store.midia()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });
});
