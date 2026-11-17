import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DscButton, DscStateMessage } from '@dsc/web';

/** Página "não encontrado". Não está prevista nas fontes → [PADRÃO DE MERCADO] mínimo, com componentes do DSC. */
@Component({
  selector: 'app-nao-encontrado',
  imports: [RouterLink, DscButton, DscStateMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagina' },
  template: `
    <div class="pagina__feedback">
      <dsc-state-message illustration="warning" label="Página não encontrada">
        O endereço acessado não existe ou foi alterado.
      </dsc-state-message>
    </div>
    <div class="pagina__acoes">
      <a dscButton appearance="plain" routerLink="/">Ir para a página principal</a>
    </div>
  `,
})
export class NaoEncontrado {}
