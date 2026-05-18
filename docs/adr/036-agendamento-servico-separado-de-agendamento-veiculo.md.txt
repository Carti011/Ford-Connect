# ADR 036 — AgendamentoServico como entidade separada de AgendamentoVeiculo

## Status

Aceito

## Contexto

A V4 já criou a entidade `AgendamentoVeiculo` e a tabela `agendamentos_veiculo`. Esses registros representam **rotinas recorrentes** do veículo: motor ligando automaticamente em horário fixo, climatização programada, lembrete de revisão. Eles têm campos como `hora`, `dias_semana`, `duracao_minutos`, `ativo` (boolean), `tipo` (motor|clima|revisao).

A nova feature de **agendamento de serviço na concessionária** tem outra natureza: é uma solicitação pontual, não recorrente. Tem campos completamente diferentes: `data_preferida` (única, no futuro), `periodo` (manhã ou tarde), `concessionaria_id` (FK), `status` (pendente|confirmado|cancelado), `observacoes` (texto livre). Além disso, precisa referenciar **quais recomendações** o usuário quis incluir no atendimento (relação `@ManyToMany` com `Recomendacao`).

Dois caminhos foram avaliados:

1. **Reaproveitar `AgendamentoVeiculo`** adicionando colunas opcionais (`data_preferida`, `periodo`, `concessionaria_id`, etc.). Resultado seria uma entidade polimórfica com muitos campos nullable e uma coluna `tipo` que decide qual subset é válido.
2. **Criar entidade separada `AgendamentoServico`** com tabela e endpoints próprios.

A primeira opção polui o domínio: `AgendamentoVeiculo` deixa de ter um significado claro, e validações passam a depender da combinação de `tipo` com campos preenchidos. A relação `@ManyToMany` com `Recomendacao` só faria sentido para um subset dos registros — modelagem confusa.

## Decisão

Criar `AgendamentoServico` como entidade nova e independente, em V14. Não tocar em `AgendamentoVeiculo`.

Schema:

```sql
CREATE TABLE agendamentos_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  veiculo_id UUID NOT NULL REFERENCES veiculos(id),
  concessionaria_id UUID NOT NULL REFERENCES concessionarias(id),
  data_preferida DATE NOT NULL,
  periodo VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE agendamento_servico_recomendacoes (
  agendamento_servico_id UUID NOT NULL REFERENCES agendamentos_servico(id) ON DELETE CASCADE,
  recomendacao_id UUID NOT NULL REFERENCES recomendacoes(id),
  PRIMARY KEY (agendamento_servico_id, recomendacao_id)
);
```

Endpoints:

- `POST /api/veiculos/{id}/agendamentos-servico` — cria.
- `GET /api/veiculos/{id}/agendamentos-servico` — lista do veículo, ordenados por `criado_em DESC`.

A URL `agendamentos-servico` (com hífen) evita colisão com a `agendamentos` existente da entidade `AgendamentoVeiculo`. Os dois endpoints coexistem sem ambiguidade.

Validação na criação:

- `concessionaria_id` precisa existir.
- `data_preferida` precisa ser ≥ hoje (`@FutureOrPresent`).
- `periodo` precisa ser `manha` ou `tarde`.
- Lista de `recomendacaoIds` precisa ser não vazia e todas as recomendações precisam pertencer ao veículo do path.

## Consequências

- **Domínio limpo:** cada entidade tem responsabilidade única. `AgendamentoVeiculo` segue significando rotina recorrente. `AgendamentoServico` significa solicitação pontual de atendimento na rede.
- **Caminho aberto para integrações:** quando a Ford expor uma API real de agendamento de concessionária, é em `AgendamentoServico` que ela conecta. O status passa de `pendente` para `confirmado` quando a concessionária aceita. Hoje o status só serve como placeholder — o seed e o POST gravam tudo como `pendente`.
- **Junction table evita JSON em coluna:** registrar as recomendações incluídas numa tabela de junção, em vez de num campo `text` com IDs separados por vírgula, mantém integridade referencial. Quando uma recomendação é resolvida e deletada, o registro de junção cai junto via `ON DELETE CASCADE`.
- **Não há tela de histórico de agendamentos na Sprint 1.** O `GET` foi adicionado por simetria e para facilitar debug, mas a UI da Sprint 1 mostra apenas a confirmação após criação. Listagem do histórico fica como gancho para Sprint 2.
- **Nenhuma migração de dados existentes:** `AgendamentoVeiculo` continua com os 3 seeds da V4. Nada se converte para `AgendamentoServico`.
