# ADR 001 — PostgreSQL 16 no Neon

## Status

Aceito

## Contexto

O projeto precisa de um banco de dados relacional para armazenar veículos, histórico de manutenções e alertas de revisão. As entidades têm relacionamentos claros entre si (chaves estrangeiras) e o esquema é bem definido desde o início, o que favorece bancos relacionais sobre NoSQL. A infraestrutura precisa ser simples de configurar para um time pequeno em contexto acadêmico, sem custo de operação de servidor próprio.

Foram avaliadas as versões 16, 17 e 18 do PostgreSQL disponíveis no Neon. A versão 18 foi descartada por ser muito recente e potencialmente ter incompatibilidades com drivers JDBC. A versão 17, embora estável, tem menos histórico de suporte documentado com o ecossistema Spring Boot. A versão 16 apresenta o melhor equilíbrio entre maturidade e suporte.

## Decisão

Usar **PostgreSQL 16** hospedado no **Neon** como banco de dados principal. Para desenvolvimento local isolado, manter um container `postgres:16-alpine` via docker-compose.

## Consequências

- Banco serverless no Neon elimina a necessidade de gerenciar infraestrutura de banco em produção
- Versão 16 garante compatibilidade total com drivers JDBC, Spring Data JPA e Flyway
- O ambiente local Docker espelha a mesma versão do banco remoto, reduzindo divergências
- A conexão com Neon exige SSL (`sslmode=require`); o container local usa `sslmode=disable` — o `application.yml` lê essa variável do ambiente, tornando a troca transparente
- Neon oferece branch de banco de dados, útil para isolar testes em sprints futuras
