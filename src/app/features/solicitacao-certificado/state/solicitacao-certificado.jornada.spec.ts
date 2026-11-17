import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { PedidoCertificado, ResultadoEnvioSolicitacao } from '@domain/certificado/solicitacao-certificado.models';
import { SolicitacaoCertificadoJornada, situacaoPermiteSolicitar } from './solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from './solicitacao-certificado.store';

describe('SolicitacaoCertificadoJornada', () => {
  interface Opcoes {
    elegivel?: boolean;
    ativo?: Observable<boolean>;
    envio?: Observable<ResultadoEnvioSolicitacao>;
  }

  const registrada: ResultadoEnvioSolicitacao = {
    tipo: 'registrada',
    solicitacao: { referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' },
  };

  function criar(opcoes: Opcoes = {}) {
    const enviarSolicitacao = jasmine
      .createSpy('enviarSolicitacao')
      .and.returnValue(opcoes.envio ?? throwError(() => new Error('não configurado')));
    TestBed.configureTestingModule({
      providers: [
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: ElegibilidadeService, useValue: { podeSolicitarNuvem: signal(opcoes.elegivel ?? true) } },
        {
          provide: SolicitacaoCertificadoApi,
          useValue: { possuiCertificadoNuvemAtivo: () => opcoes.ativo ?? of(false), enviarSolicitacao },
        },
      ],
    });
    return { jornada: TestBed.inject(SolicitacaoCertificadoJornada), enviarSolicitacao };
  }

  describe('triagem (03.00)', () => {
    it('só "ainda tenho certificado válido e não revoguei" impede seguir', () => {
      expect(situacaoPermiteSolicitar('primeiro')).toBeTrue();
      expect(situacaoPermiteSolicitar('revogado')).toBeTrue();
      expect(situacaoPermiteSolicitar('vencido')).toBeTrue();
      expect(situacaoPermiteSolicitar('valido-nao-revogado')).toBeFalse();
      expect(situacaoPermiteSolicitar(null)).toBeFalse();
    });

    it('conclui a triagem com uma resposta válida e a desfaz ao reiniciar', () => {
      const { jornada } = criar();
      expect(jornada.triagemConcluida()).toBeFalse();
      expect(jornada.responderTriagem('primeiro')).toBeTrue();
      expect(jornada.triagemConcluida()).toBeTrue();

      jornada.reiniciar();
      expect(jornada.triagemConcluida()).toBeFalse();
    });

    it('não conclui a triagem com certificado válido não revogado', () => {
      const { jornada } = criar();
      expect(jornada.responderTriagem('valido-nao-revogado')).toBeFalse();
      expect(jornada.triagemConcluida()).toBeFalse();
    });
  });

  describe('caminhos de navegação', () => {
    it('escolha de modalidade (03.01): nuvem → 03.N1, mídia física → 03.02', () => {
      const { jornada } = criar();
      expect(jornada.escolherModalidade('nuvem')).toBe('/solicitar/nuvem/dados');
      expect(jornada.escolherModalidade('midia-fisica')).toBe('/solicitar/midia-fisica');
    });

    it('mídia existente (03.02): cartão/token → 03.04; nenhuma → 03.02A', () => {
      const { jornada } = criar();
      expect(jornada.informarMidiaExistente('cartao')).toBe('/solicitar/midia-fisica/dados');
      expect(jornada.midia()).toBe('cartao');
      expect(jornada.informarMidiaExistente('token')).toBe('/solicitar/midia-fisica/dados');
      expect(jornada.midia()).toBe('token');
      expect(jornada.informarMidiaExistente('nenhuma')).toBe('/solicitar/midia-fisica/estoque');
    });

    it('estoque da unidade (03.02A): disponível → 03.04; sem mídia → 03.02C; não consultou → 03.02B', () => {
      const { jornada } = criar();
      expect(jornada.informarEstoqueUnidade('indisponivel')).toBe('/solicitar/midia-fisica/sem-midia');
      expect(jornada.podeConferirMidiaFisica()).toBeFalse();
      expect(jornada.informarEstoqueUnidade('nao-consultado')).toBe('/solicitar/midia-fisica/aguardar-unidade');
      expect(jornada.informarEstoqueUnidade('disponivel')).toBe('/solicitar/midia-fisica/dados');
      expect(jornada.midia()).toBe('disponibilizada-pela-unidade');
      expect(jornada.podeConferirMidiaFisica()).toBeTrue();
    });

    it('voltar para nuvem descarta a mídia escolhida', () => {
      const { jornada } = criar();
      jornada.informarMidiaExistente('token');
      jornada.escolherModalidade('nuvem');
      expect(jornada.midia()).toBeNull();
      expect(jornada.podeConferirMidiaFisica()).toBeFalse();
    });
  });

  describe('verificarEntradaNuvem (03.N1)', () => {
    it('leva a 01.E1 quando não é elegível', async () => {
      const { jornada } = criar({ elegivel: false });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe('/solicitar/interrompida/nao-elegivel');
    });

    it('leva a 01.E2 quando já existe certificado em nuvem ativo', async () => {
      const { jornada } = criar({ ativo: of(true) });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe('/solicitar/interrompida/certificado-ativo');
    });

    it('volta à escolha de modalidade quando a consulta falha', async () => {
      const { jornada } = criar({ ativo: throwError(() => new Error('falha')) });
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBe('/solicitar');
    });

    it('libera (null) quando é elegível e não tem certificado ativo', async () => {
      const { jornada } = criar();
      expect(await firstValueFrom(jornada.verificarEntradaNuvem())).toBeNull();
    });
  });

  describe('confirmar', () => {
    it('envia o pedido em nuvem e leva a 03.N2', async () => {
      const { jornada, enviarSolicitacao } = criar({ envio: of(registrada) });
      jornada.escolherModalidade('nuvem');
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/nuvem/enviada');
      expect(enviarSolicitacao).toHaveBeenCalledWith({ modalidade: 'nuvem' } satisfies PedidoCertificado);
      expect(jornada.solicitacao()?.referencia).toBe('2026-00012345');
    });

    it('envia o pedido de mídia física com a mídia escolhida e leva a 03.05', async () => {
      const { jornada, enviarSolicitacao } = criar({ envio: of(registrada) });
      jornada.escolherModalidade('midia-fisica');
      jornada.informarEstoqueUnidade('disponivel');
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/midia-fisica/enviada');
      expect(enviarSolicitacao).toHaveBeenCalledWith({
        modalidade: 'midia-fisica',
        midia: 'disponibilizada-pela-unidade',
      } satisfies PedidoCertificado);
    });

    it('não envia mídia física sem mídia definida; volta ao início', async () => {
      const { jornada, enviarSolicitacao } = criar({ envio: of(registrada) });
      jornada.escolherModalidade('midia-fisica');
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar');
      expect(enviarSolicitacao).not.toHaveBeenCalled();
    });

    it('leva a 01.E3 na divergência cadastral, sem registrar', async () => {
      const { jornada } = criar({ envio: of({ tipo: 'interrompida', motivo: 'divergencia-cadastral' }) });
      jornada.escolherModalidade('nuvem');
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/interrompida/divergencia-cadastral');
      expect(jornada.solicitacao()).toBeNull();
    });

    it('leva a 01.E4 em falha técnica, sem registrar', async () => {
      const { jornada } = criar({ envio: throwError(() => new Error('timeout')) });
      jornada.informarMidiaExistente('cartao');
      expect(await firstValueFrom(jornada.confirmar())).toBe('/solicitar/interrompida/serpro-indisponivel');
      expect(jornada.solicitacao()).toBeNull();
    });
  });
});
