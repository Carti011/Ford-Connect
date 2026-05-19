-- veiculo passa para 12.000 km, autonomia ajustada e score do cenario do pitch
UPDATE veiculos
SET quilometragem = 12000,
    autonomia_km = 480,
    nivel_combustivel = 60,
    score_saude = 78
WHERE id = '22222222-2222-2222-2222-222222222222';

-- limpa recomendacoes existentes do seed antigo
DELETE FROM recomendacoes WHERE veiculo_id = '22222222-2222-2222-2222-222222222222';

-- novas recomendacoes alinhadas ao cenario do pitch
INSERT INTO recomendacoes
    (veiculo_id, titulo, descricao, data_limite, quilometragem_limite, prioridade, resolvido, tipo, obrigatoria, custo_min, custo_max)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão dos 10.000 km',
        'Revisão obrigatória da garantia. Inclui troca de óleo, filtros e checagem completa.',
        '2026-03-14',
        10000,
        'alta',
        FALSE,
        'revisao',
        TRUE,
        480,
        620
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Troca de pastilha de freio dianteiro',
        'Pastilha próxima do limite de desgaste. Substituição recomendada nos próximos 2.000 km.',
        '2026-06-01',
        13500,
        'media',
        FALSE,
        'troca',
        FALSE,
        280,
        420
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Alinhamento e balanceamento',
        'Recomendado realizar para preservar pneus e direção. Sem urgência no momento.',
        '2026-12-01',
        20000,
        'baixa',
        FALSE,
        'inspecao',
        FALSE,
        120,
        180
    );
