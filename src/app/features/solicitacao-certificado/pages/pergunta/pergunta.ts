import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DscButton, DscCardAlert, DscTitleBar } from '@dsc/web';
import { OpcoesRadio } from '@shared/ui/opcoes-radio/opcoes-radio';
import {
  RespostaEstoqueUnidade,
  RespostaMidiaExistente,
  SolicitacaoCertificadoJornada,
} from '../../state/solicitacao-certificado.jornada';
import { IdPergunta, PERGUNTAS } from './perguntas';

/**
 * Tela de pergunta da jornada de mídia física, guiada por configuração (perguntas.ts).
 * [FIGMA: 03.02 — Informar mídia existente; 03.02A — Consultar estoque da unidade]
 * A pergunta vem do `data` da rota; a resposta vai para a fachada, que devolve a próxima tela.
 * "Continuar" fica desabilitado até escolher uma opção.
 */
@Component({
  selector: 'app-pergunta',
  imports: [RouterLink, DscButton, DscCardAlert, DscTitleBar, OpcoesRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  template: `
    @let c = conteudo();
    <dsc-title-bar [title]="c.titulo" [subtitle]="c.subtitulo">
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="arrow-left" [routerLink]="c.voltar">Voltar</a>
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="home" routerLink="/">Página principal</a>
    </dsc-title-bar>

    <dsc-card-alert [title]="c.alerta.titulo">{{ c.alerta.texto }}</dsc-card-alert>

    <section class="pagina__secao">
      <h2 id="pergunta" class="dsc-typography-title-small-semibold">{{ c.pergunta }}</h2>
      <app-opcoes-radio [nome]="pergunta()" rotuladoPor="pergunta" [opcoes]="c.opcoes" [(selecionada)]="selecionada" />
    </section>

    <div class="pagina__acoes pagina__acoes--apos-conteudo">
      <button dscButton type="button" appearance="plain" [disabled]="!selecionada()" (click)="continuar()">
        Continuar
      </button>
    </div>
  `,
})
export class Pergunta {
  private readonly jornada = inject(SolicitacaoCertificadoJornada);
  private readonly router = inject(Router);

  /** `data.pergunta` da rota. */
  readonly pergunta = input.required<IdPergunta>();

  protected readonly conteudo = computed(() => PERGUNTAS[this.pergunta()]);
  /** Começa vazia a cada pergunta. */
  protected readonly selecionada = linkedSignal<string | null>(() => (this.pergunta(), null));

  protected continuar(): void {
    const resposta = this.selecionada();
    const destino = resposta ? this.responder(resposta) : null;
    if (destino) {
      void this.router.navigateByUrl(destino);
    }
  }

  private responder(resposta: string): string | null {
    switch (this.pergunta()) {
      case 'midia-existente': {
        const valor = PERGUNTAS['midia-existente'].opcoes.find((o) => o.valor === resposta)?.valor;
        return valor ? this.jornada.informarMidiaExistente(valor satisfies RespostaMidiaExistente) : null;
      }
      case 'estoque-unidade': {
        const valor = PERGUNTAS['estoque-unidade'].opcoes.find((o) => o.valor === resposta)?.valor;
        return valor ? this.jornada.informarEstoqueUnidade(valor satisfies RespostaEstoqueUnidade) : null;
      }
    }
  }
}
