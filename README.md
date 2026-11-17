# SIARX — Front-end (Angular 20)

Sistema de certificação digital da CAIXA (nuvem e mídia física), integrado ao SERPRO.
Esta entrega traz **a fundação do projeto e a solicitação guiada de certificado (nuvem e mídia física)**.
As demais funcionalidades do menu aparecem como telas "Em construção".

> Fonte de verdade visual: Figma **AR CAIXA (interprise) → página "Fluxo V1 (em andamento)"**.
> Regra do projeto: quando Figma e documentação divergem, **vale o Figma** (ele é o usado no refinamento).

---

## Como rodar

Pré-requisitos: Node.js 20.19+ (ou 22.12+) e acesso ao registro npm.

```bash
npm install
npm start            # http://localhost:4200
npm run build        # build de produção em dist/
npm test             # testes unitários (Karma + Jasmine)
npm run lint         # ESLint (angular-eslint)
npm run format       # Prettier
```

### Ver cada tela da jornada

A API e o login são **simulados** (`environment.usarApiSimulada = true`). Escolha o cenário pela URL:

| URL | O que acontece |
|---|---|
| `/solicitar` | Elegível às duas modalidades. Triagem (03.00) → escolha (03.01) → nuvem (03.N1 → 03.N2) ou mídia física (03.02 → … → 03.04 → 03.05) |
| `/solicitar?cenario=nao-elegivel` | Não elegível à nuvem: só aparece mídia física em 03.01. Acessar `/solicitar/nuvem/dados` mostra 01.E1 |
| `/solicitar?cenario=certificado-ativo` | Ao continuar com nuvem → 01.E2 |
| `/solicitar?cenario=divergencia-cadastral` | Ao confirmar (nuvem ou mídia física) → 01.E3 |
| `/solicitar?cenario=serpro-indisponivel` | Ao confirmar (nuvem ou mídia física) → 01.E4 |

Mapa completo da jornada: [`docs/jornada-solicitacao.md`](docs/jornada-solicitacao.md).

---

## Estrutura de pastas

```
siarx-front/
├─ projects/dsc-web-local/          Cópia local do Super DSC | Web (alias @dsc/web)
│  ├─ styles/                       tokens.css (--dsc-*), typography.css, dsc-web.css
│  └─ src/lib/                      um componente por pasta, com o mesmo nome do Figma
├─ src/
│  ├─ environments/                 environment.ts / environment.development.ts
│  ├─ styles.css                    estilos globais mínimos (só tokens)
│  └─ app/
│     ├─ app.ts · app.config.ts · app.routes.ts
│     ├─ core/                      infraestrutura transversal: auth (contrato), http (interceptor), erros,
│     │                             navegação (menu/Home/rotas futuras), providers (troca mock ↔ real)
│     ├─ domain/certificado/        modelos, contrato da API e elegibilidade, usados por mais de uma feature
│     ├─ mocks/                     API e autenticação simuladas (cenários por ?cenario=)
│     ├─ layout/shell/              Header + Menu lateral + Conta + Conteúdo + Footer
│     ├─ shared/                    ui/card-acesso (componente local), paginas/placeholder, pipes,
│     │                             styles/pagina.css (global)
│     └─ features/
│        ├─ home/                   00.01 — Home
│        ├─ solicitacao-certificado/  solicitação guiada (rotas, paths, guards, store + fachada, páginas)
│        └─ nao-encontrado/
└─ docs/
   ├─ arquitetura.md                ADRs
   ├─ jornada-solicitacao.md        diagrama de estados da jornada e onde fica cada decisão
   ├─ nova-funcionalidade.md        roteiro para implementar uma funcionalidade "Em construção"
   └─ rastreabilidade.md            matriz Item | Arquivo | Origem + pendências
```

Aliases (`tsconfig.json`): `@core/*`, `@domain/*`, `@mocks/*`, `@shared/*`, `@layout/*`, `@features/*`, `@env/*`, `@dsc/web`.

---

## Convenções

- Angular 20: componentes **standalone**, `OnPush`, `inject()`, signals (`input()`, `output()`, `computed`, `linkedSignal`),
  control flow novo (`@if`, `@for`, `@switch`, `@let`), guards e interceptors funcionais, lazy loading por rota.
- Nomes de arquivo no estilo do Angular 20 (`home.ts`, classe `Home`), sem o sufixo `.component`.
- Código em inglês onde é convenção do framework. Domínio, comentários e textos em **pt-BR**.
- Toda decisão relevante tem origem anotada no código: `[FIGMA: …]`, `[DOC: …]`, `[PADRÃO DE MERCADO]` ou `[PENDENTE]`.
- Nenhuma cor, fonte ou espaçamento fixo: só `var(--dsc-*)`.
- Toda página roteada declara `host: { class: 'pagina' }` e usa as classes `pagina__*` (`titulo`, `subtitulo`,
  `cabecalho`, `feedback`, `orientacoes`, `acoes`), definidas em `shared/styles/pagina.css`, que é global.

