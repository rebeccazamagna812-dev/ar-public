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
| Home: 9 cards (ordem em `home.ordem`) e 2 alertas | `features/home/*`, `navegacao.ts` | `[FIGMA: 01.00 — Home]` |
| Card de acesso (local) | `shared/ui/card-acesso/card-acesso.ts` | `[FIGMA: AR-CAIXA / Card de acesso]` |
| Triagem do certificado anterior (modal); "válido e não revogado" bloqueia | `pages/escolher-modalidade/*`, `solicitacao-certificado.jornada.ts` | `[FIGMA: 03.00]` |
| Jornada reiniciada ao entrar (triagem reaparece) | `guards/jornada.guards.ts` (`iniciarJornadaResolver`) | `[FIGMA: interações Home/menu → 03.00]` ADR-14 |
| Escolher modalidade, "Continuar" desabilitado sem seleção | `pages/escolher-modalidade/*` | `[FIGMA: 03.01]` |
| Ocultar modalidade inelegível (simulação `?cenario=nao-elegivel`) | `escolher-modalidade.ts` | `[DOC: HU02 CA02, HU03a CA02, HU03c CA02]` + decisão de produto |
| Entenda as modalidades | `pages/entender-modalidades/*` | `[FIGMA: 03.01A]` |
| Elegibilidade no login | `core/providers/siarx.providers.ts`, `domain/certificado/elegibilidade.service.ts` | `[DOC: HU03a RN04/RF04]` |
| Mídia física: já possui cartão/token? estoque da unidade | `pages/pergunta/*` | `[FIGMA: 03.02, 03.02A]` |
| Mídia física: aguardar consulta / unidade sem mídia | `pages/orientacao/*` | `[FIGMA: 03.02B, 03.02C]` |
| Conferir dados (nuvem e mídia física), somente leitura | `pages/conferir-dados/*` | `[FIGMA: 03.N1, 03.04]` `[DOC: HU05]` |
| CPF mascarado (o protótipo mostra completo) | `shared/pipes/mascara-cpf.pipe.ts` | `[DOC: RNF01]` + decisão de produto |
| Envio ao SERPRO com modalidade e mídia; registro só após retorno | `domain/certificado/*`, `mocks/*`, `solicitacao-certificado.jornada.ts` | `[FIGMA: 03.N1 → 03.N2, 03.04 → 03.05]` ADR-10 |
| Solicitação enviada (lista de orientações, "Meus pedidos") | `pages/solicitacao-enviada/*` | `[FIGMA: 03.N2, 03.05]` |
| "Voltar ao início" recomeça a solicitação | `solicitacao-enviada.ts` | decisão de produto |
| Não elegível | `pages/interrupcao/interrupcoes.ts`, guard | `[FIGMA (fluxo anterior): 01.E1]` — mantida por decisão de produto |
| Certificado em nuvem ativo | `interrupcoes.ts`, guard | `[FIGMA (fluxo anterior): 01.E2]` `[DOC: HU04]` — mantida |
| Divergência cadastral CAIXA × SERPRO (nuvem e mídia física) | `interrupcoes.ts` | `[FIGMA (fluxo anterior): 01.E3]` — mantida |
| SERPRO indisponível / Tentar novamente (volta à conferência da modalidade) | `interrupcoes.ts`, `interrupcao.ts` | `[FIGMA (fluxo anterior): 01.E4]` — mantida |
| Destinos dos botões | páginas da jornada, `perguntas.ts`, `orientacoes.ts` | `[FIGMA: interações do protótipo]` |
| Sem dados sensíveis em log | `core/erros/*`, `core/http/*` | `[DOC: RNF01]` |
| Locale pt-BR | `app.config.ts` | diretriz do projeto |
| Título da aba, foco na navegação, skip link | `core/navegacao/siarx-title-strategy.ts`, `shell.*` | `[PADRÃO DE MERCADO]` |
| Placeholders das demais funcionalidades | `navegacao.ts` (`emConstrucao`, `PAGINAS_FORA_DO_MENU`) → `app.routes.ts`, `shared/paginas/placeholder` | `[FIGMA: 01.01, 02, 04–06, 08–11]` |
| Página não encontrada | `features/nao-encontrado` | `[PADRÃO DE MERCADO]` |
| Erro ao carregar dados / elegibilidade | `conferir-dados.html`, `escolher-modalidade.html` | `[PADRÃO DE MERCADO]` (sem tela no Figma) |

## Componentes criados localmente (fora do DSC)

| Componente | Por quê |
|---|---|
| `shared/ui/card-acesso` | No Figma é um componente local do arquivo do projeto ("AR-CAIXA / Card de acesso"), não da biblioteca DSC |
| `shared/ui/opcoes-radio` | Composição repetida em 4 telas da seção 03 ([dsc] Card radio button + [dsc] Radio + [dsc] Text), sem componente próprio no DSC |
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
| P5 | ~~Mídia física navegava direto para 02.01~~ — resolvida: a seção 03 tem o caminho de mídia física | — |
| P6 | ~~Duplicidade informada pelo SERPRO (03.E1 antiga)~~ — a tela não existe na seção 03 atual | — |
| P7 | Comportamento quando a avaliação de elegibilidade falha (HU03a MN01) | Hoje mostra um alerta genérico |
| P8 | Solicitação em nuvem já em andamento (aguardando ativação): bloquear nova tentativa? (HU06) | Regra no guard |
| P9 | Modais "Saiba mais" da Home (01.00.A1/A2) | Hoje levam a placeholders |
| P10 | Filtro de menu e Home por perfil (Gestor, Agente, Auditor, Admin, Autorizador) | Hoje todos veem tudo, como no Figma |
| P11 | Norma e nível de acessibilidade (eMAG / WCAG) | Critério de aceite |
| P12 | Ilustrações oficiais e fonte CAIXA Std | Vêm com a biblioteca oficial |
| P13 | 03.00b — autorização de segundo certificado (origem da informação e prazo "XX horas") | Tela não implementada: em discussão |
| P14 | A resposta da triagem (situação do certificado anterior) vai no pedido ao backend? | `PedidoCertificado` |
| P15 | URL do Portal IntegraMais (sublinhado em 03.N1/03.04) | Hoje é texto, sem link |
| P16 | O protótipo renomeou o item do menu e o card da Home "Acompanhar solicitações" para "Meus pedidos" | Não alterado nesta entrega (fora das telas da seção 03); confirmar |
| P17 | "Solicitar primeira mídia" (03.02C) leva a 02.M1 no protótipo | Hoje leva a Nova mídia física, ainda "Em construção" |
