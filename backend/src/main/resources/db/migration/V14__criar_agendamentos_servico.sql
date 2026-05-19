CREATE TABLE agendamentos_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    veiculo_id UUID NOT NULL REFERENCES veiculos(id),
    concessionaria_id UUID NOT NULL REFERENCES concessionarias(id),
    data_preferida DATE NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    observacoes TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE agendamento_servico_recomendacoes (
    agendamento_servico_id UUID NOT NULL REFERENCES agendamentos_servico(id) ON DELETE CASCADE,
    recomendacao_id UUID NOT NULL REFERENCES recomendacoes(id),
    PRIMARY KEY (agendamento_servico_id, recomendacao_id)
);
