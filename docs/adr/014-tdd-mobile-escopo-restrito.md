# ADR 014 — TDD no mobile com escopo restrito a serviços, hooks e componentes com lógica

## Status

Aceito

## Contexto

A prática de TDD exige escrever testes antes do código de produção. No frontend mobile, nem toda camada tem lógica testável de forma significativa — testar componentes puramente de exibição acrescenta custo de manutenção sem verificar comportamento real.

Precisávamos definir onde o TDD agrega valor e onde ele gera overhead desnecessário para a Sprint 1.

## Decisão

Aplicar TDD apenas nas camadas com lógica real:

**Com TDD (testes primeiro):**
- `services/` — camada mais crítica: um bug aqui quebra todas as telas. São TypeScript puro, isoláveis com mocks de axios e SecureStore.
- `hooks/useAuth.ts` — lógica de estado de autenticação, verificação de sessão, redirect pós-login/logout.
- `components/FormularioLogin.tsx` — tem validação de campos obrigatórios, estado de loading, exibição de erro e controle de submit.

**Sem TDD (apenas implementação):**
- Componentes de exibição pura (`CartaoVeiculo`, `ItemManutencao`, `ItemAlerta`, `EstadoCarregando`) — apenas formatam props, sem lógica de negócio. Bugs aqui são visíveis imediatamente no simulador.
- Telas inteiras — são composições de componentes já cobertos pelos testes acima.
- Navegação do Expo Router — testamos apenas se o redirect é acionado, não a navegação em si.

**Stack de testes:**
- `jest-expo` — preset Jest compatível com Expo SDK
- `@testing-library/react-native` — renderHook, render, fireEvent
- Mock manual de `expo-secure-store` em `__mocks__/` — resolve automaticamente sem `jest.mock()` explícito

## Consequências

- 36 testes cobrindo todas as funções de services, hook de autenticação e comportamentos do formulário de login
- Componentes de exibição não têm testes — bugs de formatação/estilo são detectados visualmente
- O mock de `expo-secure-store` usa armazenamento em memória — cada teste começa com store limpa, sem vazamento de estado entre testes
- Testes de integração completos (Spring Boot + H2 + filtro JWT real) ficam como dívida técnica documentada no CLAUDE.md
