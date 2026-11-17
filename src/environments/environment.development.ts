import { environmentBase } from './environment.base';

/** Ambiente de desenvolvimento local (`ng serve`). */
export const environment = {
  ...environmentBase,
  production: false,
  sistema: {
    ...environmentBase.sistema,
    // Valores de exemplo do Figma, só para conferência visual em desenvolvimento.
    cgc: 'CGC 0000',
    siglaUnidade: 'SIGLA',
    textoApoio: 'Supporting text',
  },
};
