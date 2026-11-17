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

## ADR-04 — Organização por camadas e domínio
- **Decisão:**
  - `core/`: infraestrutura transversal e composição da aplicação (auth, http, erros, navegação, providers);
  - `domain/<assunto>/`: modelos, contratos de API e serviços de regra usados por mais de uma feature;
  - `mocks/`: implementações simuladas dos contratos;
  - `layout/` (shell), `shared/` (ui, pipes, estilos de página);
  - `features/<funcionalidade>/`: rotas próprias, lazy loading, estado e páginas. O que só uma feature usa fica nela.
- **Origem:** `[PADRÃO DE MERCADO]` + diretriz do projeto.

## ADR-05 — Estado com signals + fachada da jornada, no escopo da feature
- **Decisão:**
  - `SolicitacaoCertificadoStore` (signals) guarda a situação do certificado anterior (triagem), a modalidade, a mídia física, os dados e a solicitação registrada. Nada é persistido no navegador.
  - `SolicitacaoCertificadoJornada` (fachada) concentra as regras e decide a próxima tela: triagem, escolha da modalidade, perguntas de mídia física, entrada na conferência, carga dos dados e envio. Telas e guards só chamam a fachada; só ela escreve no store.
  - Os dois são fornecidos em `providers` da rota da funcionalidade, não em `root`.
- **Por quê:** os caminhos da seção 03 ("cartão → 03.04", "sem mídia → 03.02C", "sucesso → 03.N2 / 03.05", "divergência → 01.E3"…) ficam num lugar só e são testados sem renderizar componentes.
- **Descartadas:** NgRx (desproporcional ao escopo atual); lógica dentro das páginas e dos guards (versão anterior).
- **Origem:** `[PADRÃO DE MERCADO]`; `[DOC: RNF01]` para não guardar dado sensível.

## ADR-06 — API e autenticação por contrato (classe abstrata) + implementação simulada
- **Contexto:** a documentação não define autenticação, endpoints nem formato de erro.
- **Decisão:** as telas dependem de `SolicitacaoCertificadoApi` e `AutenticacaoService`. Hoje são registradas as implementações *mock* (`src/app/mocks/`), com cenários escolhidos por `?cenario=`. A implementação HTTP entra só em `core/providers/siarx.providers.ts` (`provideImplementacoes`).
- **Origem:** `[PENDENTE]` (Fase 1, itens 2–4); `[PADRÃO DE MERCADO]` para o padrão de troca.

## ADR-07 — Elegibilidade carregada no bootstrap
- **Decisão:** `provideSessaoInicial()` (`provideAppInitializer`) inicia a sessão e carrega a elegibilidade antes da primeira tela. A modalidade inelegível **não é exibida**.
- **Origem:** `[DOC: HU03a RN04/RF04, HU02 CA02, HU03c CA02]`.

## ADR-08 — Guards da jornada
- **Decisão:** os guards (`guards/jornada.guards.ts`) só traduzem decisões da fachada em navegação e não alteram estado:
  - `triagemConcluidaGuard`: telas depois da escolha exigem a triagem 03.00 respondida;
  - `jornadaNuvemGuard` (03.N1): sem elegibilidade → 01.E1; certificado em nuvem ativo → 01.E2. Roda antes da triagem, para a URL direta mostrar 01.E1;
  - `midiaFisicaDefinidaGuard` (03.04): exige a mídia informada em 03.02 ou 03.02A;
  - `solicitacaoRegistradaGuard` (03.N2 / 03.05): exige solicitação registrada.

  O resultado do envio (`confirmar()`) decide entre a tela de enviada, 01.E3 e 01.E4.
- **Origem:** `[FIGMA: seção 03; 01.E1–01.E4 do fluxo anterior]` `[DOC: HU04]`.

## ADR-09 — Solicitação guiada (seção 03 do protótipo)
- **Contexto:** o protótipo substituiu a jornada só de nuvem (seção 01 antiga) pela "03 — Solicitação guiada de certificado": triagem do certificado anterior (03.00), escolha da modalidade (03.01, 03.01A), caminho de nuvem (03.N1 → 03.N2) e de mídia física (03.02 → 03.02A/B/C → 03.04 → 03.05). As telas de etapa ("Etapa N de 3") saíram; só as de enviada têm Progress.
- **Decisão:** implementar a seção 03 inteira, com as decisões de produto abaixo (prevalecem sobre o Figma):
  - **01.E1–01.E4 mantidas**, embora tenham saído do protótipo; E3 e E4 valem para as duas modalidades (`/solicitar/interrompida/:motivo`);
  - **elegibilidade**: a nuvem continua oculta para quem não é elegível; simulação `?cenario=nao-elegivel` (o protótipo sempre mostra as duas);
  - **CPF mascarado** [DOC: RNF01] (o protótipo mostra o CPF completo);
  - **03.00b** (autorização de segundo certificado) **não implementada**: ainda em discussão;
  - **"Voltar ao início"** nas telas de enviada recomeça a solicitação (no protótipo, volta uma tela).
- **Telas reaproveitadas:** uma `Pergunta` (03.02, 03.02A) e uma `Orientacao` (03.02B, 03.02C) guiadas por configuração; `ConferirDados` e `SolicitacaoEnviada` recebem a modalidade pelo `data` da rota.
- **Origem:** `[FIGMA: Fluxo V1 (em andamento) → 03]` + decisões de produto. Diagrama: `docs/jornada-solicitacao.md`.

## ADR-10 — Solicitação registrada só após retorno do SERPRO
- **Decisão:** o front só considera a solicitação criada quando a API retorna a referência. Em indisponibilidade, nada é registrado e o usuário tenta de novo ("Tentar novamente" volta à conferência da modalidade em curso).
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

## ADR-13 — Fronteiras entre camadas verificadas pelo lint
- **Contexto:** sem verificação, features passam a importar umas das outras e `shared/` passa a depender do negócio, o que acopla o código aos poucos.
- **Decisão:** regras `no-restricted-imports` por pasta em `eslint.config.js` (tabela no README → "Fronteiras entre camadas"). Telas genéricas reutilizadas por várias rotas, como o placeholder, ficam em `shared/paginas/`.
- **Descartadas:** `eslint-plugin-boundaries` (dependência extra para um conjunto pequeno de regras); só convenção escrita (não impede regressão).
- **Origem:** `[PADRÃO DE MERCADO]`.

## ADR-14 — Jornada reiniciada ao entrar na funcionalidade
- **Contexto:** o protótipo abre a triagem 03.00 sempre que a pessoa entra em "Solicitar certificado" (Home ou menu), mas não quando volta à escolha de dentro da jornada ("Rever modalidade", "Voltar").
- **Decisão:** `iniciarJornadaResolver`, na rota pai da funcionalidade, chama `reiniciar()` da fachada. Resolvers da rota pai só rodam ao entrar na funcionalidade, não ao navegar entre as telas filhas. "Voltar ao início" (telas de enviada) reinicia explicitamente.
- **Exceção registrada:** é o único ponto de rota que altera estado (ver ADR-08).
- **Descartadas:** reiniciar no `ngOnInit` da escolha (reabriria a triagem a cada "Voltar"); estado no componente (os guards não o enxergariam).
- **Origem:** `[FIGMA: interações do protótipo — Home/menu → 03.00; "Rever modalidade" → 03.01]`.
