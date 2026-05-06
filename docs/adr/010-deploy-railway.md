# ADR 010 — Deploy do backend no Railway

## Status

Aceito

## Contexto

O app mobile em produção (e durante desenvolvimento com Expo Go em dispositivo físico) precisa de uma URL pública para acessar a API. O backend não pode ser servido apenas localmente.

Foram consideradas as opções: **Heroku**, **Render**, **Fly.io** e **Railway**. Heroku removeu o plano gratuito. Render tem cold start lento no plano gratuito. Fly.io exige configuração de CLI e regiões mais complexa. Railway oferece deploy direto do GitHub com Dockerfile, variáveis de ambiente via painel, domínio gerado automaticamente e plano gratuito adequado para MVP acadêmico.

## Decisão

Fazer o deploy do backend no **Railway** conectando o repositório GitHub. O Railway detecta o `Dockerfile` em `/backend` e faz o build automaticamente a cada push na branch configurada. O banco de dados de produção é o **Neon** (PostgreSQL 16) — o Railway não gerencia o banco, apenas o serviço Spring Boot.

URL pública gerada: `https://ford-connect-production.up.railway.app`

## Consequências

- Deploy automático a cada push — sem etapa manual de build ou upload
- Variáveis de ambiente (credenciais Neon, JWT secret) configuradas no painel do Railway, nunca no repositório
- A URL `ford-connect.railway.internal` é o endereço de rede privada interna — não acessível externamente, irrelevante para o projeto atual com um único serviço
- O plano gratuito do Railway tem limite de horas de execução mensais — suficiente para Sprint 1 e avaliação acadêmica
- Se o projeto evoluir para produção real, Railway seria substituído por uma plataforma com SLA e suporte a escalabilidade horizontal
