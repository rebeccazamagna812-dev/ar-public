import { Pipe, PipeTransform } from '@angular/core';

/**
 * Mascara o CPF na exibição, como no Figma: "***.***.***-**".
 * [FIGMA (fluxo anterior): 01.02 — campo CPF; o protótipo atual (03.N1/03.04) mostra o CPF completo, mas a máscara foi mantida por decisão de produto] [DOC: RNF01 — não expor dados sensíveis]
 */
@Pipe({ name: 'mascaraCpf' })
export class MascaraCpfPipe implements PipeTransform {
  transform(cpf: string | null | undefined): string {
    if (!cpf) {
      return '';
    }
    return cpf.replace(/\d/g, '*').replace(/^(\*{3})(\*{3})(\*{3})(\*{2})$/, '$1.$2.$3-$4');
  }
}
