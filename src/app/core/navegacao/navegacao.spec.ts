import { CARDS_HOME, ITENS_NAVEGACAO, ROTAS_EM_CONSTRUCAO } from './navegacao';

describe('navegação', () => {
  it('ordena os cards da Home como no Figma (00.01)', () => {
    expect(CARDS_HOME.map((c) => c.rota)).toEqual([
      '/solicitar',
      '/nova-midia-fisica',
      '/meus-certificados',
      '/acompanhar-solicitacoes',
      '/tratar-solicitacoes',
      '/historico-auditoria',
      '/revogar-certificado',
      '/dashboard',
      '/administracao',
    ]);
  });

  it('não repete a ordem de dois cards', () => {
    const ordens = CARDS_HOME.map((c) => c.home.ordem);
    expect(new Set(ordens).size).toBe(ordens.length);
  });

  it('gera uma rota "Em construção" por funcionalidade futura, sem repetir caminhos', () => {
    const rotas = ROTAS_EM_CONSTRUCAO.map((r) => r.rota);
    expect(rotas.length).toBe(11);
    expect(new Set(rotas).size).toBe(rotas.length);
    expect(rotas).not.toContain('/solicitar');
    expect(rotas).toContain('/duvidas-frequentes');
  });

  it('todo item do menu tem rota absoluta', () => {
    expect(ITENS_NAVEGACAO.every((i) => i.rota.startsWith('/'))).toBeTrue();
  });
});
