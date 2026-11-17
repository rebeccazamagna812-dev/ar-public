import { DscButtonAppearance } from '@dsc/web';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';

/** Conteúdo de uma tela de orientação da jornada de mídia física, copiado do Figma. */
export interface ConteudoOrientacao {
  readonly subtitulo: string;
  readonly titulo: string;
  readonly alerta: { readonly titulo: string; readonly texto: string };
  readonly texto: string;
  readonly acoes: readonly {
    readonly rotulo: string;
    readonly destino: string;
    readonly aparencia: DscButtonAppearance;
  }[];
  /** Destino do "Voltar" da Title Bar. */
  readonly voltar: string;
}

export const ORIENTACOES = {
  /** [FIGMA: 03.02B — Aguardar consulta à unidade] */
  'aguardar-unidade': {
    subtitulo: 'Você pode retomar esta orientação depois de verificar a disponibilidade.',
    titulo: 'Consulte sua área ou gestor primeiro',
    alerta: {
      titulo: 'Evite uma requisição desnecessária',
      texto:
        'Pergunte à sua área ou gestor se existe cartão ou token disponível na unidade. Se houver, obtenha a mídia e continue a solicitação do certificado.',
    },
    texto:
      'Você também pode escolher o certificado em nuvem, se essa modalidade atender à sua necessidade. Nesse caso, não é necessário cartão ou token.',
    acoes: [
      { rotulo: 'Já consultei minha unidade', destino: ROTAS_SOLICITACAO.estoque, aparencia: 'plain' },
      { rotulo: 'Rever modalidade', destino: ROTAS_SOLICITACAO.inicio, aparencia: 'outline' },
    ],
    voltar: ROTAS_SOLICITACAO.estoque,
  },
  /** [FIGMA: 03.02C — Unidade sem mídia disponível] */
  'sem-midia': {
    subtitulo: 'Solicite sua primeira mídia física antes de continuar o pedido do certificado.',
    titulo: 'Sua unidade não possui mídia disponível',
    alerta: {
      titulo: 'Solicite a mídia antes do certificado',
      texto:
        'Como você ainda não possui cartão ou token e sua área ou gestor confirmou que não há mídia disponível, solicite sua primeira mídia física. Depois de recebê-la, retome a solicitação do certificado. Este pedido é apenas da mídia, não do certificado.',
    },
    texto: 'Se preferir, reveja a opção em nuvem: ela dispensa cartão, token e leitora.',
    acoes: [
      // [FIGMA: → 02.M1 — Primeira mídia] Nova mídia física ainda está "Em construção".
      { rotulo: 'Solicitar primeira mídia', destino: '/nova-midia-fisica', aparencia: 'plain' },
      { rotulo: 'Rever modalidade', destino: ROTAS_SOLICITACAO.inicio, aparencia: 'outline' },
    ],
    voltar: ROTAS_SOLICITACAO.estoque,
  },
} as const satisfies Record<string, ConteudoOrientacao>;

export type IdOrientacao = keyof typeof ORIENTACOES;
