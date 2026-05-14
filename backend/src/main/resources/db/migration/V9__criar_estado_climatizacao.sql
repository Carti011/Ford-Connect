CREATE TABLE estado_climatizacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL UNIQUE REFERENCES veiculos(id) ON DELETE CASCADE,
    sistema_ligado BOOLEAN NOT NULL DEFAULT FALSE,
    temperatura INTEGER NOT NULL DEFAULT 22 CHECK (temperatura BETWEEN 16 AND 30),
    modo VARCHAR(20) NOT NULL DEFAULT 'ac' CHECK (modo IN ('ac', 'aquecedor', 'desembacador')),
    velocidade_ventilador INTEGER NOT NULL DEFAULT 4 CHECK (velocidade_ventilador BETWEEN 1 AND 6),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE zona_climatizacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estado_climatizacao_id UUID NOT NULL REFERENCES estado_climatizacao(id) ON DELETE CASCADE,
    rotulo VARCHAR(50) NOT NULL,
    temperatura INTEGER NOT NULL CHECK (temperatura BETWEEN 16 AND 30),
    ativa BOOLEAN NOT NULL DEFAULT FALSE,
    ordem INTEGER NOT NULL
);

CREATE INDEX idx_zona_climatizacao_estado ON zona_climatizacao(estado_climatizacao_id);

-- seed do estado de climatizacao do veiculo do joao
INSERT INTO estado_climatizacao (id, veiculo_id, sistema_ligado, temperatura, modo, velocidade_ventilador)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    TRUE,
    22,
    'ac',
    4
);

INSERT INTO zona_climatizacao (estado_climatizacao_id, rotulo, temperatura, ativa, ordem)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'Motorista',  22, TRUE,  0),
    ('33333333-3333-3333-3333-333333333333', 'Passageiro', 20, FALSE, 1);
