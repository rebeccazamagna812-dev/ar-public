import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import {
  DscAccountSelect,
  DscButton,
  DscDropdown,
  DscDropdownItem,
  DscFooter,
  DscHeader,
  DscSidebarMenu,
  DscSidebarMenuItem,
} from '@dsc/web';
import { environment } from '@env/environment';
import { AutenticacaoService } from '@core/auth/autenticacao.service';
import { ITENS_NAVEGACAO } from '@core/navegacao/navegacao';

/**
 * Shell da aplicação: Header, Menu lateral (overlay), menu da conta, área de conteúdo e Footer.
 * [FIGMA: Fluxo V1 (em andamento) 2 → 00 — Navegação global (OV — Menu lateral, OV — Conta do usuário); frame "Conteúdo"]
 */
@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DscHeader,
    DscFooter,
    DscButton,
    DscAccountSelect,
    DscDropdown,
    DscDropdownItem,
    DscSidebarMenu,
    DscSidebarMenuItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.css',
  host: {
    '(document:keydown.escape)': 'fecharPaineis()',
  },
})
export class Shell {
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly autenticacao = inject(AutenticacaoService);
  private readonly conteudo = viewChild.required<ElementRef<HTMLElement>>('conteudo');
  private readonly menu = viewChild<string, ElementRef<HTMLElement>>('menu', { read: ElementRef });
  private readonly botaoConta = viewChild<string, ElementRef<HTMLElement>>('botaoConta', { read: ElementRef });

  protected readonly sistema = environment.sistema;
  protected readonly usuario = this.autenticacao.usuario;
  protected readonly itens = ITENS_NAVEGACAO;
  protected readonly menuAberto = signal(false);
  protected readonly contaAberta = signal(false);
  protected readonly copyright = `© ${new Date().getFullYear()} CAIXA ECONÔMICA FEDERAL`;

  constructor() {
    // Ao trocar de tela, fecha os painéis e leva o foco ao conteúdo (teclado e leitor de tela). [PADRÃO DE MERCADO]
    let primeiraNavegacao = true;
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.fecharPaineis();
        if (!primeiraNavegacao) {
          this.conteudo().nativeElement.focus({ preventScroll: true });
        }
        primeiraNavegacao = false;
      });
  }

  protected alternarMenu(): void {
    this.contaAberta.set(false);
    this.menuAberto.update((aberto) => !aberto);
    if (this.menuAberto()) {
      afterNextRender(() => this.menu()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus(), {
        injector: this.injector,
      });
    }
  }

  protected alternarConta(): void {
    this.menuAberto.set(false);
    this.contaAberta.update((aberta) => !aberta);
  }

  protected fecharPaineis(): void {
    this.menuAberto.set(false);
    this.contaAberta.set(false);
  }

  protected sair(): void {
    this.fecharPaineis();
    this.autenticacao.sair();
    this.botaoConta()?.nativeElement.focus();
  }
}
