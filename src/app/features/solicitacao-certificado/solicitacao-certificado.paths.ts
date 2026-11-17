import { MotivoInterrupcao } from '@core/models/solicitacao-certificado.models';

/**
 * Fonte única dos caminhos da funcionalidade "Solicitar certificado".
 * As rotas (solicitacao-certificado.routes.ts) usam os SEGMENTOS; guards e telas usam as URLs de ROTAS_SOLICITACAO.
 * Para mudar um caminho, altere só este arquivo.
 */
export const SEGMENTO_SOLICITACAO = 'solicitar';

/** Segmentos relativos a `/solicitar`, usados na definição das rotas. */
export const SEGMENTOS_SOLICITACAO = {
  dadosNuvem: 'nuvem/dados',
  enviada: 'nuvem/enviada',
  interrupcao: 'nuvem/indisponivel',
  midiaFisica: 'midia-fisica',
} as const;

const base = `/${SEGMENTO_SOLICITACAO}`;

/** URLs absolutas da jornada, para `routerLink`, `navigateByUrl` e `parseUrl`. */
export const ROTAS_SOLICITACAO = {
  /** 01.01 — Escolher modalidade. */
  inicio: base,
  /** 01.02 — Confira seus dados. */
  dadosNuvem: `${base}/${SEGMENTOS_SOLICITACAO.dadosNuvem}`,
  /** 01.04 — Solicitação enviada. */
  enviada: `${base}/${SEGMENTOS_SOLICITACAO.enviada}`,
  /** 01.E1–01.E4 — Interrupções da jornada. */
  interrupcao: (motivo: MotivoInterrupcao) => `${base}/${SEGMENTOS_SOLICITACAO.interrupcao}/${motivo}`,
  /** Seção 02 — Mídia física (fora do escopo desta etapa). */
  midiaFisica: `${base}/${SEGMENTOS_SOLICITACAO.midiaFisica}`,
} as const;

/** Query param que pré-seleciona a modalidade na etapa 1 (ex.: "Tentar novamente", 01.E4 → 01.01A). */
export const PARAM_MODALIDADE = 'modalidade';
