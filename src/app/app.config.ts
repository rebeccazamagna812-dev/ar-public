import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { TitleStrategy, provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { environment } from '@env/environment';

import { GlobalErrorHandler } from '@core/erros/global-error-handler';
import { erroHttpInterceptor } from '@core/http/erro-http.interceptor';
import { SiarxTitleStrategy } from '@core/navegacao/siarx-title-strategy';
import { provideImplementacoes, provideSessaoInicial } from '@core/providers/siarx.providers';
import { routes } from './app.routes';

registerLocaleData(localePt, 'pt-BR');

/**
 * Configuração da aplicação.
 * - Locale pt-BR registrado (datas, moeda, números) [diretriz do projeto].
 * - Implementações de API e autenticação: core/providers/siarx.providers.ts (hoje SIMULADAS) [ADR-06].
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([erroHttpInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: TitleStrategy, useClass: SiarxTitleStrategy },
    provideImplementacoes(environment.usarApiSimulada),
    provideSessaoInicial(),
  ],
};
