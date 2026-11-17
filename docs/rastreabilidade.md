# Rastreabilidade, componentes locais e pendências

## Matriz de rastreabilidade

| Item | Arquivo | Origem |
|---|---|---|
| Angular 20 + Super DSC Web | `package.json`, `docs/arquitetura.md` ADR-01 | `[FIGMA: Super DSC → Compatibilidade]` + decisão da usuária |
| Tokens de cor, espaçamento, raio, borda, tipografia, ícone, sombra (Light/Dark) | `projects/dsc-web-local/styles/tokens.css` | `[FIGMA: Super DSC → coleção dsc]` |
| Estilos de texto | `projects/dsc-web-local/styles/typography.css` | `[FIGMA: Super DSC → typography/*]` |
| Breakpoints e containers | `tokens.css`, `@media` dos componentes | `[FIGMA: Super DSC → coleção responsive]` |
| Componentes visuais (cópia) | `projects/dsc-web-local/src/lib/*` | `[FIGMA: Super DSC → componentes [dsc]]` |
| Ícones | `projects/dsc-web-local/src/lib/icon/icons.ts` | `[FIGMA: AR CAIXA → instâncias de ícones]` |
| Header (sigla, nome, Dúvidas frequentes, conta) | `layout/shell/shell.html` | `[FIGMA: [dsc] Header nas telas]` |
| Menu lateral (10 itens, ícones) | `core/navegacao/navegacao.ts`, `shell.html` | `[FIGMA: OV — Menu lateral]` |
| Menu da conta ("Sair") | `shell.html` | `[FIGMA: OV — Conta do usuário]` |
| Área de conteúdo (1248 px, padding 24, gap 20) | `shell.css`, `shared/styles/pagina.css` | `[FIGMA: frame Conteúdo]` |
| Footer | `shell.html`, `environments/*` | `[FIGMA: [dsc] Footer]` |
| Home: 9 cards (ordem em `home.ordem`) e 2 alertas | `features/home/*`, `navegacao.ts` | `[FIGMA: 00.01 — Home]` |
| Card de acesso (local) | `shared/ui/card-acesso/card-acesso.ts` | `[FIGMA: AR-CAIXA / Card de acesso]` |
| Etapa 1: escolher modalidade, Continuar desabilitado sem seleção | `pages/escolher-modalidade/*` | `[FIGMA: 01.01, 01.01A]` |
| Ocultar modalidade inelegível | `escolher-modalidade.html` | `[DOC: HU02 CA02, HU03a CA02, HU03c CA02]` |
| Elegibilidade no login | `core/providers/siarx.providers.ts`, `domain/certificado/elegibilidade.service.ts` | `[DOC: HU03a RN04/RF04]` |
| Etapa 2: dados IntegraMais somente leitura | `pages/conferir-dados/*` | `[FIGMA: 01.02]` `[DOC: HU05]` |
| CPF mascarado | `shared/pipes/mascara-cpf.pipe.ts` | `[FIGMA: 01.02]` `[DOC: RNF01]` |
| Envio ao SERPRO; registro só após retorno | `domain/certificado/*`, `mocks/*`, `solicitacao-nuvem.jornada.ts` | `[FIGMA: 01.03 texto, 01.E4]` |
| Solicitação enviada + próximo passo (e-mail) | `pages/solicitacao-enviada/*` | `[FIGMA: 01.04]` |
| Não elegível | `pages/interrupcao/interrupcoes.ts`, guard | `[FIGMA: 01.E1]` |
| Certificado em nuvem ativo | `interrupcoes.ts`, guard | `[FIGMA: 01.E2]` `[DOC: HU04]` |
| Divergência cadastral CAIXA × SERPRO | `interrupcoes.ts` | `[FIGMA: 01.E3]` |
| SERPRO indisponível / Tentar novamente | `interrupcoes.ts` | `[FIGMA: 01.E4]` |
| Destinos dos botões | páginas da jornada | `[FIGMA: interações do protótipo]` |
| Sem tela 01.03 | `solicitacao-certificado.routes.ts` | `[FIGMA: 01.03 com opacidade 0.12]` |
| Sem dados sensíveis em log | `core/erros/*`, `core/http/*` | `[DOC: RNF01]` |
| Locale pt-BR | `app.config.ts` | diretriz do projeto |
| Título da aba, foco na navegação, skip link | `core/navegacao/siarx-title-strategy.ts`, `shell.*` | `[PADRÃO DE MERCADO]` |
| Placeholders das demais funcionalidades | `navegacao.ts` (`emConstrucao`, `PAGINAS_FORA_DO_MENU`) → `app.routes.ts`, `shared/paginas/placeholder` | `[FIGMA: seções 00.02, 04–10]` |
| Página não encontrada | `features/nao-encontrado` | `[PADRÃO DE MERCADO]` |
| Erro ao carregar dados / elegibilidade | `conferir-dados.html`, `escolher-modalidade.html` | `[PADRÃO DE MERCADO]` (sem tela no Figma) |

