import { DscIconName } from '@dsc/web';

/**
 * Itens de navegação do SIARX, numa fonte única usada pelo Menu lateral e pelos cards da Home.
 * [FIGMA: Fluxo V1 (em andamento) 2 → OV — Menu lateral; 00.01 — Home]
 * Hoje todos os perfis veem todos os itens, como no Figma.
 * [PENDENTE] Filtro por perfil (Fase 1, F9/G2).
 */
export interface ItemNavegacao {
  readonly rota: string;
  /** Rótulo no Menu lateral. */
  readonly rotuloMenu: string;
  readonly icone: DscIconName;
  /** Card de acesso na Home (ausente = não aparece na Home). */
  readonly home?: { readonly titulo: string; readonly descricao: string };
}

export const ITENS_NAVEGACAO: readonly ItemNavegacao[] = [
  { rota: '/', rotuloMenu: 'Página principal', icone: 'home' },
  {
    rota: '/meus-certificados',
    rotuloMenu: 'Meus certificados',
    icone: 'doc-star',
    home: {
      titulo: 'Meus certificados',
      descricao: 'Consulte a situação e a validade dos certificados emitidos para você.',
    },
  },
  {
    rota: '/nova-midia-fisica',
    rotuloMenu: 'Nova Mídia Física',
    icone: 'card-shield',
    home: {
      titulo: 'Solicitar Mídia Física',
      descricao: 'Verifique se precisa de outro token ou cartão antes de solicitar uma nova mídia.',
    },
  },
  {
    rota: '/solicitar',
    rotuloMenu: 'Solicitar certificado',
    icone: 'doc-star-in',
    home: {
      titulo: 'Solicitar Certificado',
      descricao: 'Solicite um certificado em nuvem ou para a mídia física que você já possui.',
    },
  },
  {
    rota: '/acompanhar-solicitacoes',
    rotuloMenu: 'Acompanhar solicitações',
    icone: 'page-search',
    home: {
      titulo: 'Acompanhar solicitações',
      descricao: 'Acompanhe seus pedidos e consulte as orientações de ativação.',
    },
  },
  {
    rota: '/tratar-solicitacoes',
    rotuloMenu: 'Tratar solicitações',
    icone: 'clipboard-check',
    home: {
      titulo: 'Tratar solicitações',
      descricao: 'Analise os pedidos e registre a decisão de tratamento.',
    },
  },
  {
    rota: '/historico-auditoria',
    rotuloMenu: 'Histórico e auditoria',
    icone: 'clock-rotate-left',
    home: {
      titulo: 'Histórico e auditoria',
      descricao: 'Consulte registros e informações para auditoria.',
    },
  },
  {
    rota: '/revogar-certificado',
    rotuloMenu: 'Revogar certificado',
    icone: 'prohibition',
    home: {
      titulo: 'Revogar certificado',
      descricao: 'Solicite a revogação de um certificado ativo.',
    },
  },
  {
    rota: '/dashboard',
    rotuloMenu: 'Dashboard',
    icone: 'dashboard',
    home: {
      titulo: 'Dashboard',
      descricao: 'Visualize indicadores e solicitações que precisam de atenção.',
    },
  },
  {
    rota: '/administracao',
    rotuloMenu: 'Administração',
    icone: 'settings',
    home: {
      titulo: 'Administração',
      descricao: 'Gerencie funcionalidades e cadastros de agentes e autorizadores.',
    },
  },
];

/**
 * Ordem dos cards na Home, que no Figma é diferente da ordem do menu.
 * [FIGMA: 00.01 — Home → Linhas 1–3]
 */
export const ORDEM_HOME: readonly string[] = [
  '/solicitar',
  '/nova-midia-fisica',
  '/meus-certificados',
  '/acompanhar-solicitacoes',
  '/tratar-solicitacoes',
  '/historico-auditoria',
  '/revogar-certificado',
  '/dashboard',
  '/administracao',
];
