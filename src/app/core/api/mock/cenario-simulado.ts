import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

/**
 * Cenários da API simulada, escolhidos pelo parâmetro `?cenario=` na URL de entrada.
 * Servem para ver no navegador cada tela de exceção do Figma (01.E1–01.E4).
 */
export const CENARIOS_SIMULADOS = [
  'padrao',
  'nao-elegivel',
  'certificado-ativo',
  'divergencia-cadastral',
  'serpro-indisponivel',
] as const;

export type CenarioSimulado = (typeof CENARIOS_SIMULADOS)[number];

export const CENARIO_SIMULADO = new InjectionToken<CenarioSimulado>('CENARIO_SIMULADO', {
  providedIn: 'root',
  factory: () => {
    const valor = new URLSearchParams(inject(DOCUMENT).location.search).get('cenario');
    return (CENARIOS_SIMULADOS as readonly string[]).includes(valor ?? '')
      ? (valor as CenarioSimulado)
      : 'padrao';
  },
});
