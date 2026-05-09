# ADR 019 — Reestruturação da navegação: Alertas no header, nova aba Vitais

## Status

Aceito

## Contexto

A tab bar original tinha três abas: Home (carro), Alertas (raio), Histórico (chave inglesa). Dois problemas foram identificados:

1. O ícone de raio remete a veículos elétricos, sem relação semântica com alertas de revisão num app para combustão.
2. A chave inglesa não comunica bem "histórico de manutenções" para o usuário final.
3. Não havia espaço para uma tela de diagnóstico/vitais do veículo, que é central para o propósito de retenção do app (Desafio 2 Ford FIAP).

## Decisão

- A tab bar passa a ter três abas: **Home** (ícone de carro) | **Vitais** (ícone de gauge/velocímetro) | **Histórico** (ícone de relógio).
- A tela de Alertas sai da tab bar e passa a ser acessada pelo **ícone de sino** no top chrome de todas as telas principais.
- Tecnicamente, `alerts.tsx` permanece dentro do grupo `(tabs)/` com `href: null` no `Tabs.Screen`. Isso garante que a tab bar continue visível ao navegar para Alertas, dispensando botão de voltar.
- O ícone de relógio substitui a chave inglesa no Histórico — comunica melhor "consultar o passado".
- O sino no header das telas Home, Vitais e Histórico navega via `router.push('/alerts')`.
- A tela Home mantém sino + ícone de usuário (logout) lado a lado, por ser o hub principal onde o logout faz sentido contextual.

## Consequências

**Melhora:**
- Hierarquia de informação mais clara: tabs = navegação principal de nível igual; alertas = ação contextual acessível de qualquer ponto.
- Ícones semanticamente coerentes para o público de combustão.
- Espaço liberado na tab bar para o Vitais, que é o diferencial do app frente à concorrência.
- Alertas com tab bar visível melhora a orientação do usuário (sabe onde está, pode sair para qualquer aba).

**Piora / pendente:**
- O sino não tem indicador de contagem de alertas não lidos (badge numérico) — fica para Sprint 2.
- O logout só está disponível diretamente na tela Home; nas demais o usuário precisa voltar à Home para sair.
