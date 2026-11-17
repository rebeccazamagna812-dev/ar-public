import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { SolicitacaoCertificadoApi } from '@core/api/solicitacao-certificado.api';
import { ElegibilidadeService } from '@core/elegibilidade/elegibilidade.service';
import { jornadaNuvemGuard } from './jornada-nuvem.guard';

/** Teste de exemplo da camada de guard. */
describe('jornadaNuvemGuard', () => {
  function configurar(opcoes: { elegivel: boolean; ativo: boolean }) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(opcoes.elegivel) } },
        {
          provide: SolicitacaoCertificadoApi,
          useValue: { possuiCertificadoNuvemAtivo: () => of(opcoes.ativo) },
        },
      ],
    });
  }

  async function executar(): Promise<boolean | UrlTree> {
    const resultado = TestBed.runInInjectionContext(() =>
      jornadaNuvemGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
    return isObservable(resultado)
      ? firstValueFrom(resultado as Observable<boolean | UrlTree>)
      : (resultado as boolean | UrlTree);
  }

  it('redireciona para "não elegível" quando o empregado não pode solicitar nuvem', async () => {
    configurar({ elegivel: false, ativo: false });
    const resultado = await executar();
    expect(resultado instanceof UrlTree && resultado.toString()).toBe('/solicitar/nuvem/indisponivel/nao-elegivel');
  });

  it('redireciona para "certificado ativo" quando já existe certificado em nuvem ativo', async () => {
    configurar({ elegivel: true, ativo: true });
    const resultado = await executar();
    expect(resultado instanceof UrlTree && resultado.toString()).toBe(
      '/solicitar/nuvem/indisponivel/certificado-ativo',
    );
  });

  it('libera a jornada quando o empregado é elegível e não tem certificado ativo', async () => {
    configurar({ elegivel: true, ativo: false });
    expect(await executar()).toBeTrue();
  });
});
