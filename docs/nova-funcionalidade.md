# Como adicionar uma nova funcionalidade

Roteiro para tirar uma funcionalidade do estado "Em construção". Exemplo: **Meus certificados** (`/meus-certificados`).

## 1. Navegação
Em `src/app/core/navegacao/navegacao.ts`, no item da funcionalidade:
- **remova** `emConstrucao`. A rota placeholder deixa de ser gerada.
- mantenha `rota`, `rotuloMenu`, `icone` e `home` (menu lateral e card da Home continuam iguais).

Funcionalidade nova, que ainda não está no menu: crie o item, com `home.ordem` se ela tiver card na Home.

## 2. Pasta da feature
```
src/app/features/meus-certificados/
├─ meus-certificados.routes.ts     rotas da feature (lazy)
├─ meus-certificados.paths.ts      segmentos e URLs (se houver mais de uma tela)
├─ state/                          store (signals) + fachada, se houver estado entre telas
├─ guards/                         só traduzem decisões da fachada em navegação
└─ pages/<tela>/<tela>.ts|html|css páginas
```
- Toda página declara `changeDetection: OnPush` e `host: { class: 'pagina' }` e usa as classes `pagina__*`.
- Store e fachada são `@Injectable()` sem `providedIn` e ficam em `providers` da rota pai da feature
  (veja `solicitacao-certificado.routes.ts`).
- Dentro da feature, use imports relativos. O lint bloqueia importar outra feature, `mocks/` e `layout/`.

## 3. Rota
Em `src/app/app.routes.ts`, dentro dos filhos do `Shell`:
```ts
{
  path: 'meus-certificados',
  loadChildren: () => import('@features/meus-certificados/meus-certificados.routes').then((m) => m.MEUS_CERTIFICADOS_ROUTES),
},
```

## 4. Dados do backend
- Modelos e contrato usados por **mais de uma** feature: `src/app/domain/<assunto>/` (classe abstrata `<assunto>.api.ts`).
  Usados só por esta feature: dentro dela.
- Implementação simulada: `src/app/mocks/<nome>.mock.ts`, com cenários em `cenario-simulado.ts` se precisar.
- Registre a implementação em `provideImplementacoes()` (`src/app/core/providers/siarx.providers.ts`).
  As telas dependem só do contrato.

## 5. Testes
- Fachada: um teste por decisão de negócio (veja `solicitacao-nuvem.jornada.spec.ts`).
- Página: regras visíveis, como o que aparece, o que fica desabilitado e para onde navega (veja `escolher-modalidade.spec.ts`).

## 6. Rastreabilidade
- Anote a origem das decisões no código: `[FIGMA: …]`, `[DOC: …]`, `[PADRÃO DE MERCADO]` ou `[PENDENTE]`.
- Acrescente as linhas da funcionalidade em `docs/rastreabilidade.md`.

## Checklist antes do PR
```bash
npm run lint
```
```bash
npm test
```
```bash
npm run build
```
