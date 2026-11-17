/** Rótulo e percentual exibidos no [dsc] Progress de cada tela da jornada. */
export interface EtapaJornada {
  readonly rotulo: string;
  readonly valor: number;
}

/**
 * Etapas da jornada de certificado em nuvem, numa fonte única.
 * [FIGMA: 01.01 "Etapa 1 de 3"; 01.02 "Etapa 2 de 3"; 01.E4 "Etapa 3 de 3"; 01.04 "Concluído"]
 */
export const ETAPAS_JORNADA = {
  escolha: { rotulo: 'Etapa 1 de 3', valor: 33 },
  dados: { rotulo: 'Etapa 2 de 3', valor: 67 },
  envio: { rotulo: 'Etapa 3 de 3', valor: 100 },
  concluido: { rotulo: 'Concluído', valor: 100 },
} as const satisfies Record<string, EtapaJornada>;
