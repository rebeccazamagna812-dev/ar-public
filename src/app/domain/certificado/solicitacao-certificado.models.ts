/**
 * Modelos de domínio usados pela jornada de solicitação de certificado em nuvem.
 * Os campos vêm apenas do que está visível no Figma ou escrito na documentação. Nada foi inventado.
 */

/** Modalidades de certificado [DOC: HU01/HU02] [FIGMA: 01.01 — "Certificado em nuvem" / "Certificado para mídia física"]. */
export type ModalidadeCertificado = 'nuvem' | 'midia-fisica';

/**
 * Situação do certificado anterior, respondida antes de escolher a modalidade
 * [FIGMA: 03.00 — "Antes de solicitar seu certificado"].
 * Só `valido-nao-revogado` impede seguir: é preciso revogar o certificado vigente antes [FIGMA: 03.00; 10.04.03].
 */
export type SituacaoCertificadoAnterior = 'primeiro' | 'revogado' | 'vencido' | 'valido-nao-revogado';

/**
 * Mídia física que guardará o certificado [FIGMA: 03.02 — Informar mídia existente; 03.02A — Consultar estoque].
 * - cartao / token: o empregado já possui a mídia;
 * - disponibilizada-pela-unidade: a área ou o gestor confirmou uma mídia disponível na unidade.
 * O pedido é só do certificado: nenhuma mídia é enviada [FIGMA: 03.04 — "Este pedido não inclui uma nova mídia"].
 */
export type MidiaFisica = 'cartao' | 'token' | 'disponibilizada-pela-unidade';

/**
 * Pedido de certificado enviado ao SERPRO.
 * [PENDENTE] Contrato real; também não está definido se a situação do certificado anterior (03.00) vai no pedido.
 */
export type PedidoCertificado =
  { readonly modalidade: 'nuvem' } | { readonly modalidade: 'midia-fisica'; readonly midia: MidiaFisica };

/**
 * Resultado da avaliação de elegibilidade feita após o login [DOC: HU03a, HU03c].
 * Indica quais modalidades o empregado pode solicitar. A regra em si (liberação de matrícula,
 * disponibilidade do piloto) fica no backend [DOC: HU21a] [FIGMA: 08.02].
 */
export interface Elegibilidade {
  readonly nuvem: boolean;
  readonly midiaFisica: boolean;
}

/**
 * Dados cadastrais obtidos do IntegraMais (RH), somente leitura [FIGMA: 03.N1, 03.04 — Confira seus dados] [DOC: HU05].
 * [PENDENTE] Formato real do contrato da API.
 */
export interface DadosCadastrais {
  readonly nomeCompleto: string;
  readonly cpf: string;
  readonly matricula: string;
  readonly emailCorporativo: string;
  /** Data no formato ISO (AAAA-MM-DD). */
  readonly dataNascimento: string;
}

/** Retorno de uma solicitação registrada com sucesso [FIGMA: 01.04 — Referência, e-mail do SERPRO]. */
export interface SolicitacaoRegistrada {
  readonly referencia: string;
  /** E-mail para onde o SERPRO envia a mensagem de validação de identidade. */
  readonly emailValidacao: string;
}

/**
 * Motivos que interrompem a jornada [FIGMA: 01.E1–01.E4].
 * - nao-elegivel: empregado sem elegibilidade à nuvem [DOC: HU02 CA02, HU03c]
 * - certificado-ativo: já existe certificado em nuvem ativo [DOC: HU04]
 * - divergencia-cadastral: divergência entre dados CAIXA e SERPRO [FIGMA: 01.E3]
 * - serpro-indisponivel: SERPRO fora do ar no envio; nada é registrado [FIGMA: 01.E4]
 */
export type MotivoInterrupcao = 'nao-elegivel' | 'certificado-ativo' | 'divergencia-cadastral' | 'serpro-indisponivel';

export type ResultadoEnvioSolicitacao =
  | { readonly tipo: 'registrada'; readonly solicitacao: SolicitacaoRegistrada }
  | {
      readonly tipo: 'interrompida';
      readonly motivo: Extract<MotivoInterrupcao, 'divergencia-cadastral' | 'serpro-indisponivel'>;
    };
