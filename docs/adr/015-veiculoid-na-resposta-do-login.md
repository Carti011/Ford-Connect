# ADR 015 — veiculoId incluído na resposta do login

## Status

Aceito

## Contexto

O mobile precisa saber qual veículo carregar após o login. Na Sprint 1, cada usuário tem exatamente um veículo. Havia três alternativas:

1. **Hardcode no mobile** — o ID do veículo seria fixo no código. Inviável para qualquer usuário além do seed.
2. **Requisição extra após login** — após autenticar, o mobile faria `GET /api/usuarios/me/veiculo` para descobrir o veiculoId. Isso acrescenta uma roundtrip extra e exige um endpoint adicional.
3. **veiculoId na resposta do login** — o backend inclui o UUID do veículo no `LoginResponse`. O mobile salva junto com o token e sabe imediatamente qual veículo carregar.

## Decisão

Incluir o campo `veiculoId` no `LoginResponse` do backend. O `AuthService` busca o veículo vinculado ao usuário via `VeiculoRepository.findByUsuarioId()` e inclui o UUID na resposta. Se o usuário não tiver veículo vinculado, o campo retorna `null`.

O mobile salva o `veiculoId` no SecureStore junto com o token JWT na função `login()` em `services/auth.ts`.

## Consequências

- Nenhuma requisição extra para descobrir o veículo — o mobile tem tudo que precisa na resposta do login
- O `VeiculoRepository` precisa de um método `findByUsuarioId` — adicionado à interface JPA
- Se o usuário não tiver veículo, `veiculoId` é `null` — o mobile trata esse caso não exibindo dados de veículo
- Em Sprint 2, com múltiplos veículos por usuário, essa abordagem precisará ser revisada — o login retornaria uma lista ou apenas o veículo principal
- Os testes do `AuthService` e `AuthController` foram atualizados para verificar a presença do `veiculoId` na resposta
