import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

/** Título da aba: "<título da rota> | SIARX". [PADRÃO DE MERCADO] Ajuda na navegação por leitores de tela. */
@Injectable()
export class SiarxTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titulo = this.buildTitle(snapshot);
    this.title.setTitle(titulo ? `${titulo} | SIARX` : 'SIARX — Certificados Digitais');
  }
}
