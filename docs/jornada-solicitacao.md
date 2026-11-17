# Jornada de solicitação de certificado

Mapa das telas e de quem decide cada transição. Os códigos são os frames do Figma
(**AR CAIXA → Fluxo V1 (em andamento) → seção 03 — Solicitação guiada de certificado**).
As interrupções 01.E1–01.E4 vêm do fluxo anterior e foram **mantidas por decisão de produto**.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> T: Home ou menu → /solicitar

    T: 03.00 — Triagem (modal)
    M: 03.01 — Escolher modalidade
    MA: 03.01A — Entenda as modalidades
    N1: 03.N1 — Conferir dados (nuvem)
    N2: 03.N2 — Enviada (nuvem)
    P2: 03.02 — Já possui cartão ou token?
    P2A: 03.02A — Estoque da unidade
    P2B: 03.02B — Consulte sua área primeiro
    P2C: 03.02C — Unidade sem mídia
    F4: 03.04 — Conferir dados (mídia física)
    F5: 03.05 — Enviada (mídia física)
    E1: 01.E1 — Não elegível
    E2: 01.E2 — Nuvem já ativa
    E3: 01.E3 — Divergência cadastral
    E4: 01.E4 — SERPRO indisponível

    T --> M: primeiro / revogado / vencido
    T --> [*]: válido e não revogado → só Cancelar ou Meus certificados
    M --> MA: Entender as diferenças
    MA --> M: Voltar à escolha

    M --> N1: Em nuvem
    N1 --> E1: não elegível (guard)
    N1 --> E2: nuvem ativa (guard)

    M --> P2: Em mídia física
    P2 --> F4: cartão ou token
    P2 --> P2A: não tenho
    P2A --> F4: unidade tem mídia
    P2A --> P2C: unidade sem mídia
    P2A --> P2B: ainda não consultei
    P2B --> P2A: Já consultei
    P2B --> M: Rever modalidade
    P2C --> M: Rever modalidade

    state envio <<choice>>
    N1 --> envio: Confirmar
    F4 --> envio: Confirmar
    envio --> N2: registrada (nuvem)
    envio --> F5: registrada (mídia física)
    envio --> E3: divergência
    envio --> E4: indisponível ou erro
    E4 --> N1: Tentar novamente (nuvem, via 03.01)
    E4 --> F4: Tentar novamente (mídia física)

    N2 --> T: Voltar ao início (recomeça)
    F5 --> T: Voltar ao início (recomeça)
```

> "Solicitar primeira mídia" (03.02C) leva a Nova mídia física, ainda "Em construção". "Meus pedidos" (03.N2/03.05)
> leva a Acompanhar solicitações.

## Onde está cada decisão

| Decisão | Código |
|---|---|
| Reiniciar a jornada ao entrar (a triagem reaparece) | `iniciarJornadaResolver` (`guards/jornada.guards.ts`), ADR-14 |
| A triagem permite seguir? | `situacaoPermiteSolicitar()` / `responderTriagem()` (`state/solicitacao-certificado.jornada.ts`) |
| Quais modalidades aparecem em 03.01 | `ElegibilidadeService` (`domain/certificado/`), carregado no bootstrap |
| Próxima tela depois de cada resposta | `escolherModalidade()`, `informarMidiaExistente()`, `informarEstoqueUnidade()` |
| Entrar na conferência em nuvem (01.E1 / 01.E2) | `verificarEntradaNuvem()`, aplicado por `jornadaNuvemGuard` |
| Entrar na conferência de mídia física | `podeConferirMidiaFisica()`, aplicado por `midiaFisicaDefinidaGuard` |
| Próxima tela depois do envio | `confirmar()` |
| Textos das perguntas e orientações | `pages/pergunta/perguntas.ts`, `pages/orientacao/orientacoes.ts` |
| Textos das interrupções | `pages/interrupcao/interrupcoes.ts` |
| Caminhos | `solicitacao-certificado.paths.ts` |

## Rotas

| URL | Tela |
|---|---|
| `/solicitar` | 03.00 (modal) + 03.01 (`?modalidade=nuvem` pré-seleciona a nuvem) |
| `/solicitar/modalidades` | 03.01A |
| `/solicitar/nuvem/dados` · `/solicitar/nuvem/enviada` | 03.N1 · 03.N2 |
| `/solicitar/midia-fisica` | 03.02 |
| `/solicitar/midia-fisica/estoque` | 03.02A |
| `/solicitar/midia-fisica/aguardar-unidade` | 03.02B |
| `/solicitar/midia-fisica/sem-midia` | 03.02C |
| `/solicitar/midia-fisica/dados` · `/solicitar/midia-fisica/enviada` | 03.04 · 03.05 |
| `/solicitar/interrompida/:motivo` | 01.E1–01.E4 (`nao-elegivel`, `certificado-ativo`, `divergencia-cadastral`, `serpro-indisponivel`) |

Para ver cada caminho no navegador, use os cenários simulados do README (`?cenario=`).
