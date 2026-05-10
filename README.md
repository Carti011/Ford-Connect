# Ford Connect

[![CI](https://github.com/Carti011/Ford-Connect/actions/workflows/ci.yml/badge.svg)](https://github.com/Carti011/Ford-Connect/actions/workflows/ci.yml)

App mobile e API REST para proprietários de veículos Ford. Permite ao usuário visualizar dados do seu veículo, histórico de manutenções e alertas de revisão pendentes.

Desenvolvido como parte do **Ford FIAP Challenge 2026** — atacando o desafio de retenção de clientes na rede oficial Ford através de visibilidade proativa sobre o veículo e sua manutenção.

<p align="center">
  <img src="docs/screenshots/login.png" alt="Tela de login" width="240" />
  <img src="docs/screenshots/home.png" alt="Tela principal" width="240" />
  <img src="docs/screenshots/dashboard.png" alt="Dashboard de vitais" width="240" />
</p>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Quickstart com Docker](#quickstart-com-docker)
- [Desenvolvimento local](#desenvolvimento-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [API](#api)
- [Testes](#testes)
- [Comandos úteis](#comandos-úteis)
- [Documentação](#documentação)
- [Números do projeto](#números-do-projeto)
- [Highlights técnicos](#highlights-técnicos)
- [Tecnologias](#tecnologias)

---

## Sobre o projeto

A Ford trouxe dois desafios para times de estudantes da FIAP em 2026. Este projeto resolve o **Desafio 2 — VIN Share / Retenção de Clientes**: identificar e engajar proprietários com risco de não retornar para manutenção paga na rede oficial Ford.

A abordagem do app:

- Dar visibilidade ao dono do carro sobre seu veículo, histórico de serviços e alertas de revisão
- Reduzir atrito de informação que hoje leva clientes a buscar oficinas independentes
- Servir como camada de relacionamento entre o cliente final e a rede de concessionárias

A Sprint 1 entrega um MVP com dados mockados via seed — sem integração real com sistemas Ford.

---

## Stack

### Backend

- **Java 21** + **Spring Boot 3.3.5**
- **Spring Security** com autenticação **JWT** (jjwt)
- **Spring Data JPA** + **Hibernate**
- **PostgreSQL 16** (Neon em produção, Docker em dev)
- **Flyway** para migrations versionadas
- **springdoc-openapi** para documentação Swagger
- **JUnit 5** + **Mockito** para testes
- **Maven** para build

### Mobile

- **React Native** com **Expo SDK 54**
- **Expo Router** (file-based routing)
- **TypeScript** em modo strict
- **expo-secure-store** para armazenamento do JWT
- **axios** com interceptor para autenticação automática
- **Jest** + **@testing-library/react-native** para testes

### Infraestrutura

- **Docker** + **Docker Compose** para ambiente local
- **GitHub Actions** para CI (testes backend + Jest + TypeScript no mobile)
- **Railway** para deploy de produção do backend
- **Neon** para banco PostgreSQL gerenciado

---

## Estrutura de pastas

```
.
├── backend/                       Java Spring Boot
│   ├── src/main/java/br/com/fordapp/
│   │   ├── controller/            endpoints REST
│   │   ├── service/               regras de negócio
│   │   ├── repository/            acesso ao banco
│   │   ├── model/                 entidades JPA
│   │   ├── dto/                   contratos de entrada e saída
│   │   ├── security/              configuração de JWT e Spring Security
│   │   └── exception/             tratamento global de erros
│   ├── src/main/resources/
│   │   ├── application.yml        config principal
│   │   ├── application-test.yml   config para testes (H2)
│   │   └── db/migration/          scripts Flyway versionados
│   ├── pom.xml
│   └── Dockerfile
│
├── mobile/                        React Native + Expo
│   ├── app/                       rotas (Expo Router)
│   │   ├── (tabs)/                navegação principal
│   │   ├── _layout.tsx            layout raiz com proteção de rotas
│   │   └── login.tsx              tela de login
│   ├── components/                componentes reutilizáveis
│   ├── contexts/                  estado global (autenticação)
│   ├── hooks/                     hooks customizados
│   ├── services/                  chamadas à API
│   ├── constants/                 design tokens
│   ├── types/                     tipos TypeScript compartilhados
│   └── __tests__/                 testes Jest
│
├── docs/
│   ├── adr/                       Architecture Decision Records
│   └── handoff/                   handoffs entre sessões de trabalho
│
├── .github/workflows/ci.yml       pipeline de CI
├── docker-compose.yml             orquestração local
└── CLAUDE.md                      guia interno do projeto
```

---

## Pré-requisitos

Para qualquer cenário de execução:

- **Git**
- **Docker Desktop** (para o cenário rápido com Compose)

Para desenvolvimento local sem Docker no backend:

- **Java 21** (Temurin recomendado — `sdk install java 21-tem` se usar SDKMAN)
- **Maven** (vem incluído via wrapper `./mvnw`, não precisa instalar)

Para o mobile:

- **Node.js 20+**
- **npm** (vem com Node)
- **Expo Go** instalado no celular (Android ou iOS) **ou** simulador iOS / emulador Android configurado

---

## Quickstart com Docker

Caminho mais rápido para um colaborador novo rodar o projeto inteiro pela primeira vez. Sobe banco e backend juntos com um comando.

```bash
# 1. Clonar o repositório
git clone https://github.com/Carti011/Ford-Connect.git
cd Ford-Connect

# 2. Criar arquivo .env na raiz com pelo menos JWT_SECRET
cat > .env <<'EOF'
JWT_SECRET=ford-connect-dev-secret-com-pelo-menos-64-caracteres-para-hs256-funcionar
EOF

# 3. Subir banco + backend
docker-compose up -d

# 4. Verificar que está funcionando
curl http://localhost:8080/api-docs
```

Backend disponível em `http://localhost:8080` e Swagger em `http://localhost:8080/swagger-ui.html`.

Para rodar o mobile:

```bash
cd mobile
npm install

# criar .env.local apontando para o backend
echo "EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080" > .env.local

npx expo start
```

Substitua `SEU_IP_LOCAL` pelo IP da sua máquina na rede Wi-Fi (ver `ipconfig getifaddr en0` no macOS ou `hostname -I` no Linux). Não use `localhost` — o celular precisa alcançar a máquina pela rede.

---

## Desenvolvimento local

Cenário recomendado para quem vai escrever ou modificar código. Backend roda direto pelo Maven com hot reload, banco em Docker apenas.

### Backend

```bash
# subir só o banco
docker-compose up -d postgres

# em outro terminal: rodar o backend
cd backend
./mvnw spring-boot:run
```

Como atalho, existe um script de dev local que já exporta as variáveis de ambiente esperadas:

```bash
bash backend/dev.sh
```

> O script `backend/dev.sh` está no `.gitignore` — cada colaborador mantém o seu local com seus próprios valores. Use o exemplo abaixo como ponto de partida.

```bash
#!/bin/bash
export PGHOST=localhost
export PGDATABASE=ford_mobile
export PGUSER=ford
export PGPASSWORD=ford123
export PGSSLMODE=disable
export JWT_SECRET="ford-connect-local-dev-secret-com-pelo-menos-64-caracteres-para-hs256"
export JWT_EXPIRATION_MS=86400000

cd "$(dirname "$0")" && ./mvnw spring-boot:run
```

Depois: `chmod +x backend/dev.sh`

### Mobile

```bash
cd mobile
npm install

# .env.local com o endereço do backend acessível pelo celular
echo "EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080" > .env.local

npx expo start
```

Escaneie o QR code com o **Expo Go** no celular ou pressione `i` (iOS) / `a` (Android) para abrir no simulador.

### Credenciais de teste

O Flyway popula o banco automaticamente com dados mockados na primeira execução. As credenciais válidas estão definidas em `backend/src/main/resources/db/migration/V2__seed_dados_mockados.sql`.

---

## Variáveis de ambiente

### Backend

| Variável            | Obrigatória | Descrição                                                               |
| ------------------- | ----------- | ----------------------------------------------------------------------- |
| `PGHOST`            | sim         | Host do PostgreSQL (`localhost` em dev, `postgres` no compose)          |
| `PGDATABASE`        | sim         | Nome do banco                                                           |
| `PGUSER`            | sim         | Usuário do banco                                                        |
| `PGPASSWORD`        | sim         | Senha do banco                                                          |
| `PGSSLMODE`         | não         | `disable` em local, `require` no Neon. Default: `disable`               |
| `JWT_SECRET`        | sim         | Segredo HS256 do JWT — mínimo 64 caracteres                             |
| `JWT_EXPIRATION_MS` | não         | Tempo de expiração do token em milissegundos. Default: `86400000` (24h) |

### Mobile

| Variável              | Obrigatória | Descrição                                                                        |
| --------------------- | ----------- | -------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | sim         | URL base da API. Em dev local: `http://SEU_IP:8080`. Em produção: URL do Railway |

O prefixo `EXPO_PUBLIC_` é necessário para que a variável seja exposta ao bundle do app.

---

## API

Base URL local: `http://localhost:8080`

### Endpoints principais

| Método | Rota                             | Autenticação | Descrição                            |
| ------ | -------------------------------- | ------------ | ------------------------------------ |
| POST   | `/api/autenticacao/login`        | Pública      | Autenticação com email e senha → JWT |
| GET    | `/api/veiculos/{id}`             | Bearer JWT   | Dados do veículo                     |
| GET    | `/api/veiculos/{id}/manutencoes` | Bearer JWT   | Histórico de manutenções             |
| GET    | `/api/veiculos/{id}/alertas`     | Bearer JWT   | Alertas de revisão pendentes         |

### Documentação interativa

Com o backend rodando, a documentação Swagger fica em:

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/api-docs

---

## Testes

### Backend

```bash
cd backend
./mvnw test -Dspring.profiles.active=test
```

O perfil `test` usa H2 em memória — não requer PostgreSQL nem nenhuma variável de ambiente configurada.

### Mobile

```bash
cd mobile
npm test
```

Outras variantes:

```bash
npm test -- --watch          # modo watch para desenvolvimento
npm test -- --coverage       # gera relatório de cobertura
npm test -- --ci             # modo CI (sem watch, mais estrito)
```

---

## Comandos úteis

```bash
# Verificar tipos TypeScript no mobile sem compilar
cd mobile && npx tsc --noEmit

# Subir backend rodando no celular físico (modo tunnel — não precisa de IP)
cd mobile && npx expo start --tunnel

# Ver logs do banco no Docker
docker-compose logs -f postgres

# Resetar banco completamente (apaga volume)
docker-compose down -v && docker-compose up -d postgres

# Conectar no banco via psql dentro do container
docker exec -it ford_app_db psql -U ford -d ford_mobile

# Descobrir o IP local da máquina (macOS)
ipconfig getifaddr en0

# Descobrir o IP local da máquina (Linux)
hostname -I | awk '{print $1}'
```

---

## Documentação

- **`docs/adr/`** — todas as decisões arquiteturais relevantes registradas como ADRs numeradas
- **`docs/handoff/`** — handoffs entre sessões de trabalho (excluídos do git por padrão; servem como contexto de quem está retomando o projeto)
- **`backend/src/main/resources/db/migration/`** — schema versionado e seed de dados

---

## Números do projeto

| Métrica                 | Valor |
| ----------------------- | ----- |
| Endpoints REST          | 4     |
| Telas mobile            | 5     |
| Testes Jest (mobile)    | 36    |
| Testes JUnit (backend)  | 23    |
| Migrations Flyway       | 2     |
| ADRs documentados       | 21    |

---

## Highlights técnicos

- **Cybersecurity embutida** — JWT com expiração configurável, validação de inputs com Bean Validation, CORS restrito, rate limiting por IP, respostas de erro sem stack trace ou detalhes internos
- **Arquitetura em camadas** — separação rígida de `controller → service → repository`, DTOs no contrato externo, entidades nunca expostas, lógica de negócio fora do controller
- **TDD no backend** — testes escritos antes da implementação, cobrindo controllers, services e o handler global de erros
- **CI completo bloqueando merge** — pipeline GitHub Actions roda testes do backend (JUnit + H2 em memória), Jest no mobile e verificação de tipos TypeScript. Branch protection na `main` exige todos os checks verdes
- **Histórico de decisões versionado** — toda decisão arquitetural relevante registrada como ADR em `docs/adr/`, permitindo entender o porquê de cada escolha mesmo meses depois

---

## Tecnologias

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Flyway](https://img.shields.io/badge/Flyway-migrations-CC0200?logo=flyway&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-secure-000000?logo=jsonwebtokens&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-tested-C21325?logo=jest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
