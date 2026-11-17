import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { ROTAS_SOLICITACAO } from '../solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from '../state/solicitacao-certificado.jornada';

/*
 * Guards da jornada. As regras ficam na fachada SolicitacaoCertificadoJornada; aqui só se traduz a decisão
 * em navegação. Guards não alteram estado (ADR-08).
 */

/**
 * Prepara uma jornada nova ao ENTRAR na funcionalidade (vindo da Home, do menu ou de outra tela): a triagem
 * 03.00 volta a aparecer. Fica na rota pai, então não roda ao navegar entre as telas da própria jornada.
 * É a única exceção à regra "rotas não alteram estado" (ADR-14).
 */
export const iniciarJornadaResolver: ResolveFn<true> = () => {
  inject(SolicitacaoCertificadoJornada).reiniciar();
  return true;
};

/** As telas depois da escolha de modalidade exigem a triagem 03.00 respondida. */
export const triagemConcluidaGuard: CanActivateFn = () =>
  inject(SolicitacaoCertificadoJornada).triagemConcluida() || inject(Router).parseUrl(ROTAS_SOLICITACAO.inicio);

/** Entrada na conferência em nuvem (03.N1): elegibilidade e certificado ativo (01.E1 / 01.E2). */
export const jornadaNuvemGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(SolicitacaoCertificadoJornada)
    .verificarEntradaNuvem()
    .pipe(map((destino) => (destino ? router.parseUrl(destino) : true)));
};

/** Conferência de mídia física (03.04) só com a mídia definida em 03.02 ou 03.02A. */
export const midiaFisicaDefinidaGuard: CanActivateFn = () =>
  inject(SolicitacaoCertificadoJornada).podeConferirMidiaFisica() ||
  inject(Router).parseUrl(ROTAS_SOLICITACAO.midiaFisica);

/** Telas de "Solicitação enviada" (03.N2 / 03.05) só com uma solicitação registrada nesta jornada. */
export const solicitacaoRegistradaGuard: CanActivateFn = () =>
  inject(SolicitacaoCertificadoJornada).solicitacao() ? true : inject(Router).parseUrl(ROTAS_SOLICITACAO.inicio);
