# ADR 026 — Seção de agendamento na Home como preview navegável

## Status

Aceito

## Contexto

A Home já exibia uma lista resumida de agendamentos (hardcoded) com toggles simples. A tela de agendamento completa inclui seleção de dias da semana, configuração de horário, duração, temperatura-alvo e opções individuais (climatização, desembaçador, banco aquecido, notificação). Era necessário definir onde e como expor essa tela no fluxo de navegação.

As alternativas avaliadas foram:

1. **Aba dedicada na tab bar** — ocupa espaço permanente na navegação inferior, mas agendamento é uma ação eventual, não de consulta frequente
2. **Stack screen acessada pela Home** — mantém a tab bar enxuta e coloca o agendamento como ação secundária
3. **Modal** — dificultaria a leitura da lista de agendamentos e da seleção de dias em telas pequenas

## Decisão

Manter a seção "Agendar" na Home como preview dos agendamentos existentes (com toggles rápidos). O header da seção recebe um botão "+" que abre a Stack screen `/agendar` — padrão "lista resumida → tela de detalhe" já estabelecido por outras seções do app (localização, notificações, perfil).

A tela `/agendar` exibe a próxima partida em destaque, o seletor de dias, os stats (horário, duração, temperatura-alvo) e a lista completa de agendamentos com suas opções.

## Consequências

- A tab bar permanece com três abas apenas (Home, Vitais, Histórico), sem poluição visual
- O usuário acessa o agendamento completo quando necessário, sem que ele domine a Home
- Todos os dados são mockados na Sprint 1; a integração com backend (CRUD de agendamentos) fica para Sprint 2