### Nomes de arquivo

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente / página | `<nome>.ts` (+ `.html`, `.css`), classe sem sufixo | `conferir-dados.ts` → `ConferirDados` |
| Contrato de API | `<assunto>.api.ts` (classe abstrata) | `solicitacao-certificado.api.ts` |
| Implementação simulada | `<nome>.mock.ts`, em `src/app/mocks/` | `solicitacao-certificado-api.mock.ts` |
| Serviço | `<nome>.service.ts` | `elegibilidade.service.ts` |
| Estado / fachada de feature | `<nome>.store.ts` / `<nome>.jornada.ts` | `solicitacao-certificado.store.ts` |
| Guard / interceptor / pipe | `<nome>.guard.ts` / `<nome>.interceptor.ts` / `<nome>.pipe.ts` | `jornada.guards.ts` |
| Rotas, caminhos e etapas de feature | `<feature>.routes.ts` / `<feature>.paths.ts` / `<feature>.etapas.ts` | `solicitacao-certificado.paths.ts` |
| Teste | ao lado do arquivo, `<arquivo>.spec.ts` | `solicitacao-certificado.jornada.spec.ts` |

### Idioma
- Domínio, telas, métodos de negócio, comentários e textos: **pt-BR** (`ConferirDados`, `confirmar()`, `ElegibilidadeService`).
- Termos técnicos do framework ou de arquitetura ficam em inglês, como sufixo ou nome genérico:
  `Store`, `Api`, `Guard`, `Service`, `Shell`, `Home`, `routes`, `providers`.

### Fronteiras entre camadas (verificadas pelo `npm run lint`, ADR-13)

| Camada | Pode importar | Não pode importar |
|---|---|---|
| `domain/` | só a si mesma | `core`, `features`, `layout`, `shared`, `mocks` |
| `shared/` | `@dsc/web` | `core`, `domain`, `features`, `layout`, `mocks` |
| `core/` | `domain`, `mocks` (só em `providers/`) | `features`, `layout`, `shared` |
| `mocks/` | `core`, `domain` | `features`, `layout`, `shared` |
| `layout/` | `core`, `shared` | `features`, `mocks` |
| `features/<x>/` | `core`, `domain`, `shared`; a própria feature por import relativo | outra feature, `mocks`, `layout`, `@core/providers` |
| todas | `@dsc/web` | caminho direto para `projects/dsc-web-local` |

## Como usar os tokens

```css
.minha-area {
  padding: var(--dsc-spacing-tiny);              /* 16px */
  border-radius: var(--dsc-border-radius-large); /* 16px */
  background: var(--dsc-color-neutral-bg-1);
  color: var(--dsc-color-on-neutral-1);
  font-family: var(--dsc-font-family-2);
}
```

- Os nomes seguem exatamente o **Code Syntax WEB** das variáveis do Figma "Super DSC | Web".
- Estilos de texto prontos: classes `dsc-typography-<grupo>-<nome>` (ex.: `dsc-typography-title-large-semibold`).
- Tema escuro: os valores do modo Dark estão em `.dsc-theme-dark`.
- Breakpoints (coleção `responsive` do DSC): extra large ≥1440, large ≥1024, medium ≥768, small ≥480, extra small ≥360.
  Media queries não aceitam `var()`, então os valores aparecem literais nos `@media`, sempre com o nome do breakpoint comentado.

---

## Troca pela biblioteca oficial do Super DSC

A biblioteca oficial só é acessível pela intranet. Para trocar:

1. Instale o pacote do Super DSC Web Angular (nome e registry com o **canal "Dúvidas de Dev" do Time do DSC**).
2. Em `tsconfig.json`, remova o alias `"@dsc/web"`, **ou** aponte-o para o pacote oficial.
3. Em `angular.json → styles`, troque `projects/dsc-web-local/styles/dsc-web.css` pelo CSS global do pacote (tokens, fontes CAIXA Std e Roboto, ícones).
4. Ajuste os imports e seletores que forem diferentes. A cópia local usa os nomes do Figma
   (`DscButton`/`dscButton`, `DscCardAlert`/`dsc-card-alert`, `appearance` = propriedade "type" do Figma).
   **A API real dos componentes oficiais não pôde ser consultada**, então inputs e seletores podem precisar de ajuste nos templates.
5. Apague `projects/dsc-web-local/`.

Componentes da cópia local: Icon, Brand Symbol, Button, Icon Button, Progress, Card Alert, Card (+ Header/Body),
Separator, Radio, Text Field Form, Label Value Pair, Illustration, State Message, Header, Footer, Account Select,
Dropdown (+ Item), Sidebar Menu (+ Item), Title Bar, Modal, List Item.

> As **ilustrações** (Success/Warning/Error) são imagens no DSC. Na cópia local foram redesenhadas em SVG, de forma aproximada.
> A fonte **CAIXA Std** não está incluída; sem ela, o navegador usa Roboto/Arial.
