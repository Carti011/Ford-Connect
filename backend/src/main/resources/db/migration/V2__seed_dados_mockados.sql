-- usuario de teste: joao@fordconnect.com / ford@123
INSERT INTO usuarios (id, nome, email, senha)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'João Silva',
    'joao@fordconnect.com',
    '$2a$10$VCl8wvLqHI5cGplKmdeXbO/VxhqIM9SEo1B/BpnVpMJtwYJ1q3NHW'
);

-- veiculo do joao
INSERT INTO veiculos (id, usuario_id, nome_proprietario, marca, modelo, versao, ano, placa, quilometragem)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'João Silva',
    'Ford',
    'Ranger',
    'XLS 2.2 TDCi 4x4 AT',
    2022,
    'BRA2E19',
    47350
);

-- historico de manutencoes
INSERT INTO registros_manutencao (veiculo_id, tipo, descricao, quilometragem_no_servico, data_servico, concessionaria, custo)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão de 10.000 km',
        'Troca de óleo e filtro de óleo, verificação de fluidos, checagem de freios e pneus.',
        10000,
        '2022-11-15',
        'Ford Interlagos — São Paulo/SP',
        650.00
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão de 20.000 km',
        'Troca de óleo e filtro, filtro de ar, verificação de correia dentada e sistema de arrefecimento.',
        20000,
        '2023-05-20',
        'Ford Interlagos — São Paulo/SP',
        980.00
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão de 30.000 km',
        'Troca de óleo, filtros (ar, óleo e cabine), velas de ignição e alinhamento/balanceamento.',
        30000,
        '2023-11-08',
        'Ford Santo André — Santo André/SP',
        1420.00
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão de 40.000 km',
        'Troca de óleo e filtros, fluido de freio, verificação de suspensão e sistema de transmissão.',
        40000,
        '2024-06-14',
        'Ford Interlagos — São Paulo/SP',
        1750.00
    );

-- alertas de revisao pendentes
INSERT INTO alertas_revisao (veiculo_id, titulo, descricao, data_limite, quilometragem_limite, prioridade, resolvido)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão de 50.000 km',
        'Próxima revisão programada. Inclui troca de óleo, filtros, correia auxiliar e verificação completa do sistema de freios.',
        '2025-01-15',
        50000,
        'alta',
        FALSE
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Troca de pneus',
        'Pneus dianteiros com desgaste acima do recomendado. Verificar alinhamento e balanceamento após a troca.',
        '2024-12-31',
        NULL,
        'media',
        FALSE
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Revisão do sistema de arrefecimento',
        'Fluido de arrefecimento próximo da troca. Recomendado a cada 2 anos ou 40.000 km.',
        '2025-03-01',
        NULL,
        'baixa',
        FALSE
    );
