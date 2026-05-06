# ADR 003 — Controle de versão do banco com Flyway

## Status

Aceito

## Contexto

O banco de dados precisa ser criado e populado de forma reproduzível em qualquer ambiente — local, Docker ou Neon. A disciplina de Java/Web Services exige controle de versão do banco como parte dos critérios de avaliação. Sem uma ferramenta de migration, o schema precisaria ser criado manualmente a cada novo ambiente, o que é propenso a erros e difícil de auditar.

O Spring Boot possui integração nativa com Flyway e Liquibase. Flyway foi escolhido por ter uma curva de aprendizado menor, trabalhar com SQL puro (sem abstração adicional) e ser o padrão mais comum em projetos Spring Boot acadêmicos e profissionais.

## Decisão

Usar **Flyway** para versionamento do schema do banco. As migrations ficam em `src/main/resources/db/migration/` com nomenclatura sequencial:

- `V1__criar_tabelas.sql` — criação das tabelas `veiculos`, `registros_manutencao` e `alertas_revisao`
- `V2__seed_dados.sql` — dados mockados para a Sprint 1

O Flyway roda automaticamente na inicialização do Spring Boot antes de qualquer requisição.

## Consequências

- O schema é versionado junto com o código — qualquer checkout do repositório reproduz o estado correto do banco
- Novos ambientes (local, Docker, Neon) são inicializados automaticamente sem intervenção manual
- Migrations são imutáveis após execução — alterações no schema exigem uma nova migration (nunca editar migrations já aplicadas)
- O seed de dados mockados (`V2`) é suficiente para a Sprint 1; dados reais ou geração automática de alertas ficam para sprints futuras
- `baseline-on-migrate: true` está configurado para compatibilidade com bancos que já existam no Neon
