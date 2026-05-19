# ADR 038 — Garantia ativa no escopo da aba de Manutenção

## Status

Aceito (substitui parcialmente a ADR 037, que excluía a garantia do MVP)

## Contexto

A ADR 037 documentou a decisão de manter **garantia ativa fora do escopo** do MVP. Naquele momento, a aba `vitals` era uma tela única misturando "estado do carro" e "ações de manutenção", e adicionar mais um card competiria por espaço com o resto.

Após a reestruturação que divide `vitals` em **Dashboard** (estado físico) e **Manutenção** (ações), a aba de Manutenção passou a ter espaço dedicado para construir o argumento de retenção. Sem garantia visível, o pitch perde o gancho mais forte:

> "Maria não voltou pra fazer a revisão dos 10 mil. Sua garantia vence em 5 meses. Se acontecer algum problema entre hoje e lá, a Ford não cobre — porque a revisão obrigatória ficou em aberto."

Sem garantia no app, o banner de "revisão atrasada" é só um lembrete genérico. Com garantia, vira ameaça concreta de perda financeira para o cliente.

## Decisão

Trazer garantia para dentro do MVP como **dois campos diretos** na entidade `Veiculo`:

```sql
ALTER TABLE veiculos ADD COLUMN garantia_data_limite DATE;
ALTER TABLE veiculos ADD COLUMN garantia_km_limite INTEGER;
```

Migration V17. Seed atualizado para o cenário do pitch: garantia vence em 18/10/2026, com limite de 30.000 km.

`VeiculoResponse` expõe `garantiaDataLimite` e `garantiaKmLimite`. Mobile lê via `buscarVeiculo` (sem endpoint novo) e renderiza um `CartaoGarantia` na aba Manutenção.

**Estado do cartão derivado em runtime no mobile**:
- **Normal**: garantia ativa, sem recomendações obrigatórias atrasadas → card neutro mostrando data + km restantes.
- **Risco**: garantia ativa porém com pelo menos uma recomendação obrigatória com status `atrasada` → card destacado em vermelho com aviso "Garantia em risco. Revisão obrigatória pendente pode levar à perda de cobertura."

A regra do estado fica no mobile porque é apresentação. O backend não precisa saber dessa lógica.

## Consequências

- **O pitch ganha o gatilho de urgência mais forte**: medo concreto de perder cobertura, não só "preste atenção".
- **Modelagem segue simples**: dois campos no veículo, sem entidade nova de "histórico de garantia". Para sprint posterior, se precisar suportar garantia estendida ou múltiplas coberturas, a refatoração é uma nova ADR e tabela `garantias`.
- **ADR 037 fica desatualizada nesta parte**: continua válida como registro histórico, mas a decisão atual sobre garantia é esta.
- **Reuso direto do `buscarVeiculo`**: sem endpoint novo, sem service novo. Mobile só precisa renderizar.
- **Sem migração de dados existentes**: os dois campos novos começam NULL para qualquer registro antigo. O seed do veículo do pitch é o único que recebe valor real.
