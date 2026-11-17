/** Rótulo e percentual exibidos no [dsc] Progress de cada tela da jornada. */
export interface EtapaJornada {
  readonly rotulo: string;
  readonly valor: number;
}

/**
 * Rótulos do [dsc] Progress, numa fonte única.
 * Na seção 03 do protótipo só as telas de enviada têm Progress ("Concluído", 03.N2/03.05). As demais etapas
 * são usadas pelas interrupções 01.E1–01.E4, mantidas do fluxo anterior por decisão de produto
 * [FIGMA (fluxo anterior): 01.01 "Etapa 1 de 3"; 01.02 "Etapa 2 de 3"; 01.E4 "Etapa 3 de 3"].
 */
export const ETAPAS_JORNADA = {
  escolha: { rotulo: 'Etapa 1 de 3', valor: 33 },
  dados: { rotulo: 'Etapa 2 de 3', valor: 67 },
  envio: { rotulo: 'Etapa 3 de 3', valor: 100 },
  concluido: { rotulo: 'Concluído', valor: 100 },
} as const satisfies Record<string, EtapaJornada>;