## Componentes criados localmente (fora do DSC)

| Componente | Por quê |
|---|---|
| `shared/ui/card-acesso` | No Figma é um componente local do arquivo do projeto ("AR-CAIXA / Card de acesso"), não da biblioteca DSC |
| Divisor vertical do header (dentro de `dsc-header`) | Componente local do Figma ("AR-CAIXA / Divisor vertical do header — 32 px"), incluído no Header para reproduzir a tela |
| Caixa "Orientações" (`.pagina__orientacoes`) | Composição local das telas 01.E1–E4 (frame com fundo neutralBg2), não é componente do DSC |
| **Toda a pasta `projects/dsc-web-local`** | Cópia provisória do Super DSC, porque a biblioteca só é acessível na intranet |

## Ajustes de texto feitos sobre o Figma
- 01.04: "Solicitação de certificado em nuvem **enviado**" → "**enviada**" (concordância).
- 01.01: "**Escolhe** entre certificado…" → "**Escolha** entre certificado…".
- 01.01: o rótulo do card mudava entre 01.01 ("Certificado para mídia física") e 01.01A ("Mídia física"). Ficou "Certificado para mídia física".

## Pendências abertas

| # | Pendência | Impacto |
|---|---|---|
| P1 | Pacote npm, versão e registry do Super DSC Web Angular; API real dos componentes | Troca da cópia local |
| P2 | Autenticação (SSO/OIDC?), provedor, origem dos perfis, timeout | `AutenticacaoService` real |
| P3 | Contrato da API: endpoints, erros, paginação; ambientes e URLs | Implementação HTTP e `environment` |
| P4 | 01.E1 tem dois botões "Voltar" iguais (outline e plain) | UX: definir a ação principal |
| P5 | Selecionar "mídia física" no protótipo navega direto para 02.01. Aqui, a navegação só acontece no "Continuar" (por acessibilidade do rádio) | Confirmar com UX |
| P6 | Duplicidade informada pelo SERPRO (03.E1): os rótulos dos botões não puderam ser lidos; tela não implementada | Completar com o Figma |
| P7 | Comportamento quando a avaliação de elegibilidade falha (HU03a MN01) | Hoje mostra um alerta genérico |
| P8 | Solicitação em nuvem já em andamento (aguardando ativação): bloquear nova tentativa? (HU06) | Regra no guard |
| P9 | Modais "Saiba mais" da Home (00.01.A1/A2) | Hoje levam a placeholders |
| P10 | Filtro de menu e Home por perfil (Gestor, Agente, Auditor, Admin, Autorizador) | Hoje todos veem tudo, como no Figma |
| P11 | Norma e nível de acessibilidade (eMAG / WCAG) | Critério de aceite |
| P12 | Ilustrações oficiais e fonte CAIXA Std | Vêm com a biblioteca oficial |
