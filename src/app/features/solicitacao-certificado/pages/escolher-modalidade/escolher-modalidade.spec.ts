import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoCertificadoApi } from '@domain/certificado/solicitacao-certificado.api';
import { SolicitacaoCertificadoJornada } from '../../state/solicitacao-certificado.jornada';
import { SolicitacaoCertificadoStore } from '../../state/solicitacao-certificado.store';
import { EscolherModalidade } from './escolher-modalidade';

/**
 * 03.00 (triagem em modal) + 03.01 (escolha da modalidade).
 * [DOC: HU02 CA02, HU03a CA02, HU03c CA02 — modalidade inelegível não é exibida]
 */
describe('EscolherModalidade', () => {
  interface Opcoes {
    nuvem?: boolean;
    falhou?: boolean;
    modalidade?: string;
    triagemRespondida?: boolean;
  }

  function renderizar(opcoes: Opcoes = {}) {
    TestBed.configureTestingModule({
      imports: [EscolherModalidade],
      providers: [
        provideRouter([]),
        SolicitacaoCertificadoStore,
        SolicitacaoCertificadoJornada,
        { provide: SolicitacaoCertificadoApi, useValue: {} },
        {
          provide: ElegibilidadeService,
          useValue: {
            podeSolicitarNuvem: signal(opcoes.nuvem ?? true),
            podeSolicitarMidiaFisica: signal(true),
            falhou: signal(opcoes.falhou ?? false),
          },
        },
      ],
    });
    const jornada = TestBed.inject(SolicitacaoCertificadoJornada);
    if (opcoes.triagemRespondida ?? true) {
      jornada.responderTriagem('primeiro');
    }
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const fixture = TestBed.createComponent(EscolherModalidade);
    if (opcoes.modalidade) {
      fixture.componentRef.setInput('modalidade', opcoes.modalidade);
    }
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const dialog = el.querySelector('dialog') as HTMLDialogElement;
    const pagina = el.querySelector('.pagina__acoes') as HTMLElement;
    const botao = (raiz: Element, texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim() === texto) ??
      null;
    const marcar = (raiz: Element, valor: string) => {
      raiz.querySelector<HTMLInputElement>(`input[value="${valor}"]`)?.click();
      fixture.detectChanges();
    };
    const modalidades = () =>
      Array.from(el.querySelectorAll<HTMLInputElement>('.pagina__secao input')).map((i) => i.value);
    return { fixture, el, dialog, pagina, botao, marcar, modalidades, jornada, navegar };
  }

  describe('triagem (03.00)', () => {
    it('abre o modal ao entrar na jornada, com "Continuar" desabilitado', () => {
      const { dialog, botao } = renderizar({ triagemRespondida: false });
      expect(dialog.open).toBeTrue();
      expect(botao(dialog, 'Continuar')?.disabled).toBeTrue();
    });

    it('fecha o modal ao continuar com uma situação que permite solicitar', () => {
      const { fixture, dialog, botao, marcar, jornada } = renderizar({ triagemRespondida: false });
      marcar(dialog, 'vencido');
      botao(dialog, 'Continuar')?.click();
      fixture.detectChanges();
      expect(jornada.situacaoAnterior()).toBe('vencido');
      expect(dialog.open).toBeFalse();
    });

    it('esconde "Continuar" quando ainda há certificado válido não revogado', () => {
      const { dialog, botao, marcar } = renderizar({ triagemRespondida: false });
      marcar(dialog, 'valido-nao-revogado');
      expect(botao(dialog, 'Continuar')).toBeNull();
      expect(botao(dialog, 'Cancelar')).not.toBeNull();
      expect(dialog.textContent).toContain('Consultar meus certificados');
    });

    it('"Cancelar" volta à Página principal', () => {
      const { dialog, botao, navegar } = renderizar({ triagemRespondida: false });
      botao(dialog, 'Cancelar')?.click();
      expect(navegar).toHaveBeenCalledWith('/');
    });

    it('não reabre o modal quando a triagem já foi respondida nesta jornada', () => {
      const { dialog } = renderizar();
      expect(dialog.open).toBeFalse();
    });
  });

  describe('escolha da modalidade (03.01)', () => {
    it('elegível às duas: mostra nuvem e mídia física, com "Continuar" desabilitado', () => {
      const { pagina, botao, modalidades } = renderizar();
      expect(modalidades()).toEqual(['nuvem', 'midia-fisica']);
      expect(botao(pagina, 'Continuar')?.disabled).toBeTrue();
    });

    it('não elegível à nuvem: mostra só mídia física', () => {
      const { modalidades } = renderizar({ nuvem: false });
      expect(modalidades()).toEqual(['midia-fisica']);
    });

    it('mostra o alerta de erro, sem opções, quando a elegibilidade falhou', () => {
      const { el, modalidades } = renderizar({ falhou: true });
      expect(modalidades()).toEqual([]);
      expect(el.textContent).toContain('Não foi possível verificar as modalidades disponíveis');
    });

    it('mídia física segue para 03.02', () => {
      const { el, pagina, botao, marcar, navegar } = renderizar();
      marcar(el.querySelector('.pagina__secao') as Element, 'midia-fisica');
      botao(pagina, 'Continuar')?.click();
      expect(navegar).toHaveBeenCalledWith('/solicitar/midia-fisica');
    });

    it('pré-seleciona a nuvem com ?modalidade=nuvem e segue para 03.N1', () => {
      const { pagina, botao, navegar, jornada } = renderizar({ modalidade: 'nuvem' });
      const continuar = botao(pagina, 'Continuar');
      expect(continuar?.disabled).toBeFalse();
      continuar?.click();
      expect(navegar).toHaveBeenCalledWith('/solicitar/nuvem/dados');
      expect(jornada.modalidade()).toBe('nuvem');
    });
  });
});
