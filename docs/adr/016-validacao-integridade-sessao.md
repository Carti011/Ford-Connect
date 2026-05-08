# ADR 016 — Validação de integridade de sessão na inicialização do app

## Status

Aceito

## Contexto

O `useAuth` verifica se o usuário está autenticado lendo o token JWT do SecureStore na inicialização do app. A verificação original considerava o usuário autenticado se o token existisse — sem checar se o `veiculoId` também estava presente.

Isso gerou um estado inválido: durante o desenvolvimento, um bug no fluxo de login salvou o token mas não o `veiculoId` (o `SecureStore.setItemAsync` travou com valor `undefined` antes de completar). O resultado foram três sintomas em cascata:

1. App saltava o login (token existia → `estaAutenticado = true`)
2. Tabs recebiam `idVeiculo = null`
3. As funções `carregar()` das telas saíam cedo com `if (!idVeiculo) return` sem setar `carregando = false` → spinner infinito sem saída

## Decisão

O `useAuth` passa a validar a **integridade da sessão** na inicialização: token presente sem `veiculoId` é tratado como sessão corrompida. A sessão é limpa via `limparSessao()` e o usuário é redirecionado para o login.

```
verificarSessao():
  token presente + veiculoId presente → sessão válida
  token presente + veiculoId ausente  → limpar SecureStore, forçar login
  token ausente                       → não autenticado, ir para login
```

Adicionalmente, as telas passaram a setar `carregando = false` quando `idVeiculo` é nulo, evitando spinner infinito em qualquer cenário onde o hook não redirecione a tempo.

## Consequências

- Sessão corrompida ou parcial nunca resulta em tela quebrada — o usuário sempre é redirecionado para o login
- Qualquer novo campo obrigatório adicionado à sessão no futuro deve ser incluído na verificação de integridade em `useAuth`
- O padrão "limpar e redirecionar" é preferível a tentar recuperar a sessão parcial, pois evita estados intermediários difíceis de prever
- Em Sprint 2, se múltiplos veículos forem suportados, a lógica de sessão precisará ser revisada junto com a mudança no `LoginResponse`
