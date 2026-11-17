import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import {
  DadosCadastrais,
  Elegibilidade,
  ResultadoEnvioSolicitacao,
} from '@domain/certificado/solicitacao-certificado.models';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { CENARIO_SIMULADO } from './cenario-simulado';

/** Latência simulada, só para os estados de carregamento ficarem visíveis. */
const LATENCIA_MS = 400;

/**
 * Implementação SIMULADA da API, sem backend.
 * Os dados de exemplo são os mesmos exibidos no Figma [FIGMA: 01.02, 01.04].
 * Escolha um cenário pela URL, por exemplo: http://localhost:4200/?cenario=serpro-indisponivel
 */
@Injectable()
export class SolicitacaoCertificadoMockApi extends SolicitacaoCertificadoApi {
  private readonly cenario = inject(CENARIO_SIMULADO);

  obterElegibilidade(): Observable<Elegibilidade> {
    return of({ nuvem: this.cenario !== 'nao-elegivel', midiaFisica: true }).pipe(delay(LATENCIA_MS));
  }

  possuiCertificadoNuvemAtivo(): Observable<boolean> {
    return of(this.cenario === 'certificado-ativo').pipe(delay(LATENCIA_MS));
  }

  obterDadosCadastrais(): Observable<DadosCadastrais> {
    return of({
      nomeCompleto: 'João da Silva',
      cpf: '12345678910',
      matricula: 'C000000',
      documentoIdentidade: 'RG 1.123.456.15 ISP/GO',
      emailCorporativo: 'nome.sobrenome@caixa.gov.br',
      dataNascimento: '1990-01-01',
    }).pipe(delay(LATENCIA_MS));
  }

  /** Os cenários de envio valem para as duas modalidades. */
  enviarSolicitacao(): Observable<ResultadoEnvioSolicitacao> {
    let resultado: ResultadoEnvioSolicitacao;
    switch (this.cenario) {
      case 'divergencia-cadastral':
        resultado = { tipo: 'interrompida', motivo: 'divergencia-cadastral' };
        break;
      case 'serpro-indisponivel':
        resultado = { tipo: 'interrompida', motivo: 'serpro-indisponivel' };
        break;
      default:
        resultado = {
          tipo: 'registrada',
          solicitacao: { referencia: '2026-00012345', emailValidacao: 'usuario@caixa.gov.br' },
        };
    }
    return of(resultado).pipe(delay(LATENCIA_MS * 2));
  }
}
