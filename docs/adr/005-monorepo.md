# ADR 005 — Monorepo para backend e mobile

## Status

Aceito

## Contexto

O projeto é composto por dois componentes principais: um backend Java/Spring Boot e um app mobile React Native. Precisávamos decidir entre manter os dois em repositórios separados (multirepo) ou no mesmo repositório (monorepo).

O projeto é desenvolvido principalmente por um único desenvolvedor cobrindo as duas disciplinas (Java/Web Services e Mobile Development). Repositórios separados adicionariam overhead de sincronização de versões, contexto dividido e dois fluxos de CI/CD distintos sem benefício real para um time pequeno.

## Decisão

Manter backend e mobile em um **monorepo único** com a seguinte estrutura de raiz:

```
/
├── backend/    ← Java Spring Boot
└── mobile/     ← React Native + Expo
```

Cada componente tem seu próprio tooling independente (`pom.xml` para o backend, `package.json` para o mobile) — o monorepo é apenas uma convenção de organização, não um workspace unificado de build.

## Consequências

- Contexto unificado: uma única PR cobre mudanças coordenadas entre API e app
- Histórico de git reflete a evolução de ambos os lados em paralelo
- Sem dependência de package manager monorepo (Turborepo, Nx) — mantém a simplicidade para o contexto acadêmico
- Deploy do backend (Railway) e do mobile (Expo) são processos independentes — o monorepo não acopla os deploys
- Se o projeto crescer com múltiplos times, a divisão em repositórios separados se tornaria necessária
