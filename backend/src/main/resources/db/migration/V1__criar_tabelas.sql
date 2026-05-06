CREATE TABLE usuarios (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    criado_em   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE veiculos (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id        UUID         NOT NULL REFERENCES usuarios(id),
    nome_proprietario VARCHAR(100) NOT NULL,
    marca             VARCHAR(50)  NOT NULL DEFAULT 'Ford',
    modelo            VARCHAR(100) NOT NULL,
    versao            VARCHAR(100),
    ano               INTEGER      NOT NULL,
    placa             VARCHAR(20),
    quilometragem     INTEGER,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE registros_manutencao (
    id                       UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id               UUID          NOT NULL REFERENCES veiculos(id),
    tipo                     VARCHAR(100)  NOT NULL,
    descricao                TEXT,
    quilometragem_no_servico INTEGER,
    data_servico             DATE          NOT NULL,
    concessionaria           VARCHAR(100),
    custo                    NUMERIC(10,2)
);

CREATE TABLE alertas_revisao (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id           UUID        NOT NULL REFERENCES veiculos(id),
    titulo               VARCHAR(100) NOT NULL,
    descricao            TEXT,
    data_limite          DATE,
    quilometragem_limite INTEGER,
    prioridade           VARCHAR(20)  NOT NULL DEFAULT 'media'
                             CHECK (prioridade IN ('baixa', 'media', 'alta')),
    resolvido            BOOLEAN      NOT NULL DEFAULT FALSE
);
