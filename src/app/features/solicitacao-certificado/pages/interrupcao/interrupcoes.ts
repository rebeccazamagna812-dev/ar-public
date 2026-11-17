import { DscIllustrationName } from '@dsc/web';
import { MotivoInterrupcao } from '@core/models/solicitacao-certificado.models';
import { ETAPAS_JORNADA, EtapaJornada } from '../../solicitacao-certificado.etapas';

/** Conteúdo de cada tela de interrupção da jornada, copiado do Figma. */
export interface ConteudoInterrupcao {
  readonly etapa: EtapaJornada;
  readonly ilustracao: DscIllustrationName;
  readonly titulo: string;
  readonly texto: string;
  readonly orientacoes: readonly string[];
  readonly acaoPrincipal: { readonly rotulo: string; readonly modalidadeNuvem: boolean };
}

export const INTERRUPCOES: Readonly<Record<MotivoInterrupcao, ConteudoInterrupcao>> = {
  /** [FIGMA: 01.E1 — Não elegível] */
  'nao-elegivel': {
    etapa: ETAPAS_JORNADA.escolha,
    ilustracao: 'warning',
    titulo: 'Certificado em nuvem indisponível',
    texto: 'Neste momento, você não atende aos critérios de elegibilidade para solicitar certificado em nuvem.',
    orientacoes: [
      'A opção é exibida somente para empregados elegíveis.',
      'Se precisar de certificado digital, escolha uma modalidade disponível para o seu perfil.',
    ],
    acaoPrincipal: { rotulo: 'Voltar', modalidadeNuvem: false },
  },
  /** [FIGMA: 01.E2 — Certificado em nuvem ativo] */
  'certificado-ativo': {
    etapa: ETAPAS_JORNADA.escolha,
    ilustracao: 'warning',
    titulo: 'Você já possui um certificado em nuvem ativo',
    texto: 'Revogue o certificado vigente antes de realizar uma nova solicitação.',
    orientacoes: [
      'Nenhuma nova solicitação será enviada ao SERPRO.',
      'Nenhum registro de nova solicitação será persistido no SIARX.',
    ],
    acaoPrincipal: { rotulo: 'Entendi', modalidadeNuvem: false },
  },
  /** [FIGMA: 01.E3 — Divergência cadastral] */
  'divergencia-cadastral': {
    etapa: ETAPAS_JORNADA.dados,
    ilustracao: 'error',
    titulo: 'Não foi possível prosseguir',
    texto:
      'Foram identificadas divergências entre os dados cadastrais da CAIXA e do SERPRO. Regularize seus dados e tente novamente.',
    orientacoes: [
      'A solicitação não foi enviada ao SERPRO.',
      'Depois da regularização cadastral, inicie uma nova tentativa.',
    ],
    acaoPrincipal: { rotulo: 'Voltar ao início', modalidadeNuvem: false },
  },
  /** [FIGMA: 01.E4 — SERPRO indisponível] */
  'serpro-indisponivel': {
    etapa: ETAPAS_JORNADA.envio,
    ilustracao: 'error',
    titulo: 'Não foi possível enviar a solicitação',
    texto: 'O serviço do SERPRO está indisponível no momento. Tente novamente mais tarde.',
    orientacoes: [
      'A solicitação não foi registrada no SIARX.',
      'Você poderá tentar novamente quando o serviço estiver disponível.',
    ],
    acaoPrincipal: { rotulo: 'Tentar novamente', modalidadeNuvem: true },
  },
};

export function isMotivoInterrupcao(valor: string | null | undefined): valor is MotivoInterrupcao {
  return !!valor && Object.prototype.hasOwnProperty.call(INTERRUPCOES, valor);
}
