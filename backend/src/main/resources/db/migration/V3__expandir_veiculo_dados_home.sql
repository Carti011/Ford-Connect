ALTER TABLE veiculos
    ADD COLUMN status_veiculo   VARCHAR(50) NOT NULL DEFAULT 'Estacionado',
    ADD COLUMN nivel_combustivel INTEGER    NOT NULL DEFAULT 80,
    ADD COLUMN autonomia_km      INTEGER    NOT NULL DEFAULT 400;

UPDATE veiculos
SET status_veiculo    = 'Estacionado',
    nivel_combustivel = 80,
    autonomia_km      = 400
WHERE placa = 'BRA2E19';
