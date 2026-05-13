ALTER TABLE agendamentos_veiculo
    DROP CONSTRAINT IF EXISTS agendamentos_veiculo_dias_semana_check;

UPDATE agendamentos_veiculo SET dias_semana = '1,2,3,4,5'     WHERE dias_semana = 'DIAS_UTEIS';
UPDATE agendamentos_veiculo SET dias_semana = '0,6'            WHERE dias_semana = 'FINS_DE_SEMANA';
UPDATE agendamentos_veiculo SET dias_semana = '0,1,2,3,4,5,6' WHERE dias_semana = 'DIARIAMENTE';
