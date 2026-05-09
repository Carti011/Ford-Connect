# ADR 018 — Ambiente de desenvolvimento local com banco local

## Status

Aceito

## Contexto

Durante a Sprint 1, o fluxo de teste era: fazer alteração → push → merge na `main` → aguardar deploy no Railway → testar no Expo Go. Esse ciclo é lento e arriscado — código não validado chegava à `main` para ser testado.

O `docker-compose.yml` já tinha PostgreSQL 16 (ARM64) configurado, mas estava sendo ignorado em favor do banco Neon no Railway.

## Decisão

Testar localmente antes de qualquer merge na `main`.

- `docker-compose up -d postgres` sobe o PostgreSQL local (container `ford_app_db`, porta 5432)
- `backend/dev.sh` — script com variáveis de ambiente locais (banco local, JWT secret de dev); executa `./mvnw spring-boot:run`
- `backend/dev.sh` está no `.gitignore` — não é commitado
- `mobile/.env.local` aponta para `http://<IP-local-do-Mac>:8080` em vez da URL do Railway
- IP usado: `10.0.0.117` (rede local atual) — atualizar se a rede mudar (`ipconfig getifaddr en0`)
- Railway e Neon continuam sendo produção; só recebem código já validado localmente

## Consequências

- Ciclo de feedback imediato: alteração → `bash backend/dev.sh` → teste no Expo Go
- Banco local isolado do Neon — migrations e seeds rodam sem risco para os dados de produção
- Expo Go em dispositivo físico requer Mac e celular na mesma rede Wi-Fi
- IP do Mac pode mudar ao trocar de rede — variável a ser verificada quando o ambiente não conectar
