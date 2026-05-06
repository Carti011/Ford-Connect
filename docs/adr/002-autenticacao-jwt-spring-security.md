# ADR 002 — Autenticação JWT com Spring Security

## Status

Aceito

## Contexto

O app mobile precisa autenticar usuários e proteger os endpoints da API. A disciplina de Cybersecurity exige que autenticação segura esteja embutida na implementação — não como entrega separada, mas como parte do projeto Java e Mobile. A API é consumida por um cliente mobile (React Native), o que descarta sessões baseadas em cookie por não serem adequadas para esse modelo de comunicação.

Foram consideradas duas abordagens: sessões com estado no servidor (stateful) e tokens JWT sem estado (stateless). Sessões exigiriam armazenamento de estado no servidor e mecanismos de sincronização, adicionando complexidade desnecessária para um app mobile com um único servidor. JWT é stateless, amplamente suportado e adequado para APIs REST consumidas por clientes mobile.

## Decisão

Usar **JWT (JSON Web Token)** com assinatura **HS256** gerenciado pelo **Spring Security**. A biblioteca utilizada é `io.jsonwebtoken:jjwt` (versão 0.12.3). O único endpoint público é `POST /api/auth/login` — todos os demais exigem token válido no header `Authorization: Bearer <token>`.

## Consequências

- Autenticação stateless — o servidor não armazena sessões, facilitando escalabilidade futura
- O token tem expiração configurável via variável de ambiente (`JWT_EXPIRATION_MS`)
- O segredo de assinatura (`JWT_SECRET`) nunca é exposto em código — lido exclusivamente de variável de ambiente
- Logs não registram tokens nem senhas — conformidade com os requisitos de Cybersecurity
- Refresh token não está implementado na Sprint 1 — quando o token expira, o usuário precisa fazer login novamente (dívida técnica intencional)
- Stack traces nunca são expostos nas respostas de erro — tratamento centralizado via `GlobalExceptionHandler`
