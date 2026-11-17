import { inject } from '@angular/core';
import { ResolveFn, Router, Routes } from '@angular/router';
import {
  iniciarJornadaResolver,
  jornadaNuvemGuard,
  midiaFisicaDefinidaGuard,
  solicitacaoRegistradaGuard,
  triagemConcluidaGuard,
} from './guards/jornada.guards';
import { INTERRUPCOES, isMotivoInterrupcao } from './pages/interrupcao/interrupcoes';
import { ORIENTACOES } from './pages/orientacao/orientacoes';
import { PERGUNTAS } from './pages/pergunta/perguntas';
import { ROTAS_SOLICITACAO, SEGMENTOS_SOLICITACAO } from './solicitacao-certificado.paths';
import { SolicitacaoCertificadoJornada } from './state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from './state/solicitacao-certificado.store';

const tituloInterrupcao: ResolveFn<string> = (route) => {
  const motivo = route.paramMap.get('motivo');
  return isMotivoInterrupcao(motivo) ? INTERRUPCOES[motivo].titulo : 'Solicitar certificado digital';
};

const conferirDados = () => import('./pages/conferir-dados/conferir-dados').then((m) => m.ConferirDados);
const solicitacaoEnviada = () =>
  import('./pages/solicitacao-enviada/solicitacao-enviada').then((m) => m.SolicitacaoEnviada);
const pergunta = () => import('./pages/pergunta/pergunta').then((m) => m.Pergunta);
const orientacao = () => import('./pages/orientacao/orientacao').then((m) => m.Orientacao);

/**
 * Rotas da funcionalidade "Solicitar certificado".
 * [FIGMA: Fluxo V1 (em andamento) → seção 03 — Solicitação guiada de certificado]
 *   /solicitar                                 03.00 (modal) + 03.01   Triagem e escolha da modalidade
 *   /solicitar/modalidades                     03.01A                  Entenda as modalidades
 *   /solicitar/nuvem/dados | enviada           03.N1 | 03.N2           Nuvem: conferir dados e enviada
 *   /solicitar/midia-fisica                    03.02                   Você já possui um cartão ou token?
 *   /solicitar/midia-fisica/estoque            03.02A                  Consulte a disponibilidade na unidade
 *   /solicitar/midia-fisica/aguardar-unidade   03.02B                  Consulte sua área ou gestor primeiro
 *   /solicitar/midia-fisica/sem-midia          03.02C                  Unidade sem mídia disponível
 *   /solicitar/midia-fisica/dados | enviada    03.04 | 03.05           Mídia física: conferir dados e enviada
 *   /solicitar/interrompida/:motivo            01.E1–01.E4             Interrupções (mantidas por decisão de produto)
 * Diagrama e regras: docs/jornada-solicitacao.md.
 *
 * O estado e a fachada são fornecidos na rota pai: só as telas desta funcionalidade os enxergam.
 * O resolver da rota pai reinicia a jornada ao entrar na funcionalidade, para a triagem 03.00 aparecer.
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

  // Nuvem
  {
    path: SEGMENTOS_SOLICITACAO.dadosNuvem,
    title: 'Confira seus dados',
    // Elegibilidade primeiro: acessar a URL direto sem elegibilidade mostra 01.E1.
    canActivate: [jornadaNuvemGuard, triagemConcluidaGuard],
    data: { modalidade: 'nuvem' },
    loadComponent: conferirDados,
  },
  {
    path: SEGMENTOS_SOLICITACAO.enviadaNuvem,
    title: 'Solicitação enviada',
    canActivate: [solicitacaoRegistradaGuard],
    data: { modalidade: 'nuvem' },
    loadComponent: solicitacaoEnviada,
  },

  // Mídia física
  {
    path: SEGMENTOS_SOLICITACAO.midiaFisica,
    title: PERGUNTAS['midia-existente'].titulo,
    canActivate: [triagemConcluidaGuard],
    data: { pergunta: 'midia-existente' },
    loadComponent: pergunta,
  },
  {
    path: SEGMENTOS_SOLICITACAO.estoque,
    title: PERGUNTAS['estoque-unidade'].titulo,
    canActivate: [triagemConcluidaGuard],
    data: { pergunta: 'estoque-unidade' },
    loadComponent: pergunta,
  },
  {
    path: SEGMENTOS_SOLICITACAO.aguardarUnidade,
    title: ORIENTACOES['aguardar-unidade'].titulo,
    canActivate: [triagemConcluidaGuard],
    data: { orientacao: 'aguardar-unidade' },
    loadComponent: orientacao,
  },
  {
    path: SEGMENTOS_SOLICITACAO.semMidia,
    title: ORIENTACOES['sem-midia'].titulo,
    canActivate: [triagemConcluidaGuard],
    data: { orientacao: 'sem-midia' },
    loadComponent: orientacao,
  },
  {
    path: SEGMENTOS_SOLICITACAO.dadosMidiaFisica,
    title: 'Confira seus dados',
    canActivate: [triagemConcluidaGuard, midiaFisicaDefinidaGuard],
    data: { modalidade: 'midia-fisica' },
    loadComponent: conferirDados,
  },
  {
    path: SEGMENTOS_SOLICITACAO.enviadaMidiaFisica,
    title: 'Solicitação enviada',
    canActivate: [solicitacaoRegistradaGuard],
    data: { modalidade: 'midia-fisica' },
    loadComponent: solicitacaoEnviada,
  },

  // Interrupções
  {
    path: `${SEGMENTOS_SOLICITACAO.interrupcao}/:motivo`,
    title: tituloInterrupcao,
    canActivate: [
      (route) => isMotivoInterrupcao(route.paramMap.get('motivo')) || inject(Router).parseUrl(ROTAS_SOLICITACAO.inicio),
    ],
    loadComponent: () => import('./pages/interrupcao/interrupcao').then((m) => m.Interrupcao),
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
