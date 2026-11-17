import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ElegibilidadeService } from '@domain/certificado/elegibilidade.service';
import { SolicitacaoNuvemJornada } from '../../state/solicitacao-nuvem.jornada';
import { EscolherModalidade } from './escolher-modalidade';

/** Etapa 1 [FIGMA: 01.01 / 01.01A] [DOC: HU02 CA02, HU03a CA02, HU03c CA02]. */
describe('EscolherModalidade', () => {
  function renderizar(opcoes: { nuvem?: boolean; midiaFisica?: boolean; falhou?: boolean; modalidade?: string } = {}) {
    const reiniciar = jasmine.createSpy('reiniciar');
    TestBed.configureTestingModule({
      imports: [EscolherModalidade],
      providers: [
        provideRouter([]),
        {
          provide: ElegibilidadeService,
          useValue: {
            podeSolicitarNuvem: signal(opcoes.nuvem ?? true),
            podeSolicitarMidiaFisica: signal(opcoes.midiaFisica ?? true),
            falhou: signal(opcoes.falhou ?? false),
          },
        },
        { provide: SolicitacaoNuvemJornada, useValue: { reiniciar } },
      ],
    });
    const fixture = TestBed.createComponent(EscolherModalidade);
    if (opcoes.modalidade) {
      fixture.componentRef.setInput('modalidade', opcoes.modalidade);
    }
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const botao = (texto: string) =>
      Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.trim() === texto) ?? null;
    return { fixture, el, botao, reiniciar };
  }

  it('recomeça a jornada ao abrir', () => {
    const { reiniciar } = renderizar();
    expect(reiniciar).toHaveBeenCalled();
  });

  it('mostra as duas modalidades e "Continuar" desabilitado, sem "Voltar", quando nada foi escolhido', () => {
    const { el, botao } = renderizar();
    expect(el.querySelectorAll('dsc-radio').length).toBe(2);
    expect(botao('Continuar')?.disabled).toBeTrue();
    expect(botao('Voltar')).toBeNull();
  });

  it('não exibe a nuvem quando o empregado não é elegível', () => {
    const { el } = renderizar({ nuvem: false });
    expect(el.querySelector('dsc-radio input[value=nuvem]')).toBeNull();
    expect(el.querySelector('dsc-radio input[value=midia-fisica]')).not.toBeNull();
  });

  it('mostra o alerta de erro, sem opções, quando a elegibilidade falhou', () => {
    const { el } = renderizar({ falhou: true });
    expect(el.querySelectorAll('dsc-radio').length).toBe(0);
    expect(el.textContent).toContain('Não foi possível verificar as modalidades disponíveis');
  });

  it('pré-seleciona a nuvem com ?modalidade=nuvem e segue para a etapa 2 ao continuar', () => {
    const { botao } = renderizar({ modalidade: 'nuvem' });
    const navegar = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    const continuar = botao('Continuar');
    expect(continuar?.disabled).toBeFalse();
    continuar?.click();
    expect(navegar).toHaveBeenCalledWith('/solicitar/nuvem/dados');
  });
});
