# ADR 033 — Integração mobile da climatização: discador na zona ativa, debounces independentes e header decorativo

## Status

Aceito

## Contexto

Após o backend de climatização entrar em pé (ver ADR 032), surgiu a etapa de ligar a tela `mobile/app/climatizacao.tsx` à API. Três questões precisaram de decisão antes da implementação:

1. **Redundância de temperatura.** O modelo inicial tinha `estado_climatizacao.temperatura` (controlada pelo discador central) **e** `zona_climatizacao.temperatura` (uma por zona). Os dois valores podiam divergir sem regra clara de sincronização — o discador editava o campo global, mas as zonas mostravam temperaturas independentes.

2. **Frequência de PATCH no discador.** O discador SVG dispara `onChange` várias vezes por segundo durante o arrasto (PanResponder em thread JS — ver ADR 024). Mandar um PATCH a cada mudança gera dezenas de requisições, condição de corrida no backend e bateria do dispositivo afetada. Precisava de uma estratégia de debounce.

3. **Botão sem função no header.** A versão original da tela tinha um `SlidersIcon` clicável no canto superior direito que nunca chegou a ter ação. Removê-lo deixava um caixote cinza vazio (placeholder visual com fundo de superfície), mantendo a simetria do header com o "X" da esquerda mas piorando a experiência. Removê-lo sem placeholder desbalanceava o título centralizado.

## Decisão

**1. Temperatura é propriedade exclusiva da zona.** Migração V10 dropa a coluna `estado_climatizacao.temperatura`. Entidade, DTOs (`EstadoClimatizacaoResponse`, `AtualizarClimatizacaoRequest`) e service são ajustados. No mobile, o discador edita a temperatura **da zona atualmente ativa** (com fallback para a primeira zona se nenhuma estiver ativa — invariante: `estado_climatizacao` sempre tem ao menos uma zona, garantido pela seed). Os toggles de zona continuam alternando o campo `ativa`.

**2. Dois debounces independentes, ambos com 400 ms.** Endpoints diferentes pedem timers diferentes:

- `timerEstadoRef` + `patchEstadoPendenteRef` para acumular `velocidadeVentilador` (toca em `PATCH /api/veiculos/{id}/climatizacao`)
- `timerZonaRef` + `tempZonaPendenteRef` para acumular `temperatura` da zona ativa (toca em `PATCH /api/veiculos/{id}/climatizacao/zonas/{idZona}`)

Em ambos: estado local atualiza de forma otimista no primeiro tick (UI instantânea); o último valor pendente é enviado depois do silêncio de 400 ms; resposta do servidor sobrescreve o estado local. Em erro, o estado otimista permanece (não há rollback automático no debounce — só nos toggles imediatos), porque um rollback durante drag interativo causaria flicker visível.

**3. Canto superior direito do header recebe um enfeite, não um botão.** No lugar do antigo `Pressable` com `SlidersIcon`, fica um `<View style={estilos.headerEnfeite} pointerEvents="none">` com um `FanIcon` em `colors.textDim`. O `View` ocupa 40×40 (mesmo que o "X" da esquerda) sem `backgroundColor` nem `borderWidth` — fica visivelmente "ícone temático", não "botão". `pointerEvents="none"` impede qualquer intercepção de toque mesmo em React Native Web. O componente local `SlidersIcon` foi deletado por ficar órfão.

## Consequências

- **Modelo mais simples:** uma única fonte de verdade por temperatura (a zona). Não há mais drift possível entre dois campos.
- **Compromisso de produto:** o discador agora "pertence" à zona ativa. Não há UI hoje para editar a temperatura de uma zona inativa sem antes ativá-la. Em sprints futuras, se aparecer a necessidade real de editar temperatura por zona via modal, a modelagem aceita (basta adicionar UI que dispara `PATCH /climatizacao/zonas/{idZona}` com `{temperatura}`).
- **Padrão de debounce dual** fica disponível como referência para outras telas que mexem em endpoints distintos a partir da mesma interação (ex: futura tela de "preferências de viagem" com slider que persiste em dois recursos).
- **Header decorativo é dívida visual aceita:** quem olha pode achar que dá pra clicar. Alternativas testadas (sem placeholder, com placeholder cinza vazio, com botão funcional) eram piores estética ou produtivamente.
- **Migração V10 destrutiva:** o valor da coluna `temperatura` em `estado_climatizacao` se perde. Aceitável porque o único registro no banco era seed mock (ver V9). Em produção real, exigiria estratégia de copy-para-zona-ativa antes do drop.
- **Cobertura de testes:** o teste de range de temperatura no `ClimatizacaoControllerTest` foi removido (PATCH no estado não aceita mais o campo). Equivalente para zona já existia. O teste novo da tela cobre indiretamente que o discador opera no canal de zona e não no canal de estado, sem precisar simular geometria de PanResponder.
