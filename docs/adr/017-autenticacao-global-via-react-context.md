# ADR 017 — Autenticação global via React Context

## Status

Aceito

## Contexto

O `useAuth` foi implementado como um hook com `useState` local. Cada componente que chamava `useAuth()` criava sua própria instância de estado independente — `_layout.tsx`, `login.tsx` e `index.tsx` tinham instâncias separadas que nunca se comunicavam.

Isso causava dois bugs idênticos:

**Login:** o usuário preenchia as credenciais e clicava em "Entrar". A instância do `useAuth` em `login.tsx` atualizava `estaAutenticado = true` e salvava o token no SecureStore. Mas a instância em `_layout.tsx` nunca era notificada — seu `useEffect` de navegação nunca disparava. O usuário ficava preso na tela de login. Ao fechar e reabrir o app, `verificarSessao()` lia o SecureStore e navegava corretamente.

**Logout:** comportamento idêntico. `sair()` era chamado em `index.tsx`, atualizava a instância local, mas `_layout.tsx` permanecia com `estaAutenticado = true`.

Um problema paralelo foi identificado antes: `entrar()` e `sair()` chamavam `router.replace` diretamente enquanto o `useEffect` do `_layout.tsx` também tentava navegar ao detectar mudança de estado — race condition com dois `router.replace` concorrentes. Esse problema foi removido eliminando o `router.replace` das funções, mas o bug principal (estado não compartilhado) persistia.

## Decisão

Converter `useAuth` para React Context.

- `contexts/AuthContext.tsx` — contém o `AuthProvider` (estado + lógica) e o `useAuth` (lê do contexto via `useContext`)
- `hooks/useAuth.ts` — re-exporta `useAuth` e `AuthProvider` de `AuthContext.tsx`, mantendo todos os imports existentes sem alteração
- `app/_layout.tsx` — dividido em `RootLayout` (envolve com `AuthProvider`) e `NavigationGuard` (lê do contexto; controla toda a navegação)
- Toda a navegação é controlada exclusivamente pelo `useEffect` do `NavigationGuard`; `entrar()` e `sair()` apenas atualizam estado

## Consequências

- Estado de autenticação é único e compartilhado: qualquer componente que chame `useAuth()` lê e reage ao mesmo estado
- Login e logout navegam corretamente sem fechar o app
- Nenhuma tela precisou alterar o caminho de import
- Testes de `useAuth` passam a usar `AuthProvider` como wrapper via opção `wrapper` do `renderHook`
