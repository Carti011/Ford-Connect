ALTER TABLE veiculos
    ADD COLUMN climatizacao_automatica BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN desembacar_parabrisa    BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN banco_aquecido          BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN notificar               BOOLEAN NOT NULL DEFAULT TRUE;
