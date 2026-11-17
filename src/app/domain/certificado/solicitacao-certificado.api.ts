import { Observable } from 'rxjs';
import { DadosCadastrais, Elegibilidade, ResultadoEnvioSolicitacao } from './solicitacao-certificado.models';

/**
 * Contrato de acesso ao backend do SIARX para a jornada de solicitação.
 *
 * É uma classe abstrata usada como token de injeção: as telas dependem só deste contrato.
 * Hoje a implementação registrada é a simulada (src/app/mocks/solicitacao-certificado-api.mock.ts).
 *
 * [PENDENTE] Endpoints, formato de erro e paginação do backend não estão definidos na documentação.
 * Quando estiverem, crie uma implementação HTTP (ex.: solicitacao-certificado.http-api.ts) e troque o provider
 * em core/providers/siarx.providers.ts. Nenhuma tela precisa mudar.
 */
export abstract class SolicitacaoCertificadoApi {
  /** Elegibilidade por modalidade, avaliada após o login [DOC: HU03a RF04]. */
  abstract obterElegibilidade(): Observable<Elegibilidade>;

  /** Verifica se já existe certificado em nuvem ativo para o titular [DOC: HU04] [FIGMA: 01.E2]. */
  abstract possuiCertificadoNuvemAtivo(): Observable<boolean>;

  /** Dados cadastrais do IntegraMais, somente leitura [DOC: HU05] [FIGMA: 01.02]. */
  abstract obterDadosCadastrais(): Observable<DadosCadastrais>;

  /**
   * Envia a solicitação ao SERPRO. A solicitação só é registrada no SIARX depois do retorno bem-sucedido
   * com o número de referência [FIGMA: 01.03 — "Antes de confirmar"; 01.E4].
   */
  abstract enviarSolicitacaoNuvem(): Observable<ResultadoEnvioSolicitacao>;
}
