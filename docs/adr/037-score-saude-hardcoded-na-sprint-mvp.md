# ADR 037 — Score de saúde do veículo como coluna fixa no seed (Sprint MVP)

## Status

Aceito

## Contexto

O dashboard da `vitals` ganha um indicador de "saúde do veículo" no topo: um número de 0 a 100 com label (ex.: `Score 78/100 — Atenção`). É o elemento visual que abre o pitch e dá razão para o usuário voltar ao app.

Três caminhos para gerar esse score:

1. **Cálculo em runtime** — `SaudeService` aplica regras simples sobre o estado atual: penalidade por recomendação atrasada, penalidade por garantia vencendo, bonus por histórico recente na rede oficial. Score é sempre coerente com os dados atuais do veículo.
2. **Coluna fixa no banco** — `score_saude INTEGER` em `veiculos`, valor vem do seed, sem service que calcule. O número não muda mesmo se as recomendações mudarem.
3. **Modelo de ML treinado** — usa histórico, padrões e dados de frota para gerar um score preditivo real.

Para a Sprint 1, com 10 dias de prazo e o foco em **provar a experiência**, calcular em runtime adiciona complexidade que não muda o pitch. As regras precisam ser pensadas, testadas, calibradas. E o número que aparece na tela durante a demo precisa ser exatamente 78 — porque o pitch da Maria fala "Score 78/100, Atenção". Cálculo runtime exigiria garantir que o seed produzisse exatamente esse valor pela combinação de regras, o que é mais frágil do que simplesmente armazenar 78.

ML está fora completamente — é roadmap de longo prazo.

## Decisão

Adotar a opção 2 para a Sprint MVP: coluna `score_saude` em `veiculos`, valor 78 no seed.

V12:

```sql
ALTER TABLE veiculos ADD COLUMN score_saude INTEGER;
UPDATE veiculos SET score_saude = 78;
```

`Veiculo.java` ganha campo `scoreSaude` (Integer, nullable). `VeiculoResponse` expõe `scoreSaude` no `GET /api/veiculos/{id}`. Nenhum endpoint novo. Nenhum service de score.

O label que aparece com o número (`Atenção`, `Bom`, `Crítico`) é decidido pelo mobile com base na faixa:

- 0–40 → Crítico (vermelho)
- 41–70 → Atenção (amarelo)
- 71–100 → Bom (verde)

Essa lógica fica no mobile porque é pura formatação de UI.

## Consequências

- **Demo determinística:** o pitch fala "Score 78" e o app sempre mostra 78. Independente de quantas recomendações estão no seed, do estado da garantia, da quilometragem.
- **Score não responde a ações do usuário no MVP:** se o usuário resolver uma recomendação (não tem UI pra isso ainda) o score não muda. Aceitável porque não há ação que mude o estado do veículo na Sprint 1 — tudo é read-only do ponto de vista do estado de saúde.
- **Caminho claro para a próxima sprint:** trocar a fonte por um `SaudeService` que calcule. A assinatura do response não muda (`scoreSaude: int`), só passa a vir de cálculo. Mobile não precisa mexer.
- **Não é honesto chamar isso de "score de saúde" depois do MVP** sem a substituição pelo cálculo. Esta ADR registra a dívida.
- **Consistente com ADR 007:** seed é a fonte de verdade no MVP.
