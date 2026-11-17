import { MascaraCpfPipe } from './mascara-cpf.pipe';

describe('MascaraCpfPipe', () => {
  const pipe = new MascaraCpfPipe();

  it('mascara todos os dígitos no formato do Figma', () => {
    expect(pipe.transform('12345678910')).toBe('***.***.***-**');
  });

  it('retorna vazio para valor ausente', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
