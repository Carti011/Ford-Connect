# ADR 031 — Escopo de execução exclusivamente local

## Status

Aceito (substitui parcialmente [ADR 001](001-postgresql-16-neon.md) e [ADR 010](010-deploy-railway.md))

## Contexto

O projeto chegou ao final da Sprint 1 com dois ambientes em paralelo:

- **Produção (Neon + Railway)** — banco gerenciado no Neon, backend deployado no Railway, app apontando para a URL pública.
- **Desenvolvimento local** — banco em container Docker, backend rodando via Maven, app apontando para o IP do Mac.

A produção foi útil enquanto a Sprint estava em andamento — permitia testar o app sem subir o backend localmente. Mas no estágio atual do projeto, alguns fatos mudaram:

- O critério de avaliação acadêmico foca no funcionamento do código, não na infraestrutura.
- O projeto será entregue zipado para dois professores (Mobile e Java), que precisam rodar o sistema na máquina deles sem configuração externa.
- Manter as credenciais do Neon em `.env` versionado, em zips enviados por e-mail, ou compartilhadas com terceiros, é risco de segurança sem ganho prático.
- O custo de manter o backend ativo no Railway 24/7 é desnecessário para um MVP acadêmico.
- O fluxo "subir Docker localmente" já é o mesmo nas duas pontas (você no dia a dia, professor avaliando), eliminando uma divergência entre ambientes.

## Decisão

Tratar **ambiente local em Docker como o único ambiente de execução suportado** dentro do escopo do projeto:

- `docker-compose up -d` sobe banco + backend em containers na máquina de quem executar
- App descobre o IP do backend automaticamente via `Constants.expoConfig.hostUri` do Expo, eliminando a necessidade de `EXPO_PUBLIC_API_URL` em `mobile/.env.local`
- O `.env` da raiz fica com **apenas `JWT_SECRET`** — credenciais de banco são fixas no `docker-compose.yml` (valores genéricos sem segredo)
- Quem quiser apontar para um banco externo (Neon ou outro) ou subir o backend em uma plataforma de deploy continua podendo fazer — instruções em "Cenários avançados" no [README](../../README.md), fora do fluxo padrão

ADRs anteriores ([001](001-postgresql-16-neon.md), [010](010-deploy-railway.md), [018](018-ambiente-desenvolvimento-local.md)) permanecem no histórico para registrar o caminho percorrido, mas não refletem mais o setup padrão.

## Consequências

### Positivas

- Setup do projeto cabe em três comandos: `cp .env.example .env`, `docker-compose up -d`, `npx expo start`
- Sem segredos de produção em qualquer artefato versionado, zipado ou enviado externamente
- Mesma sequência de comandos para dev, professor de mobile, professor de backend e colega de time
- Independente de rede Wi-Fi, IP, custo de plano gratuito ou cold start de plataforma de deploy
- App descobre o IP do backend automaticamente, eliminando o problema "funciona na minha rede, não na outra"

### Negativas

- Cada quem que executa o projeto recria seu banco do zero (Flyway popula via seed) — não há base compartilhada
- Recrutador querendo testar a app rapidamente precisa rodar Docker em vez de abrir uma URL
- Capacidade de demonstrar deploy real fica relegada à seção de "Cenários avançados" no README, em vez de ser o fluxo principal

### Pendências

- Se em sprints futuras o projeto evoluir para integração com sistemas Ford reais, um novo ADR deve registrar a volta a um ambiente gerenciado com SLA
