import { Route, Routes } from '@angular/router';
import { Shell } from '@layout/shell/shell';
import { SEGMENTO_SOLICITACAO } from '@features/solicitacao-certificado/solicitacao-certificado.paths';

/** Rota placeholder: aponta para a tela genérica com o título da funcionalidade. */
function placeholder(path: string, titulo: string, origem: string): Route {
  return {
    path,
    title: titulo,
    data: { titulo, origem },
    loadComponent: () => import('@features/placeholder/placeholder').then((m) => m.Placeholder),
  };
}

/**
 * Mapa de rotas.
 * Fonte das funcionalidades: Menu lateral e Home [FIGMA: Fluxo V1 (em andamento) 2 → OV — Menu lateral, 00.01 — Home].
 * Nesta etapa só a jornada de solicitação de certificado em nuvem está implementada. As demais rotas são placeholders.
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
      placeholder('meus-certificados', 'Meus certificados', 'FIGMA: 01.1.01'),
      placeholder('nova-midia-fisica', 'Nova Mídia Física', 'FIGMA: 00.02'),
      placeholder('acompanhar-solicitacoes', 'Acompanhar solicitações', 'FIGMA: 07'),
      placeholder('tratar-solicitacoes', 'Tratamento de solicitações', 'FIGMA: 04'),
      placeholder('historico-auditoria', 'Histórico e auditoria', 'FIGMA: 05'),
      placeholder('revogar-certificado', 'Revogar certificado', 'FIGMA: 06 / 06.1'),
      placeholder('dashboard', 'Dashboard', 'FIGMA: 10'),
      placeholder('administracao', 'Administração', 'FIGMA: 08'),
      placeholder('duvidas-frequentes', 'Perguntas frequentes', 'FIGMA: 09'),
      placeholder('ajuda/certificado-em-nuvem', 'Certificado em nuvem', 'FIGMA: 00.01.A1'),
      placeholder('ajuda/midia-fisica', 'Mídia física: cartão ou token', 'FIGMA: 00.01.A2'),
      {
        path: '**',
        title: 'Página não encontrada',
        loadComponent: () => import('@features/nao-encontrado/nao-encontrado').then((m) => m.NaoEncontrado),
      },
    ],
  },
];
