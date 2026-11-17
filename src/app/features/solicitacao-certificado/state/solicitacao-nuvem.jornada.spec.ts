import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { ResultadoEnvioSolicitacao } from '@domain/certificado/solicitacao-certificado.models';
import { SolicitacaoNuvemJornada } from './solicitacao-nuvem.jornada';
import { SolicitacaoNuvemStore } from './solicitacao-nuvem.store';

describe('SolicitacaoNuvemJornada', () => {
  interface Opcoes {
    elegivel?: boolean;
    ativo?: Observable<boolean>;
    envio?: Observable<ResultadoEnvioSolicitacao>;
  }

  function criar(opcoes: Opcoes = {}) {
    TestBed.configureTestingModule({
      providers: [
        SolicitacaoNuvemStore,
        SolicitacaoNuvemJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(opcoes.elegivel ?? true) } },
        {
          provide: SolicitacaoCertificadoApi,
          useValue: {
            possuiCertificadoNuvemAtivo: () => opcoes.ativo ?? of(false),
            enviarSolicitacaoNuvem: () => opcoes.envio ?? throwError(() => new Error('não configurado')),
          },
        },
      ],
    });
    return TestBed.inject(SolicitacaoNuvemJornada);
  }

  describe('verificarEntradaNuvem', () => {
    it('leva a 01.E1 quando não é elegível', async () => {
      const jornada = criar({ elegivel: false });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe('/solicitar/nuvem/indisponivel/nao-elegivel');
    });

    it('leva a 01.E2 quando já existe certificado ativo', async () => {
      const jornada = criar({ ativo: of(true) });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe(
        '/solicitar/nuvem/indisponivel/certificado-ativo',
      );
    });

    it('volta à escolha de modalidade quando a consulta falha', async () => {
      const jornada = criar({ ativo: throwError(() => new Error('falha')) });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe('/solicitar');
    });

    it('libera (null) quando é elegível e não tem certificado ativo', async () => {
      const jornada = criar();
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBeNull();
    });
  });

  describe('confirmar', () => {
    it('registra a solicitação e leva a 01.04 no sucesso', async () => {
      const solicitacao = { referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' };
      const jornada = criar({ envio: of({ tipo: 'registrada', solicitacao }) });
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/nuvem/enviada');
      expect(jornada.solicitacao()).toEqual(solicitacao);
    });

    it('leva a 01.E3 na divergência cadastral, sem registrar', async () => {
      const jornada = criar({ envio: of({ tipo: 'interrompida', motivo: 'divergencia-cadastral' }) });
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/nuvem/indisponivel/divergencia-cadastral');
      expect(jornada.solicitacao()).toBeNull();
    });

    it('leva a 01.E4 em falha técnica, sem registrar', async () => {
      const jornada = criar({ envio: throwError(() => new Error('timeout')) });
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/nuvem/indisponivel/serpro-indisponivel');
      expect(jornada.solicitacao()).toBeNull();
    });
  });
});
