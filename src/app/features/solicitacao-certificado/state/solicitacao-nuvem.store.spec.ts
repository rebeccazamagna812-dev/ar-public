import { TestBed } from '@angular/core/testing';
import { SolicitacaoNuvemStore } from './solicitacao-nuvem.store';

describe('SolicitacaoNuvemStore', () => {
  let store: SolicitacaoNuvemStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SolicitacaoNuvemStore] });
    store = TestBed.inject(SolicitacaoNuvemStore);
  });

  it('começa vazio', () => {
    expect(store.dados()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });

  it('registra a solicitação e limpa tudo ao reiniciar', () => {
    store.registrarSolicitacao({ referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' });
    expect(store.solicitacao()?.referencia).toBe('2026-00012345');

    store.reiniciar();
    expect(store.dados()).toBeNull();
    expect(store.solicitacao()).toBeNull();
  });
});
