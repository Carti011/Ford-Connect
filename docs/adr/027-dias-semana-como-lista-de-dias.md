# ADR 027 — Recorrência de agendamento como lista de dias

## Status

Aceito

## Contexto

Na primeira versão do campo `dias_semana` em `agendamentos_veiculo`, a coluna aceitava apenas três valores fixos via CHECK constraint: `DIARIAMENTE`, `DIAS_UTEIS` e `FINS_DE_SEMANA`. Esse modelo cobre os padrões mais comuns, mas torna inviável combinações específicas como "Seg, Qua, Sex" ou "Sáb apenas", que são pedidos comuns em apps automotivos com aquecimento programado.

As alternativas avaliadas foram:

1. **Manter o enum e adicionar uma coluna `dias_customizados` opcional** — dois caminhos para o mesmo conceito, regras adicionais para decidir qual prevalece, mais difícil de manter
2. **Bitmask inteiro (7 bits)** — compacto e indexável, mas ilegível em queries diretas e SQL ad-hoc
3. **Lista de dias separados por vírgula em VARCHAR** — legível em logs e queries, fácil de parsear no cliente, validável por regex

## Decisão

A coluna `dias_semana` armazena uma lista de dias da semana separados por vírgula, usando a convenção `0=Domingo`, `1=Segunda`, ..., `6=Sábado`. Exemplos: `"1,2,3,4,5"` (dias úteis), `"0,6"` (fins de semana), `"0,1,2,3,4,5,6"` (diariamente), `"1,3,5"` (combinação arbitrária).

A migração V6 remove o CHECK constraint do enum e converte os valores existentes para o novo formato. A validação passa a ser feita por regex no DTO: `^[0-6](,[0-6]){0,6}$`. No mobile, o parsing usa `split(',').map(Number)` e a UI mostra 7 toggles individuais.

## Consequências

- Usuário consegue selecionar qualquer combinação de dias, não só os três padrões anteriores
- O campo continua sendo VARCHAR pequeno (`length = 20`), sem custo significativo
- Cálculo da próxima partida usa `Set<number>.has(diaDaSemana)` — mais simples que o switch case anterior
- Padrões pré-definidos ("Dias úteis", "Diariamente") deixam de existir como entidades no backend e passam a ser apenas atalhos de UI (se forem reintroduzidos no futuro)
- Não há garantia de unicidade dentro da string (ex: `"1,1,2"` passa o regex); a UI evita duplicatas usando Set
