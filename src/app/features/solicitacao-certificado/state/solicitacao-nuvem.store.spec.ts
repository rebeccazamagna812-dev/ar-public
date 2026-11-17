import { TestBed } from '@angular/core/testing';
import { SolicitacaoNuvemStore } from './solicitacao-nuvem.store';

/** Teste de exemplo da camada de serviço/estado. */
describe('SolicitacaoNuvemStore', () => {
  let store: SolicitacaoNuvemStore;

  beforeEach(() => {
    store = TestBed.inject(SolicitacaoNuvemStore);
  });

  it('começa vazio', () => {
    expect(store.modalidade()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });

  it('registra a solicitação e limpa tudo ao reiniciar', () => {
    store.selecionarModalidade('nuvem');
    store.registrarSolicitacao({ referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' });
    expect(store.solicitacao()?.referencia).toBe('2026-00012345');

    store.reiniciar();
    expect(store.modalidade()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });
});
