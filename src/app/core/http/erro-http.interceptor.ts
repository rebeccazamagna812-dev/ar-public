import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Erro de API normalizado, entregue às camadas de cima. [PADRÃO DE MERCADO] */
export interface ErroApi {
  readonly status: number;
  /** [PENDENTE] Formato padrão de erro do backend (não definido). */
  readonly codigo?: string;
}

/**
 * Interceptor funcional que converte HttpErrorResponse em ErroApi.
 * Não registra corpo de requisição nem de resposta, para não vazar dado sensível [DOC: RNF01].
 * Tratamento de 401/403 com a mensagem de acesso negado: [PENDENTE] depende da definição de autenticação [DOC: HU22a].
 */
export const erroHttpInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((erro: unknown) => {
      if (erro instanceof HttpErrorResponse) {
        const erroApi: ErroApi = { status: erro.status };
        return throwError(() => erroApi);
      }
      return throwError(() => erro);
    }),
  );
