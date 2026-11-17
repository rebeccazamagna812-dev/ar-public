/**
 * Valores comuns a todos os ambientes.
 * Fica em arquivo separado porque o build de desenvolvimento substitui environment.ts por
 * environment.development.ts (fileReplacements). Se um importasse o outro, o import seria circular.
 */
export const environmentBase = {
  production: true,
  /** [PENDENTE] URL base da API do SIARX. A documentação não define o contrato nem a base URL. */
  apiBaseUrl: '',
  /**
   * Enquanto o backend e a autenticação não estiverem definidos, a aplicação usa implementações simuladas.
   * [PENDENTE] Desligar quando a API real existir.
   */
  usarApiSimulada: true,
  sistema: {
    sigla: 'SIARX',
    nome: 'Certificados Digitais',
    /** [FIGMA: Footer → "Versão 1.0.0"] */
    versao: 'Versão 1.0.0',
    /** [PENDENTE] Valores reais do rodapé (no Figma: "CGC 0000", "SIGLA", "Supporting text"). */
    cgc: '',
    siglaUnidade: '',
    textoApoio: '',
  },
};
