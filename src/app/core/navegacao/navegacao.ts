import { DscIconName } from '@dsc/web';

/**
 * Itens de navegação do SIARX, numa fonte única usada pelo Menu lateral e pelos cards da Home.
 * [FIGMA: Fluxo V1 (em andamento) → 00 — Navegação global (OV — Menu lateral); 01.00 — Home]
 * Hoje todos os perfis veem todos os itens, como no Figma.
 * [PENDENTE] Filtro por perfil (Fase 1, F9/G2).
 */
export interface ItemNavegacao {
  readonly rota: string;
  /** Rótulo no Menu lateral. */
  readonly rotuloMenu: string;
  readonly icone: DscIconName;
  /**
   * Card de acesso na Home (ausente = não aparece na Home).
   * `ordem`: posição do card, que no Figma é diferente da ordem do menu [FIGMA: 01.00 — Home → Linhas 1–3].
   */
  readonly home?: { readonly ordem: number; readonly titulo: string; readonly descricao: string };
  /** Funcionalidade ainda não implementada: gera uma rota para a tela "Em construção". */
  readonly emConstrucao?: PaginaEmConstrucao;
}

/** Dados da tela "Em construção" de uma funcionalidade futura. */
export interface PaginaEmConstrucao {
  /** Título da página (pode diferir do rótulo do menu). */
  readonly titulo: string;
}

export const ITENS_NAVEGACAO: readonly ItemNavegacao[] = [
  { rota: '/', rotuloMenu: 'Página principal', icone: 'home' },
  {
    rota: '/meus-certificados',
    rotuloMenu: 'Meus certificados',
    icone: 'doc-star',
    home: {
      ordem: 3,
      titulo: 'Meus certificados',
      descricao: 'Consulte a situação e a validade dos certificados emitidos para você.',
    },
    emConstrucao: { titulo: 'Meus certificados' },
  },
  {
    rota: '/nova-midia-fisica',
    rotuloMenu: 'Nova Mídia Física',
    icone: 'card-shield',
    home: {
      ordem: 2,
      titulo: 'Solicitar Mídia Física',
      descricao: 'Verifique se precisa de outro token ou cartão antes de solicitar uma nova mídia.',
    },
    emConstrucao: { titulo: 'Nova Mídia Física' },
  },
  {
    rota: '/solicitar',
    rotuloMenu: 'Solicitar certificado',
    icone: 'doc-star-in',
    home: {
      ordem: 1,
      titulo: 'Solicitar Certificado',
      descricao: 'Solicite um certificado em nuvem ou para a mídia física que você já possui.',
    },
  },
  {
    rota: '/acompanhar-solicitacoes',
    rotuloMenu: 'Acompanhar solicitações',
    icone: 'page-search',
    home: {
      ordem: 4,
      titulo: 'Acompanhar solicitações',
      descricao: 'Acompanhe seus pedidos e consulte as orientações de ativação.',
    },
    emConstrucao: { titulo: 'Acompanhar solicitações' },
  },
  {
    rota: '/tratar-solicitacoes',
    rotuloMenu: 'Tratar solicitações',
    icone: 'clipboard-check',
    home: {
      ordem: 5,
      titulo: 'Tratar solicitações',
      descricao: 'Analise os pedidos e registre a decisão de tratamento.',
    },
    emConstrucao: { titulo: 'Tratamento de solicitações' },
  },
  {
    rota: '/historico-auditoria',
    rotuloMenu: 'Histórico e auditoria',
    icone: 'clock-rotate-left',
    home: {
      ordem: 6,
      titulo: 'Histórico e auditoria',
      descricao: 'Consulte registros e informações para auditoria.',
    },
    emConstrucao: { titulo: 'Histórico e auditoria' },
  },
  {
    rota: '/revogar-certificado',
    rotuloMenu: 'Revogar certificado',
    icone: 'prohibition',
    home: {
      ordem: 7,
      titulo: 'Revogar certificado',
      descricao: 'Solicite a revogação de um certificado ativo.',
    },
    emConstrucao: { titulo: 'Revogar certificado' },
  },
  {
    rota: '/dashboard',
    rotuloMenu: 'Dashboard',
    icone: 'dashboard',
    home: {
      ordem: 8,
      titulo: 'Dashboard',
      descricao: 'Visualize indicadores e solicitações que precisam de atenção.',
    },
    emConstrucao: { titulo: 'Dashboard' },
  },
  {
    rota: '/administracao',
    rotuloMenu: 'Administração',
    icone: 'settings',
    home: {
      ordem: 9,
      titulo: 'Administração',
      descricao: 'Gerencie funcionalidades e cadastros de agentes e autorizadores.',
    },
    emConstrucao: { titulo: 'Administração' },
  },
];

/** Páginas fora do menu lateral que ainda não foram implementadas. */
export const PAGINAS_FORA_DO_MENU: readonly (PaginaEmConstrucao & { readonly rota: string })[] = [
  { rota: '/duvidas-frequentes', titulo: 'Perguntas frequentes' },
  { rota: '/ajuda/certificado-em-nuvem', titulo: 'Certificado em nuvem' },
  { rota: '/ajuda/midia-fisica', titulo: 'Mídia física: cartão ou token' },
];

type ItemHome = ItemNavegacao & { readonly home: NonNullable<ItemNavegacao['home']> };

/** Cards de acesso da Home, já na ordem do Figma. */
export const CARDS_HOME: readonly ItemHome[] = ITENS_NAVEGACAO.filter((i): i is ItemHome => !!i.home).sort(
  (a, b) => a.home.ordem - b.home.ordem,
);

/** Todas as rotas que hoje apontam para a tela "Em construção" (menu + páginas fora do menu). */
export const ROTAS_EM_CONSTRUCAO: readonly (PaginaEmConstrucao & { readonly rota: string })[] = [
  ...ITENS_NAVEGACAO.flatMap((i) => (i.emConstrucao ? [{ rota: i.rota, ...i.emConstrucao }] : [])),
  ...PAGINAS_FORA_DO_MENU,
];
