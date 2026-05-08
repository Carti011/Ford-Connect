# ADR 013 — axios com interceptor de request para injeção centralizada de JWT

## Status

Aceito

## Contexto

O app mobile faz chamadas autenticadas à API em múltiplas telas (veículo, manutenções, alertas). Cada chamada precisa incluir o header `Authorization: Bearer <token>`. A abordagem ingênua seria passar o token manualmente em cada chamada — isso gera duplicação e torna a troca de estratégia de autenticação um trabalho em múltiplos arquivos.

A decisão também envolve a escolha entre **fetch** (nativo) e **axios** (biblioteca). `fetch` não tem interceptors; qualquer lógica compartilhada (injeção de token, timeout global, tratamento de erros) precisa ser encapsulada manualmente em cada chamada ou em wrappers customizados.

## Decisão

Usar **axios** com um **interceptor de request** configurado na instância compartilhada em `services/api.ts`. O interceptor lê o token do SecureStore de forma assíncrona antes de cada request e injeta o header `Authorization` automaticamente.

```
services/api.ts
  └── instância axios
        └── interceptor de request
              └── lê token do SecureStore
              └── injeta Authorization: Bearer <token>
```

Toda chamada à API passa pela instância compartilhada — nenhuma tela ou service importa axios diretamente.

## Consequências

- A injeção do token é feita em um único ponto — troca de estratégia de autenticação afeta apenas `api.ts`
- Timeout global de 10 segundos configurado na instância — sem repetição em cada chamada
- Erros HTTP (401, 404, 500) são propagados como exceções pelo axios — os services capturam e relançam, as telas exibem mensagens amigáveis
- Em testes unitários, axios é mockado via `jest.mock('axios')` — o interceptor não é exercitado nos testes de service, apenas o comportamento esperado da camada
- A URL base vem de `process.env.EXPO_PUBLIC_API_URL` — troca entre local e Railway sem alterar código
