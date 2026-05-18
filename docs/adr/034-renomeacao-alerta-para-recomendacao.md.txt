# ADR 034 — Renomeação de Alerta para Recomendação e enriquecimento de campos

## Status

Aceito

## Contexto

A entidade `AlertaRevisao` foi criada na V1 para representar revisões pendentes no veículo. Hoje ela tem `titulo`, `descricao`, `dataLimite`, `quilometragemLimite`, `prioridade` (baixa|media|alta) e `resolvido`. O endpoint correspondente é `GET /api/veiculos/{id}/alertas` e o serviço é `AlertaService`.

A ADR 023 já tinha removido a tela de alertas no mobile e unificado a comunicação com o usuário em outras superfícies. O modelo continuou no backend porque a feature seguia existindo conceitualmente.

Agora a aba `vitals` está sendo reposicionada como o coração do pitch: um painel de **ações recomendadas de manutenção** — o que precisa fazer, quando, se é obrigatório, e quanto custa. A palavra "alerta" sugere notificação passiva e momentânea; "recomendação" reflete melhor o que a feature representa: uma sugestão acionável com prazo, prioridade e custo estimado.

Junto da renomeação, três campos novos passam a ser necessários para fechar o cenário do pitch:

- **`tipo`** — `revisao` | `troca` | `inspecao`. Diferencia uma revisão programada de uma troca de item específico ou de uma inspeção visual. Permite ícones e copys distintos.
- **`obrigatoria`** — boolean. Distingue revisão obrigatória (que afeta garantia) de troca recomendada (que não afeta). Sem isso o usuário não tem como saber o que é cobrança da rede oficial e o que é cuidado opcional.
- **`custoMin` e `custoMax`** — faixa de custo estimada. Reduz o "medo do preço" que faz o cliente migrar para o mecânico do bairro.

Além disso, o DTO precisa de um campo derivado `status` (`atrasada` | `proxima` | `em_dia`) calculado em runtime cruzando `dataLimite` com hoje e `quilometragemLimite` com a quilometragem atual do veículo.

## Decisão

**1. Renomeação completa, do banco ao mobile.**

- Tabela `alertas_revisao` → `recomendacoes` (V11 com `ALTER TABLE ... RENAME TO`).
- Entidade `AlertaRevisao` → `Recomendacao`. Pacote `model`.
- Repository `AlertaRevisaoRepository` → `RecomendacaoRepository`.
- Service `AlertaService` → `RecomendacaoService`.
- Controller `AlertaController` → `RecomendacaoController`.
- DTO `AlertaRevisaoResponse` (se existia) → `RecomendacaoResponse`.
- Endpoint `GET /api/veiculos/{id}/alertas` → `GET /api/veiculos/{id}/recomendacoes`.
- Service mobile `services/alerta.ts` → `services/recomendacao.ts`.
- Tipo TypeScript `AlertaRevisao` → `Recomendacao` em `types/index.ts`.

**2. Quatro colunas novas em `recomendacoes`** (todas adicionadas em V11):

```sql
ALTER TABLE recomendacoes ADD COLUMN tipo VARCHAR(30);
ALTER TABLE recomendacoes ADD COLUMN obrigatoria BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE recomendacoes ADD COLUMN custo_min NUMERIC;
ALTER TABLE recomendacoes ADD COLUMN custo_max NUMERIC;
```

V11 também atualiza os registros do seed existente da V2 atribuindo valores coerentes para tipo, obrigatoriedade e faixa de custo. V15 finalizará o ajuste do cenário do pitch.

**3. Campo derivado `status` no DTO.** Não persistido. Calculado no `RecomendacaoService` na hora de montar a resposta, cruzando:

- `dataLimite` < hoje **ou** `quilometragemLimite` < km atual do veículo → `atrasada`
- diferença até `dataLimite` ≤ 30 dias **ou** diferença em km ≤ 2000 → `proxima`
- demais → `em_dia`

A ordenação retornada pela API segue urgência: atrasada → próxima → em_dia.

## Consequências

- **Churn pontual e contido:** o rename atravessa backend e mobile mas é mecânico. Acontece num único PR.
- **V2 fica histórica:** o nome `alertas_revisao` aparece em V2 e isso fica como referência histórica. Bancos novos rodam V1 (cria a tabela antiga) → V2 (semeia) → V11 (renomeia + adiciona colunas). Bancos existentes rodam só V11 a partir de agora.
- **Flag de obrigatoriedade trava narrativa:** o pitch da Maria depende de mostrar "revisão dos 10mil obrigatória, garantia em risco". Sem `obrigatoria`, esse argumento não existe na UI.
- **Faixa de custo é faixa, não valor único:** propositalmente. Concessionária real tem variação, e oferecer um valor único transmite falsa precisão. Min e max conversam com a copy "R$ 480 a R$ 620".
- **Status derivado em vez de coluna:** evita drift entre data salva e estado atual. Custo: o cálculo roda toda vez que a recomendação é retornada. Performance aceitável dado o tamanho da lista (3 a 6 itens por veículo).
- **ADR 023 fica completa:** aquela ADR derrubou a tela. Esta termina o trabalho no modelo.
