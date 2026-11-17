import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DscCard, DscRadio } from '@dsc/web';

/** Uma opção de resposta: valor, rótulo do rádio e descrição opcional abaixo dele. */
export interface OpcaoRadio<T extends string = string> {
  readonly valor: T;
  readonly rotulo: string;
  readonly descricao?: string;
}

/**
 * Grupo de cards com rádio para perguntas de resposta única. COMPONENTE CRIADO LOCALMENTE.
 * [FIGMA: 03.00, 03.01, 03.02, 03.02A — [dsc] Card configuration=radio button + [dsc] Radio + [dsc] Text]
 * Uso: <app-opcoes-radio nome="midia" rotuladoPor="id-da-pergunta" [opcoes]="opcoes" [(selecionada)]="valor" />
 * Teclado e leitor de tela usam os <input type="radio"> nativos; o clique no card é atalho de mouse.
 */
@Component({
  selector: 'app-opcoes-radio',
  imports: [DscCard, DscRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="opcoes" role="radiogroup" [attr.aria-labelledby]="rotuladoPor()">
      @for (opcao of opcoes(); track opcao.valor) {
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div
          dscCard
          configuration="radio-button"
          [checked]="selecionada() === opcao.valor"
          (click)="selecionada.set(opcao.valor)"
        >
          <div class="opcao">
            <dsc-radio
              [name]="nome()"
              [value]="opcao.valor"
              [checked]="selecionada() === opcao.valor"
              (selected)="selecionada.set($event)"
            >
              {{ opcao.rotulo }}
            </dsc-radio>
            @if (opcao.descricao) {
              <p class="opcao__descricao">{{ opcao.descricao }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .opcoes {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-tiny);
    }
    /* [FIGMA: "Conteúdo da opção" — padding 4 dentro do Card Body (padding 16)] */
    .opcao {
      display: flex;
      flex-direction: column;
      gap: var(--dsc-spacing-quark);
      padding: calc(var(--dsc-spacing-tiny) + var(--dsc-spacing-quark));
    }
    .opcao__descricao {
      margin: 0;
      color: var(--dsc-color-on-neutral-1);
      font-family: var(--dsc-font-family-2);
      font-size: var(--dsc-font-size-micro);
      line-height: var(--dsc-font-line-height-24);
      letter-spacing: var(--dsc-font-letter-spacing-extended);
    }
  `,
})
export class OpcoesRadio {
  /** Atributo `name` dos rádios (um por grupo). */
  readonly nome = input.required<string>();
  readonly opcoes = input.required<readonly OpcaoRadio[]>();
  /** Id do elemento que rotula o grupo (a pergunta). */
  readonly rotuladoPor = input<string | null>(null);
  /** Valor selecionado; aceita two-way binding: [(selecionada)]. */
  readonly selecionada = model<string | null>(null);
}
