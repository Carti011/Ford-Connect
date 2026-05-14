ALTER TABLE agendamentos_veiculo
    ADD COLUMN dias_semana VARCHAR(20)
        CHECK (dias_semana IN ('DIARIAMENTE', 'DIAS_UTEIS', 'FINS_DE_SEMANA'));

UPDATE agendamentos_veiculo SET dias_semana = 'DIAS_UTEIS' WHERE tipo = 'motor';
UPDATE agendamentos_veiculo SET dias_semana = 'DIAS_UTEIS' WHERE tipo = 'clima';
