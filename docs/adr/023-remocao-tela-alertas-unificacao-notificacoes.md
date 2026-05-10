# ADR 023 — Remoção da tela de alertas e unificação do sino em notificações

## Status

Aceito

## Contexto

O projeto possuía duas telas relacionadas a alertas: `(tabs)/alerts.tsx` (aba interna com filtro por prioridade, consumia o endpoint `/alertas`) e `notificacoes.tsx` (Stack screen redesenhada com categorias Tudo / Veículo / Manutenção / Sistema). Os botões de sino nas abas Home e Histórico apontavam para `/alerts`, enquanto a aba Home já havia sido atualizada para `/notificacoes`, criando inconsistência.

## Decisão

Remover `alerts.tsx` completamente. Todos os ícones de sino em todas as abas (Home, Vitais, Histórico) navegam para `/notificacoes`. O registro `<Tabs.Screen name="alerts" options={{ href: null }} />` foi removido do layout de tabs.

Os alertas de revisão do backend continuam sendo consumidos dentro de `notificacoes.tsx` sob a categoria "Manutenção", preservando a integração com a API.

## Consequências

- Um único ponto de entrada para notificações, sem inconsistência entre abas
- A tela de notificações passa a ser a fonte canônica de todos os avisos ao usuário
- Redução de 373 linhas de código e de uma rota morta no roteador
