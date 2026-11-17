import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { environment } from '@env/environment';

import { SolicitacaoCertificadoApi } from '@core/api/solicitacao-certificado.api';
import { SolicitacaoCertificadoMockApi } from '@core/api/mock/solicitacao-certificado.mock-api';
import { AutenticacaoService } from '@core/auth/autenticacao.service';
import { AutenticacaoMockService } from '@core/auth/autenticacao.mock.service';
import { ElegibilidadeService } from '@core/elegibilidade/elegibilidade.service';
import { GlobalErrorHandler } from '@core/erros/global-error-handler';
import { erroHttpInterceptor } from '@core/http/erro-http.interceptor';
import { SiarxTitleStrategy } from '@core/navegacao/siarx-title-strategy';
import { routes } from './app.routes';

registerLocaleData(localePt, 'pt-BR');

/**
 * Configuração da aplicação.
 * - Locale pt-BR registrado (datas, moeda, números) [diretriz do projeto].
 * - API e autenticação SIMULADAS enquanto não houver contrato [PENDENTE: itens 2–4 da Fase 1].
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withInterceptors([erroHttpInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: TitleStrategy, useClass: SiarxTitleStrategy },

    // [PENDENTE] Trocar pelas implementações reais quando autenticação e API forem definidas.
    environment.usarApiSimulada
      ? { provide: SolicitacaoCertificadoApi, useClass: SolicitacaoCertificadoMockApi }
      : [],
    environment.usarApiSimulada ? { provide: AutenticacaoService, useClass: AutenticacaoMockService } : [],

    // A elegibilidade é avaliada logo após o login, antes de qualquer tela de solicitação [DOC: HU03a RN04/RF04].
    provideAppInitializer(() => {
      const autenticacao = inject(AutenticacaoService);
      const elegibilidade = inject(ElegibilidadeService);
      return autenticacao.iniciarSessao().then(() => elegibilidade.carregar());
    }),
  ],
};
