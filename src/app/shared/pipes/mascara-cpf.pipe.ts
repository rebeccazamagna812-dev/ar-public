import { Pipe, PipeTransform } from '@angular/core';

/**
 * Mascara o CPF na exibição, como no Figma: "***.***.***-**".
 * [FIGMA: 01.02 — campo CPF; 01.03 — Resumo] [DOC: RNF01 — não expor dados sensíveis]
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
