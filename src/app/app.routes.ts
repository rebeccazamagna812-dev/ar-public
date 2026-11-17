import { Route, Routes } from '@angular/router';
import { ROTAS_EM_CONSTRUCAO } from '@core/navegacao/navegacao';
import { Shell } from '@layout/shell/shell';
import { SEGMENTO_SOLICITACAO } from '@features/solicitacao-certificado/solicitacao-certificado.paths';

/** Rota placeholder: aponta para a tela genérica com o título da funcionalidade. */
function placeholder(rota: string, titulo: string): Route {
  return {
    path: rota.replace(/^\//, ''),
    title: titulo,
    data: { titulo },
    loadComponent: () => import('@shared/paginas/placeholder/placeholder').then((m) => m.Placeholder),
  };
}

/**
 * Mapa de rotas.
 * Fonte das funcionalidades: Menu lateral e Home [FIGMA: Fluxo V1 (em andamento) → OV — Menu lateral, 01.00 — Home].
 * Nesta etapa só a jornada de solicitação de certificado em nuvem está implementada. As demais rotas são placeholders,
 * geradas a partir de ROTAS_EM_CONSTRUCAO: para incluir uma funcionalidade, edite só core/navegacao/navegacao.ts.
 */
export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Certificados digitais',
        loadComponent: () => import('@features/home/home').then((m) => m.Home),
      },
      {
        path: SEGMENTO_SOLICITACAO,
        loadChildren: () =>
          import('@features/solicitacao-certificado/solicitacao-certificado.routes').then(
            (m) => m.SOLICITACAO_CERTIFICADO_ROUTES,
          ),
      },
      // Funcionalidades futuras: geradas a partir da navegação (core/navegacao/navegacao.ts).
      ...ROTAS_EM_CONSTRUCAO.map(({ rota, titulo }) => placeholder(rota, titulo)),
      {
        path: '**',
        title: 'Página não encontrada',
        loadComponent: () => import('@features/nao-encontrado/nao-encontrado').then((m) => m.NaoEncontrado),
      },
    ],
  },
];
