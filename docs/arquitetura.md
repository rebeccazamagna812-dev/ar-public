# Arquitetura — ADRs

Formato curto: contexto · decisão · alternativas descartadas · origem.

## ADR-01 — Angular 20 (e não 19)
- **Contexto:** o Figma usa os componentes da biblioteca **Super DSC | Web**. A tabela de compatibilidade do DSC diz: Super DSC Web = Angular v20; Angular v19 só com as bibliotecas legadas (Web Angular/React + Fundamentos Visuais), que têm prazo de descontinuação.
- **Decisão:** Angular 20.3, aprovado pela usuária.
- **Descartadas:** Angular 19 + biblioteca legada (visual diferente do Figma e descontinuação); Angular 19 + componentes recriados.
- **Origem:** `[FIGMA: Super DSC | Web → Instruções → Compatibilidade]`.

## ADR-02 — Cópia local do Super DSC com alias `@dsc/web`
- **Contexto:** a biblioteca oficial só é acessível pela intranet.
- **Decisão:** a pasta `projects/dsc-web-local` reproduz os componentes e tokens usados, com os mesmos nomes do Figma. A aplicação importa só de `@dsc/web`. A troca pela oficial é feita no alias e no CSS global (README).
- **Descartadas:** HTML/CSS solto nas telas (não permite trocar só o apontamento).
- **Origem:** pedido da usuária; `[FIGMA: Super DSC | Web]`.
- **Risco:** a API dos componentes oficiais (inputs e seletores) não foi consultada; pode exigir ajuste nos templates.

## ADR-03 — Tokens como CSS custom properties com o Code Syntax do Figma
- **Decisão:** `tokens.css` com os tokens da coleção `dsc` (modos Light e Dark), exceto os de gráfico e a escala de cinza, com os nomes exatos do Code Syntax WEB (`--dsc-color-highlight`, `--dsc-spacing-tiny`…). Estilos de texto viram classes `dsc-typography-*`.
- **Origem:** `[FIGMA: Super DSC | Web → coleção "dsc", estilos "typography/*", "Shadows | Elevations"]`.

## ADR-04 — Organização por domínio
- **Decisão:** `core/` (singletons, contratos, guards globais, erros), `layout/` (shell), `shared/` (ui, pipes, estilos de página), `features/<funcionalidade>/` com rotas próprias e lazy loading.
- **Origem:** `[PADRÃO DE MERCADO]` + diretriz do projeto.

## ADR-05 — Estado com signals + fachada da jornada, no escopo da feature
- **Decisão:**
  - `SolicitacaoNuvemStore` (signals) guarda os dados e a solicitação registrada durante a jornada. Nada é persistido no navegador.
  - `SolicitacaoNuvemJornada` (fachada) concentra as regras e decide a próxima tela: entrada na etapa 2, carga dos dados e envio. Telas e guards só chamam a fachada; só ela escreve no store.
  - Os dois são fornecidos em `providers` da rota da funcionalidade, não em `root`.
- **Por quê:** a regra "sucesso → 01.04, divergência → 01.E3, falha → 01.E4" fica num lugar só e é testada sem renderizar componentes.
- **Descartadas:** NgRx (desproporcional ao escopo atual); lógica dentro das páginas e dos guards (versão anterior).
- **Origem:** `[PADRÃO DE MERCADO]`; `[DOC: RNF01]` para não guardar dado sensível.

## ADR-06 — API e autenticação por contrato (classe abstrata) + implementação simulada
- **Contexto:** a documentação não define autenticação, endpoints nem formato de erro.
- **Decisão:** as telas dependem de `SolicitacaoCertificadoApi` e `AutenticacaoService`. Hoje são registradas as implementações *mock*, com cenários escolhidos por `?cenario=`. A implementação HTTP entra só em `app.config.ts`.
- **Origem:** `[PENDENTE]` (Fase 1, itens 2–4); `[PADRÃO DE MERCADO]` para o padrão de troca.

## ADR-07 — Elegibilidade carregada no bootstrap
- **Decisão:** `provideAppInitializer` inicia a sessão e carrega a elegibilidade antes da primeira tela. A modalidade inelegível **não é exibida**.
- **Origem:** `[DOC: HU03a RN04/RF04, HU02 CA02, HU03c CA02]`.

## ADR-08 — Guards da jornada
- **Decisão:** `jornadaNuvemGuard` na etapa 2 delega a `SolicitacaoNuvemJornada.verificarEntradaNuvem()`:
  - sem elegibilidade → 01.E1;
  - certificado em nuvem ativo → 01.E2.

  Guards não alteram estado. O resultado do envio (`SolicitacaoNuvemJornada.confirmar()`) decide entre 01.04, 01.E3 e 01.E4. `solicitacaoRegistradaGuard` protege 01.04.
- **Origem:** `[FIGMA: 01.E1–01.E4]` `[DOC: HU04]`.

## ADR-09 — Fluxo em 2 telas + envio (sem a 01.03)
- **Contexto:**
  - o frame 01.03 (Revisar e confirmar) está com opacidade de 12% no Figma;
  - no protótipo, "Confirmar solicitação" vai de 01.02 direto para 01.04;
  - a barra mostra "Etapa 3 de 3" só na falha de envio (01.E4).
- **Decisão:** 01.02 confirma e envia. A 01.03 não foi implementada.
- **Origem:** `[FIGMA: 01.03 opacidade 0.12; interações do protótipo]`. Regra "Figma prevalece".

## ADR-10 — Solicitação registrada só após retorno do SERPRO
- **Decisão:** o front só considera a solicitação criada quando a API retorna a referência. Em indisponibilidade, nada é registrado e o usuário tenta de novo.
- **Origem:** `[FIGMA: 01.03 "Antes de confirmar", 01.E4]`. Prevalece sobre `[DOC: HU08 RF05, HU09]`.

## ADR-11 — Change detection
- **Decisão:** zone.js (`provideZoneChangeDetection`) + `OnPush` em todos os componentes. O código usa signals e funciona também sem zone (foi validado assim na prévia).
- **Origem:** diretriz do projeto (não habilitar zoneless sem pedido da documentação).

## ADR-12 — Acessibilidade
- **Decisão:**
  - HTML semântico, com `main` e `nav`;
  - link "Pular para o conteúdo";
  - foco levado ao conteúdo a cada navegação;
  - `aria-expanded` e `aria-controls` no menu e na conta, e Esc fecha os painéis;
  - rádios nativos;
  - `role=progressbar` com valores;
  - foco visível com o token de foco do DSC;
  - regras de acessibilidade do angular-eslint.
- **Origem:** `[DOC: RNF04]` (norma e nível `[PENDENTE]`); `[PADRÃO DE MERCADO]`.
