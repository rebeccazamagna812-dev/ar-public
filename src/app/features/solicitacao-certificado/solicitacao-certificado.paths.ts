import { ModalidadeCertificado, MotivoInterrupcao } from '@domain/certificado/solicitacao-certificado.models';

/**
 * Fonte única dos caminhos da funcionalidade "Solicitar certificado".
 * As rotas (solicitacao-certificado.routes.ts) usam os SEGMENTOS; guards, fachada e telas usam ROTAS_SOLICITACAO.
 * Para mudar um caminho, altere só este arquivo.
 * [FIGMA: Fluxo V1 (em andamento) → seção 03 — Solicitação guiada de certificado]
 */
export const SEGMENTO_SOLICITACAO = 'solicitar';

/** Segmentos relativos a `/solicitar`, usados na definição das rotas. */
export const SEGMENTOS_SOLICITACAO = {
  modalidades: 'modalidades',
  dadosNuvem: 'nuvem/dados',
  enviadaNuvem: 'nuvem/enviada',
  midiaFisica: 'midia-fisica',
  estoque: 'midia-fisica/estoque',
  aguardarUnidade: 'midia-fisica/aguardar-unidade',
  semMidia: 'midia-fisica/sem-midia',
  dadosMidiaFisica: 'midia-fisica/dados',
  enviadaMidiaFisica: 'midia-fisica/enviada',
  interrupcao: 'interrompida',
} as const;

const base = `/${SEGMENTO_SOLICITACAO}`;
const url = (segmento: string) => `${base}/${segmento}`;

/** URLs absolutas da jornada, para `routerLink`, `navigateByUrl` e `parseUrl`. */
export const ROTAS_SOLICITACAO = {
  /** 03.00 / 03.01 — Triagem (modal) e escolha da modalidade. */
  inicio: base,
  /** 03.01A — Entender as modalidades. */
  modalidades: url(SEGMENTOS_SOLICITACAO.modalidades),
  /** 03.N1 / 03.04 — Confira seus dados. */
  dados: (modalidade: ModalidadeCertificado) =>
    url(modalidade === 'nuvem' ? SEGMENTOS_SOLICITACAO.dadosNuvem : SEGMENTOS_SOLICITACAO.dadosMidiaFisica),
  /** 03.N2 / 03.05 — Solicitação enviada. */
  enviada: (modalidade: ModalidadeCertificado) =>
    url(modalidade === 'nuvem' ? SEGMENTOS_SOLICITACAO.enviadaNuvem : SEGMENTOS_SOLICITACAO.enviadaMidiaFisica),
  /** 03.02 — Você já possui um cartão ou token? */
  midiaFisica: url(SEGMENTOS_SOLICITACAO.midiaFisica),
  /** 03.02A — Consulte a disponibilidade na sua unidade. */
  estoque: url(SEGMENTOS_SOLICITACAO.estoque),
  /** 03.02B — Consulte sua área ou gestor primeiro. */
  aguardarUnidade: url(SEGMENTOS_SOLICITACAO.aguardarUnidade),
  /** 03.02C — Sua unidade não possui mídia disponível. */
  semMidia: url(SEGMENTOS_SOLICITACAO.semMidia),
  /** 01.E1–01.E4 — Interrupções da jornada (mantidas do fluxo anterior por decisão de produto). */
  interrupcao: (motivo: MotivoInterrupcao) => url(`${SEGMENTOS_SOLICITACAO.interrupcao}/${motivo}`),
} as const;

/** Query param que pré-seleciona a modalidade na escolha (ex.: "Tentar novamente", 01.E4). */
export const PARAM_MODALIDADE = 'modalidade';
