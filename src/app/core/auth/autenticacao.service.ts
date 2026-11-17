import { Signal } from '@angular/core';

/** Usuário da sessão, como aparece no Account Select do Header [FIGMA: Header → "João da Silva · Usuário · C000000"]. */
export interface UsuarioSessao {
  readonly nome: string;
  /** Rótulo do perfil exibido no Header (ex.: "Usuário"). */
  readonly perfil: string;
  readonly matricula: string;
}

/**
 * Contrato de autenticação.
 * [PENDENTE] Mecanismo de autenticação (SSO/OIDC/outro), provedor de identidade, origem dos perfis
 * e tempo de sessão. A documentação não define nada disso (HU22a RN02 deixa em aberto).
 */
export abstract class AutenticacaoService {
  abstract readonly usuario: Signal<UsuarioSessao | null>;
  /** Inicia ou recupera a sessão. É chamado no bootstrap da aplicação. */
  abstract iniciarSessao(): Promise<void>;
  abstract sair(): void;
}
