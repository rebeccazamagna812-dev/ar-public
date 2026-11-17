import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscCard, DscIcon, DscIconName } from '@dsc/web';

/**
 * Card de acesso da Home. COMPONENTE CRIADO LOCALMENTE.
 * Motivo: no Figma ele é um componente local do arquivo do projeto, fora da biblioteca DSC
 * [FIGMA: AR CAIXA → Componentes → "AR-CAIXA / Card de acesso — hover grayscale 10"].
 * Construído sobre [dsc] Card (configuration=button) + [dsc] Icon, apenas com tokens.
 */
@Component({
  selector: 'app-card-acesso',
  imports: [RouterLink, DscCard, DscIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a dscCard configuration="button" class="card-acesso" [routerLink]="rota()">
      <span class="card-acesso__cabecalho">
        <dsc-icon class="card-acesso__icone" [name]="icone()" size="huge" />
        <span class="card-acesso__titulo">{{ titulo() }}</span>
      </span>
      <span class="card-acesso__descricao">{{ descricao() }}</span>
    </a>
  `,
  styles: `
    :host {
      display: flex;
    }
    .card-acesso {
      flex: 1;
      gap: var(--dsc-spacing-smaller);
      min-height: 168px;
      padding: var(--dsc-spacing-tiny);
    }
    .card-acesso__cabecalho {
      display: flex;
      align-items: center;
      gap: var(--dsc-spacing-tiny);
    }
    .card-acesso__icone {
      color: var(--dsc-color-highlight);
    }
    .card-acesso__titulo {
      color: var(--dsc-color-highlight);
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-smaller);
      line-height: var(--dsc-font-line-height-28);
    }
    .card-acesso__descricao {
      color: var(--dsc-color-content-neutral-4);
      font-family: var(--dsc-font-family-1);
      font-size: var(--dsc-font-size-micro);
      line-height: 1.5;
    }
  `,
})
export class CardAcesso {
  readonly rota = input.required<string>();
  readonly icone = input.required<DscIconName>();
  readonly titulo = input.required<string>();
  readonly descricao = input.required<string>();
}
