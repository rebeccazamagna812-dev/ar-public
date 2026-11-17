import { Injectable, signal } from '@angular/core';
import { AutenticacaoService, UsuarioSessao } from './autenticacao.service';

/** Sessão SIMULADA com o usuário de exemplo do Figma. Não use em produção. */
@Injectable()
export class AutenticacaoMockService extends AutenticacaoService {
  private readonly _usuario = signal<UsuarioSessao | null>(null);
  readonly usuario = this._usuario.asReadonly();

  iniciarSessao(): Promise<void> {
    this._usuario.set({ nome: 'João da Silva', perfil: 'Usuário', matricula: 'C000000' });
    return Promise.resolve();
  }

  sair(): void {
    // [PENDENTE] Encerramento real de sessão (redirect para o provedor de identidade).
    this._usuario.set(null);
  }
}
