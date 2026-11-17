import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Tratamento global de erros não capturados. [PADRÃO DE MERCADO]
 * Registra só o tipo e a mensagem, sem payloads, para não expor dados sensíveis em log [DOC: RNF01].
 * [PENDENTE] Ferramenta de observabilidade corporativa (não definida na documentação).
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const nome = error instanceof Error ? error.name : typeof error;
    const mensagem = error instanceof Error ? error.message : 'Erro não identificado';
    console.error(`[SIARX] ${nome}: ${mensagem}`);
  }
}
