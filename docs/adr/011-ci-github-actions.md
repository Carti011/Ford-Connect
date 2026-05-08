# ADR 011 — CI com GitHub Actions e proteção da branch main

## Status

Aceito

## Contexto

O projeto precisa garantir que nenhum código quebrado chegue à `main`. Trabalhando solo em duas disciplinas (backend e mobile) com prazo definido, o risco de merge acidental de código com teste falhando ou TypeScript inválido é real. Era necessário automatizar essa barreira sem depender de disciplina manual.

## Decisão

Usar GitHub Actions com dois jobs obrigatórios no CI:

- **Backend — Testes**: roda `./mvnw test` com perfil `test` (H2 em memória, sem depender do Neon)
- **Mobile — TypeScript**: roda `npx tsc --noEmit` para garantir que o código compila

Branch protection na `main` configurada via ruleset:

- PR obrigatório antes de qualquer merge
- Os dois jobs do CI devem passar
- Branch deve estar atualizada com a base antes do merge
- Force push e deleção bloqueados
- Sem lista de bypass — nem admin pula as regras

O perfil `test` do backend usa H2 com `MODE=PostgreSQL` e Flyway desabilitado, permitindo que os testes rodem sem nenhuma variável de ambiente externa.

## Consequências

- Nenhum merge na `main` passa sem CI verde — a barreira é técnica, não manual
- Testes do backend rodam isolados do Neon — CI não depende de banco externo
- O check de TypeScript antecipa erros de compilação antes do app chegar ao dispositivo
- Dois triggers no workflow (`push` e `pull_request`) fazem os checks aparecerem em duplicata no PR — comportamento esperado do GitHub Actions, sem impacto funcional
