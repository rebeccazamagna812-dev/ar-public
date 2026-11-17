import { EnvironmentProviders, Provider, inject, provideAppInitializer } from '@angular/core';
import { AutenticacaoService } from '@core/auth/autenticacao.service';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { AutenticacaoMockService } from '@mocks/autenticacao.mock';
import { SolicitacaoCertificadoMockApi } from '@mocks/solicitacao-certificado-api.mock';

/**
 * Implementações dos contratos de backend e de autenticação [ADR-06].
 * É o ÚNICO lugar a mudar quando a API real e o SSO existirem: registre aqui as implementações HTTP.
 *
 * [PENDENTE] Implementações reais (itens 2–4 da Fase 1). Com `usarApiSimulada = false` e sem elas,
 * a aplicação falha no bootstrap por falta de provider para os contratos.
 */
export function provideImplementacoes(usarApiSimulada: boolean): Provider[] {
  return usarApiSimulada
    ? [
        { provide: SolicitacaoCertificadoApi, useClass: SolicitacaoCertificadoMockApi },
        { provide: AutenticacaoService, useClass: AutenticacaoMockService },
      ]
    : [];
}

/**
 * Inicia a sessão e avalia a elegibilidade antes da primeira tela [ADR-07].
 * [DOC: HU03a RN04/RF04 — avaliada logo após o login, antes de qualquer tela de solicitação]
 */
export function provideSessaoInicial(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const autenticacao = inject(AutenticacaoService);
    const elegibilidade = inject(ElegibilidadeService);
    return autenticacao.iniciarSessao().then(() => elegibilidade.carregar());
  });
}
