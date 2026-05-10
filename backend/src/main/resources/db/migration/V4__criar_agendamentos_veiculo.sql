CREATE TABLE agendamentos_veiculo (
    id        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID        NOT NULL REFERENCES veiculos(id),
    tipo      VARCHAR(50)  NOT NULL,
    rotulo    VARCHAR(150) NOT NULL,
    hora      VARCHAR(5),
    ativo     BOOLEAN      NOT NULL DEFAULT FALSE
);

INSERT INTO agendamentos_veiculo (veiculo_id, tipo, rotulo, hora, ativo)
SELECT
    v.id,
    dados.tipo,
    dados.rotulo,
    dados.hora,
    dados.ativo
FROM veiculos v
CROSS JOIN (VALUES
    ('motor',   'Ligar o motor · Dias úteis',      '07:30', TRUE),
    ('clima',   'Climatização automática',          '08:00', FALSE),
    ('revisao', 'Lembrete de revisão pendente',     NULL,    TRUE)
) AS dados(tipo, rotulo, hora, ativo)
WHERE v.placa = 'BRA2E19';
