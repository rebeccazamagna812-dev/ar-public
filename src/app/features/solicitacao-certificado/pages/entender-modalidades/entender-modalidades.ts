import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscCardAlert, DscTitleBar } from '@dsc/web';
import { ROTAS_SOLICITACAO } from '../../solicitacao-certificado.paths';

/**
 * Entenda as modalidades. [FIGMA: Fluxo V1 (em andamento) → 03.01A — Entender as modalidades]
 * Aberta por "Entender as diferenças" (03.01). "Voltar" e "Voltar à escolha" retornam a 03.01.
 */
@Component({
  selector: 'app-entender-modalidades',
  imports: [RouterLink, DscButton, DscCardAlert, DscTitleBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  template: `
    <dsc-title-bar
      title="Entenda as modalidades"
      subtitle="As duas opções permitem identificar você e assinar digitalmente."
    >
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="arrow-left" [routerLink]="rotaEscolha">
        Voltar
      </a>
      <a dscTitleBarAction dscButton appearance="chromeless" iconLeft="home" routerLink="/">Página principal</a>
    </dsc-title-bar>

    <dsc-card-alert title="Em nuvem — autorização pelo celular">
      O certificado fica na infraestrutura protegida do SERPRO. Você usa o celular para autorizar seu uso, sem precisar
      conectar cartão, token ou leitora.
    </dsc-card-alert>
    <dsc-card-alert title="Em mídia física — cartão ou token">
      O certificado fica guardado no dispositivo. O cartão precisa de uma leitora; o token conecta diretamente à USB.
      Cartão e token são duas mídias da mesma modalidade.
    </dsc-card-alert>

    <section class="pagina__secao">
      <h2 class="dsc-typography-title-small-semibold">Certificado e mídia não são a mesma coisa</h2>
      <p class="dsc-typography-body-standard">
        O certificado tem prazo de validade. O cartão ou token é o objeto que o guarda e pode ser reutilizado, desde que
        esteja utilizável e seja compatível.
      </p>
    </section>

    <div class="pagina__acoes pagina__acoes--apos-conteudo">
      <a dscButton appearance="plain" [routerLink]="rotaEscolha">Voltar à escolha</a>
    </div>
  `,
})
export class EntenderModalidades {
  protected readonly rotaEscolha = ROTAS_SOLICITACAO.inicio;
}
