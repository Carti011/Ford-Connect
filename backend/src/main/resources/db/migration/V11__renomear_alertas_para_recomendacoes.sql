-- renomeacao da tabela
ALTER TABLE alertas_revisao RENAME TO recomendacoes;

-- novas colunas
ALTER TABLE recomendacoes ADD COLUMN tipo VARCHAR(30);
ALTER TABLE recomendacoes ADD COLUMN obrigatoria BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE recomendacoes ADD COLUMN custo_min NUMERIC;
ALTER TABLE recomendacoes ADD COLUMN custo_max NUMERIC;

-- atribuir tipo e custos aos registros existentes do seed (V2)
UPDATE recomendacoes
SET tipo = 'revisao',
    obrigatoria = TRUE,
    custo_min = 850,
    custo_max = 1100
WHERE titulo = 'Revisão de 50.000 km';

UPDATE recomendacoes
SET tipo = 'troca',
    obrigatoria = FALSE,
    custo_min = 2400,
    custo_max = 3200
WHERE titulo = 'Troca de pneus';

UPDATE recomendacoes
SET tipo = 'inspecao',
    obrigatoria = FALSE,
    custo_min = 180,
    custo_max = 280
WHERE titulo = 'Revisão do sistema de arrefecimento';
