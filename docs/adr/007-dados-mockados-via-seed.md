# ADR 007 — Dados mockados via Flyway seed na Sprint 1

## Status

Aceito

## Contexto

O Ford Connect depende de dados reais de veículos, histórico de manutenções e alertas de revisão para funcionar. Na Sprint 1, não há integração com sistemas reais da Ford nem dataset disponível. O app precisa mostrar dados plausíveis para validação de interface, fluxo de autenticação e demonstração acadêmica.

Foram consideradas três abordagens:
1. Dados hardcoded nos serviços Java
2. Script SQL separado rodado manualmente
3. Migration Flyway dedicada ao seed (`V2`)

A opção 1 mistura lógica de negócio com dados de teste. A opção 2 exige execução manual em cada ambiente novo. A opção 3 é reproduzível, versionada e roda automaticamente junto com o schema.

## Decisão

Criar uma migration Flyway `V2__seed_dados_mockados.sql` com dados fixos representando um usuário real (João Silva), um veículo Ford Ranger 2022 com 47.350 km, 4 revisões na rede oficial e 3 alertas pendentes. Os UUIDs do seed são fixos e conhecidos, o que simplifica os testes automatizados e o desenvolvimento do mobile.

## Consequências

- Qualquer ambiente novo (local, Docker, Railway, CI) sobe com dados funcionais sem intervenção manual
- Os UUIDs fixos do seed (`11111111-...` para usuário, `22222222-...` para veículo) são usados diretamente nos testes e no mobile
- A migration V2 é imutável — para alterar os dados mockados, uma nova migration V3 seria necessária
- Dados simulados são suficientes para a Sprint 1; integração com dados reais da Ford fica para sprints futuras
- A senha do usuário seed está armazenada como hash BCrypt — nunca em texto plano
