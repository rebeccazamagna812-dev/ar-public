import { inject } from '@angular/core';
import { ResolveFn, Router, Routes } from '@angular/router';
import { INTERRUPCOES, isMotivoInterrupcao } from './pages/interrupcao/interrupcoes';
import {
  iniciarJornadaResolver,
  jornadaNuvemGuard,
  solicitacaoRegistradaGuard,
  triagemConcluidaGuard,
} from './guards/jornada.guards';
import { ROTAS_SOLICITACAO, SEGMENTOS_SOLICITACAO } from './solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from './state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from './state/solicitacao-certificado.store';

const tituloInterrupcao: ResolveFn<string> = (route) => {
  const motivo = route.paramMap.get('motivo');
  return isMotivoInterrupcao(motivo) ? INTERRUPCOES[motivo].titulo : 'Solicitar certificado digital';
};

/**
 * Rotas da funcionalidade "Solicitar certificado".
 * Jornada em nuvem [FIGMA: Fluxo V1 (em andamento) 2 → seção 01 — Solicitação de Certificado em Nuvem]:
 *   /solicitar                               01.01 / 01.01A  Escolher modalidade (etapa 1 de 3)
 *   /solicitar/nuvem/dados                   01.02           Confira seus dados (etapa 2 de 3) + envio
 *   /solicitar/nuvem/enviada                 01.04           Solicitação enviada
 *   /solicitar/nuvem/interrompida/:motivo    01.E1–01.E4     Interrupções da jornada (não elegível, ativo, divergência, SERPRO)
 * A tela 01.03 (Revisar e confirmar) está esmaecida (12%) no Figma e o protótipo vai de 01.02 direto para 01.04.
 * Por isso ela não foi implementada [FIGMA: 01.03, opacidade 0.12; interação "Confirmar solicitação" → 01.04].
 *
 * O estado e a fachada da jornada são fornecidos na rota pai: só as telas desta funcionalidade os enxergam.
 */
const PAGINAS: Routes = [
  {
    path: '',
    title: 'Solicitar certificado digital',
    loadComponent: () => import('./pages/escolher-modalidade/escolher-modalidade').then((m) => m.EscolherModalidade),
  },
  {
    path: SEGMENTOS_SOLICITACAO.modalidades,
    title: 'Entenda as modalidades',
    loadComponent: () => import('./pages/entender-modalidades/entender-modalidades').then((m) => m.EntenderModalidades),
  },
  {
    path: SEGMENTOS_SOLICITACAO.dadosNuvem,
    title: 'Confira seus dados',
    // Elegibilidade primeiro: acessar a URL direto sem elegibilidade mostra 01.E1.
    canActivate: [jornadaNuvemGuard, triagemConcluidaGuard],
    loadComponent: () => import('./pages/conferir-dados/conferir-dados').then((m) => m.ConferirDados),
  },
  {
    path: SEGMENTOS_SOLICITACAO.enviadaNuvem,
    title: 'Solicitação enviada',
    canActivate: [solicitacaoRegistradaGuard],
    loadComponent: () => import('./pages/solicitacao-enviada/solicitacao-enviada').then((m) => m.SolicitacaoEnviada),
  },
  {
    path: `${SEGMENTOS_SOLICITACAO.interrupcao}/:motivo`,
    title: tituloInterrupcao,
    canActivate: [
      (route) => isMotivoInterrupcao(route.paramMap.get('motivo')) || inject(Router).parseUrl(ROTAS_SOLICITACAO.inicio),
    ],
    loadComponent: () => import('./pages/interrupcao/interrupcao').then((m) => m.Interrupcao),
  },
  {
    // Fora do escopo desta etapa [FIGMA: seção 02 — Solicitação de Certificado em Mídia Física].
    path: SEGMENTOS_SOLICITACAO.midiaFisica,
    title: 'Solicitar certificado em mídia física',
    canActivate: [triagemConcluidaGuard],
    data: { titulo: 'Solicitar certificado em mídia física', origem: 'FIGMA: seção 02' },
    loadComponent: () => import('@shared/paginas/placeholder/placeholder').then((m) => m.Placeholder),
  },
];

export const SOLICITACAO_CERTIFICADO_ROUTES: Routes = [
  {
    path: '',
    providers: [SolicitacaoCertificadoStore, SolicitacaoCertificadoJornada],
    resolve: { jornada: iniciarJornadaResolver },
    children: PAGINAS,
  },
];
