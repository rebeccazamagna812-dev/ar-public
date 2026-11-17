import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { ROTAS_SOLICITACAO } from '../solicitacao-certificado.paths';
import { SolicitacaoNuvemJornada } from '../state/solicitacao-nuvem.jornada';

/**
 * Guarda de entrada na jornada de certificado em nuvem (etapa 2).
 * A regra fica em SolicitacaoNuvemJornada.verificarEntradaNuvem(); aqui só se traduz o resultado em navegação.
 */
export const jornadaNuvemGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(SolicitacaoNuvemJornada)
    .verificarEntradaNuvem()
    .pipe(map((destino) => (destino ? router.parseUrl(destino) : true)));
};

/** Só deixa abrir a tela de sucesso (01.04) se houver uma solicitação registrada nesta jornada. */
export const solicitacaoRegistradaGuard: CanActivateFn = () =>
  inject(SolicitacaoNuvemJornada).solicitacao() ? true : inject(Router).parseUrl(ROTAS_SOLICITACAO.inicio);
