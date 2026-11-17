import { OpcaoRadio } from '@shared/ui/opcoes-radio/opcoes-radio';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';
import { RespostaEstoqueUnidade, RespostaMidiaExistente } from '../../state/solicitacao-certificado.jornada';

/** Conteúdo de uma tela de pergunta da jornada de mídia física, copiado do Figma. */
export interface ConteudoPergunta<T extends string = string> {
  readonly subtitulo: string;
  readonly titulo: string;
  readonly alerta: { readonly titulo: string; readonly texto: string };
  readonly pergunta: string;
  readonly opcoes: readonly OpcaoRadio<T>[];
  /** Destino do "Voltar" da Title Bar. */
  readonly voltar: string;
}

/** [FIGMA: 03.02 — Informar mídia existente] */
const MIDIA_EXISTENTE: ConteudoPergunta<RespostaMidiaExistente> = {
  subtitulo: 'Informe se já possui o cartão ou token que utilizará com o certificado.',
  titulo: 'Você já possui um cartão ou token?',
  alerta: {
    titulo: 'Um novo certificado não exige uma nova mídia',
    texto:
      'Se o cartão ou token estiver utilizável e for compatível, você pode reutilizá-lo. O vencimento do certificado não significa que a mídia precisa ser trocada.',
  },
  pergunta: 'Você já possui uma mídia física?',
  opcoes: [
    {
      valor: 'cartao',
      rotulo: 'Sim, tenho um cartão',
      descricao: 'Cartão de certificado digital utilizado com uma leitora.',
    },
    {
      valor: 'token',
      rotulo: 'Sim, tenho um token',
      descricao: 'Dispositivo de certificado digital conectado diretamente à USB.',
    },
    {
      valor: 'nenhuma',
      rotulo: 'Não tenho cartão nem token',
      descricao: 'Vou verificar com minha área ou gestor se existe uma mídia disponível na unidade.',
    },
  ],
  voltar: ROTAS_SOLICITACAO.inicio,
};

/** [FIGMA: 03.02A — Consultar estoque da unidade] */
const ESTOQUE_UNIDADE: ConteudoPergunta<RespostaEstoqueUnidade> = {
  subtitulo: 'Antes de requisitar uma mídia, converse com sua área ou gestor.',
  titulo: 'Consulte a disponibilidade na sua unidade',
  alerta: {
    titulo: 'Sua unidade pode ter uma mídia disponível',
    texto:
      'Verifique com sua área ou gestor se existe cartão ou token compatível disponível para você. Só acesse uma nova requisição após confirmar que não há mídia disponível.',
  },
  pergunta: 'Qual foi o retorno da sua área ou gestor?',
  opcoes: [
    {
      valor: 'disponivel',
      rotulo: 'Minha área ou gestor confirmou uma mídia disponível',
      descricao: 'Obtenha o cartão ou token disponibilizado pela unidade para solicitar o certificado.',
    },
    {
      valor: 'indisponivel',
      rotulo: 'Minha área ou gestor confirmou que não há mídia disponível',
      descricao: 'Você poderá acessar o serviço separado de Nova mídia física.',
    },
    {
      valor: 'nao-consultado',
      rotulo: 'Ainda não consultei minha área ou gestor',
      descricao: 'Faça essa consulta antes de requisitar outro cartão ou token.',
    },
  ],
  voltar: ROTAS_SOLICITACAO.midiaFisica,
};

export const PERGUNTAS = {
  'midia-existente': MIDIA_EXISTENTE,
  'estoque-unidade': ESTOQUE_UNIDADE,
} as const;

export type IdPergunta = keyof typeof PERGUNTAS;
