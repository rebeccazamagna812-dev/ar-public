import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { SolicitacaoCertificadoJornada } from '../state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from '../state/solicitacao-certificado.store';
import {
  jornadaNuvemGuard,
  midiaFisicaDefinidaGuard,
  solicitacaoRegistradaGuard,
  triagemConcluidaGuard,
} from './jornada.guards';

/** Guards + fachada: confere a tradução das decisões da jornada em navegação. */
describe('guards da jornada', () => {
  function configurar(opcoes: { elegivel?: boolean; ativo?: boolean } = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(opcoes.elegivel ?? true) } },
        {
          provide: SolicitacaoCertificadoApi,
          useValue: { possuiCertificadoNuvemAtivo: () => of(opcoes.ativo ?? false) },
        },
      ],
    });
    return TestBed.inject(SolicitacaoCertificadoJornada);
  }

  async function executar(guard: CanActivateFn): Promise<string | boolean> {
    const resultado = TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    const valor = isObservable(resultado)
      ? await firstValueFrom(resultado as Observable<boolean | UrlTree>)
      : (resultado as boolean | UrlTree);
    return valor instanceof UrlTree ? valor.toString() : valor;
  }

  it('jornadaNuvemGuard: 01.E1 sem elegibilidade, 01.E2 com certificado ativo, libera nos demais casos', async () => {
    configurar({ elegivel: false });
    expect(await executar(jornadaNuvemGuard)).toBe('/solicitar/interrompida/nao-elegivel');

    TestBed.resetTestingModule();
    configurar({ ativo: true });
    expect(await executar(jornadaNuvemGuard)).toBe('/solicitar/interrompida/certificado-ativo');

    TestBed.resetTestingModule();
    configurar();
    expect(await executar(jornadaNuvemGuard)).toBeTrue();
  });

  it('triagemConcluidaGuard: volta à triagem até ela ser respondida', async () => {
    const jornada = configurar();
    expect(await executar(triagemConcluidaGuard)).toBe('/solicitar');
    jornada.responderTriagem('vencido');
    expect(await executar(triagemConcluidaGuard)).toBeTrue();
  });

  it('midiaFisicaDefinidaGuard: exige a mídia definida em 03.02 / 03.02A', async () => {
    const jornada = configurar();
    expect(await executar(midiaFisicaDefinidaGuard)).toBe('/solicitar/midia-fisica');
    jornada.informarMidiaExistente('token');
    expect(await executar(midiaFisicaDefinidaGuard)).toBeTrue();
  });

  it('solicitacaoRegistradaGuard: só abre "enviada" com solicitação registrada', async () => {
    configurar();
    expect(await executar(solicitacaoRegistradaGuard)).toBe('/solicitar');
    TestBed.inject(SolicitacaoCertificadoStore).registrarSolicitacao({ referencia: 'X', emailValidacao: 'y' });
    expect(await executar(solicitacaoRegistradaGuard)).toBeTrue();
  });
});
