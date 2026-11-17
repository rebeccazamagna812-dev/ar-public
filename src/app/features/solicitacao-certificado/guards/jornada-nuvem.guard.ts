import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SolicitacaoCertificadoApi } from '@core/api/solicitacao-certificado.api';
import { ElegibilidadeService } from '@core/elegibilidade/elegibilidade.service';
import { SolicitacaoNuvemStore } from '../state/solicitacao-nuvem.store';

export const ROTA_INTERRUPCAO = '/solicitar/nuvem/indisponivel';

/**
 * Guarda de entrada na jornada de certificado em nuvem (a partir da etapa 2).
 * 1. Sem elegibilidade à nuvem → 01.E1 [DOC: HU02 CA02, HU03c] [FIGMA: 01.E1]
 *    (na etapa 1 a opção nem aparece; esta tela só é vista se a rota for acessada direto pela URL)
 * 2. Já existe certificado em nuvem ativo → 01.E2, sem envio ao SERPRO e sem registro [DOC: HU04] [FIGMA: 01.E2]
 */
export const jornadaNuvemGuard: CanActivateFn = () => {
  const router = inject(Router);
  const elegibilidade = inject(ElegibilidadeService);
  const api = inject(SolicitacaoCertificadoApi);
  const store = inject(SolicitacaoNuvemStore);

  if (!elegibilidade.podeSolicitarNuvem()) {
    return router.createUrlTree([ROTA_INTERRUPCAO, 'nao-elegivel']);
  }

  return api.possuiCertificadoNuvemAtivo().pipe(
    map((ativo) => {
      if (ativo) {
        return router.createUrlTree([ROTA_INTERRUPCAO, 'certificado-ativo']);
      }
      store.selecionarModalidade('nuvem');
      return true;
    }),
    // [PENDENTE] Comportamento em falha da consulta. Por ora, volta à escolha de modalidade.
    catchError(() => of(router.createUrlTree(['/solicitar']))),
  );
};

/** Só deixa abrir a tela de sucesso (01.04) se houver uma solicitação registrada nesta jornada. */
export const solicitacaoRegistradaGuard: CanActivateFn = () => {
  const store = inject(SolicitacaoNuvemStore);
  return store.solicitacao() ? true : inject(Router).createUrlTree(['/solicitar']);
};
