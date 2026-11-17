# Jornada de solicitação de certificado em nuvem

Mapa das telas e de quem decide cada transição. Os códigos são os frames do Figma
(**AR CAIXA → Fluxo V1 (em andamento) 2 → seção 01**).

```mermaid
stateDiagram-v2
    direction LR
    [*] --> E101: /solicitar

    E101: 01.01 / 01.01A — Escolher modalidade
    E102: 01.02 — Confira seus dados
    E104: 01.04 — Solicitação enviada
    E1: 01.E1 — Não elegível
    E2: 01.E2 — Certificado em nuvem ativo
    E3: 01.E3 — Divergência cadastral
    E4: 01.E4 — SERPRO indisponível
    MF: Mídia física (Em construção)

    E101 --> E102: Continuar (nuvem)
    E101 --> MF: Continuar (mídia física)

    state guard <<choice>>
    E102 --> guard: verificarEntradaNuvem()
    guard --> E1: não elegível
    guard --> E2: já tem certificado ativo
    guard --> E101: falha na consulta

    state envio <<choice>>
    E102 --> envio: Confirmar solicitação → confirmar()
    envio --> E104: registrada
    envio --> E3: divergência
    envio --> E4: indisponível ou erro técnico

    E102 --> E101: Voltar (nuvem pré-selecionada)
    E1 --> E101
    E2 --> E101
    E3 --> E101
    E4 --> E101: Tentar novamente (nuvem pré-selecionada)
    E104 --> E101: Voltar ao início
```

> O guard roda **antes** de abrir 01.02; o diagrama o mostra saindo de 01.02 só para simplificar.

## Onde está cada decisão

| Decisão | Código |
|---|---|
| Quais modalidades aparecem na etapa 1 | `ElegibilidadeService` (`domain/certificado/`), carregado no bootstrap por `provideSessaoInicial()` |
| Entrar ou não na etapa 2 (01.E1 / 01.E2) | `SolicitacaoNuvemJornada.verificarEntradaNuvem()`, aplicado por `jornadaNuvemGuard` |
| Próxima tela depois do envio (01.04 / 01.E3 / 01.E4) | `SolicitacaoNuvemJornada.confirmar()` |
| Só abrir 01.04 com solicitação registrada | `solicitacaoRegistradaGuard` |
| Conteúdo de cada interrupção (textos, etapa, botão) | `pages/interrupcao/interrupcoes.ts` |
| Caminhos e etapas do [dsc] Progress | `solicitacao-certificado.paths.ts`, `solicitacao-certificado.etapas.ts` |

## Rotas

| URL | Tela |
|---|---|
| `/solicitar` | 01.01 / 01.01A (`?modalidade=nuvem` pré-seleciona a nuvem) |
| `/solicitar/nuvem/dados` | 01.02 |
| `/solicitar/nuvem/enviada` | 01.04 |
| `/solicitar/nuvem/interrompida/:motivo` | 01.E1–01.E4 (`nao-elegivel`, `certificado-ativo`, `divergencia-cadastral`, `serpro-indisponivel`) |
| `/solicitar/midia-fisica` | Em construção (seção 02) |

Para ver cada caminho no navegador, use os cenários simulados do README (`?cenario=`).
