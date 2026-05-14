ALTER TABLE agendamentos_veiculo
    ADD COLUMN duracao_minutos    INTEGER,
    ADD COLUMN alvo_temperatura   INTEGER;

UPDATE agendamentos_veiculo
SET duracao_minutos = 10, alvo_temperatura = 22
WHERE tipo = 'motor';
