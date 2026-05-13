# ADR 028 — PATCH parcial em `/api/agendamentos/{id}`

## Status

Aceito

## Contexto

A primeira versão do endpoint `PATCH /api/agendamentos/{id}` exigia `hora` e `diasSemana` no body (`@NotBlank`). Conforme novos campos foram entrando no agendamento (`duracaoMinutos`, `alvoTemperatura`), o contrato anterior obrigaria o cliente a enviar o estado completo a cada mudança trivial, mesmo que estivesse alterando só um campo.

Isso entra em conflito com a semântica de PATCH (RFC 5789): o método deve aplicar uma modificação parcial ao recurso. PUT é o método para substituir o recurso inteiro.

As alternativas avaliadas foram:

1. **Trocar o endpoint para PUT** — quebra a semântica HTTP esperada e força o cliente a sempre ter o estado completo em mãos antes de modificar
2. **Criar endpoints separados por campo** (`PATCH /hora`, `PATCH /dias`, `PATCH /duracao`) — multiplica URLs e quebra a coesão do recurso
3. **PATCH parcial com todos os campos opcionais** — alinha com a semântica de PATCH e simplifica o cliente

## Decisão

O `AtualizarAgendamentoRequest` passa a ter todos os campos como `Optional` (sem `@NotBlank`). O `AgendamentoVeiculoService.atualizar()` itera explicitamente nos campos, atualizando apenas os que vierem `non-null`:

```java
if (request.getHora() != null)            agendamento.setHora(request.getHora());
if (request.getDiasSemana() != null)      agendamento.setDiasSemana(request.getDiasSemana());
if (request.getDuracaoMinutos() != null)  agendamento.setDuracaoMinutos(request.getDuracaoMinutos());
if (request.getAlvoTemperatura() != null) agendamento.setAlvoTemperatura(request.getAlvoTemperatura());
```

O mobile envia apenas o subset que mudou. O mesmo padrão é replicado em `PATCH /api/veiculos/{id}/preferencias`.

## Consequências

- Cliente pode atualizar um campo isolado (ex: só `hora` da clima) sem precisar carregar o estado inteiro
- Validações de range (`@Pattern`, `@Min/@Max`) continuam funcionando porque são aplicadas só quando o campo está presente
- Não há como "limpar" um campo via PATCH (setar para `null`); para isso seria necessário outro mecanismo (ex: `{ "hora": null }` interpretado explicitamente). Hoje todos os campos editáveis sempre têm valor, então não é problema
- O service ficou levemente mais verboso (uma branch por campo), mas a clareza compensa
