# ADR 030 — Modal próprio em vez de `DateTimePicker` nativo para seleção de hora

## Status

Aceito

## Contexto

A tela `agendar` precisa de quatro seletores: hora do motor, hora dos outros agendamentos (clima), duração e temperatura-alvo. A primeira versão usou `@react-native-community/datetimepicker` para hora (spinner no iOS, dialog no Android) e modal próprio com lista de opções para duração e alvo.

Isso resultou em três experiências visuais diferentes na mesma tela:

- iOS spinner com rodas para hora
- Android dialog nativo para hora
- Modal customizado (overlay escuro, card centralizado, lista de opções com destaque do selecionado) para duração e alvo

O usuário pediu para padronizar todos no estilo do modal já existente.

## Decisão

Remover o uso de `@react-native-community/datetimepicker` na tela `agendar` e usar um único componente de modal polimórfico que cobre quatro modos:

- `duracao` — lista vertical de opções predefinidas (5, 10, 15, 20, 30, 45, 60 min)
- `alvo` — lista vertical de opções (18°C–30°C)
- `horaMotor` e `horaOutro` — duas colunas lado a lado: HORA (00–23) e MIN (00, 05, ..., 55), com botão "Confirmar" no rodapé

O estado do modal vira um discriminated union (`{ tipo: 'duracao' } | { tipo: 'alvo' } | { tipo: 'horaMotor' } | { tipo: 'horaOutro', agendamentoId }`) e o JSX renderiza condicionalmente o corpo a partir do tipo. Tocar fora do modal cancela; em duração/alvo o tap em uma opção fecha e aplica imediatamente; em hora é necessário "Confirmar" porque dois valores precisam ser selecionados.

## Consequências

- Mesma linguagem visual em todos os pickers da tela — mais coeso e previsível
- Granularidade de minutos limitada a múltiplos de 5 (decisão de UX: cobre 99% dos casos práticos e mantém a lista curta)
- Comportamento idêntico em iOS e Android, sem variação de plataforma
- A dependência `@react-native-community/datetimepicker` fica órfã (não é mais importada). Removê-la do `package.json` e do `app.json` é trabalho de limpeza pendente — não afeta funcionamento mas evita peso desnecessário no bundle
- Se em outras telas precisarmos de seletor de data (não só hora), avaliar caso a caso: pode ser que volte a fazer sentido o componente nativo, ou criar um modal de data no mesmo estilo
