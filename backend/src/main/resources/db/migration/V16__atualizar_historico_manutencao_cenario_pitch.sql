-- limpa historico antigo da V2 (km 10k a 40k) que conflita com o veiculo agora em 12k
DELETE FROM registros_manutencao WHERE veiculo_id = '22222222-2222-2222-2222-222222222222';

-- novo historico coerente com o cenario do pitch (Ranger 8 meses, 12.000 km, revisao dos 10k atrasada)
INSERT INTO registros_manutencao
    (veiculo_id, tipo, descricao, quilometragem_no_servico, data_servico, concessionaria, custo)
VALUES
    (
        '22222222-2222-2222-2222-222222222222',
        'Entrega técnica (PDI)',
        'Inspeção de entrega: nivelamento de fluidos, calibragem de pneus, configuração de chave e revisão estética.',
        10,
        '2025-10-15',
        'Ford Lapa — São Paulo/SP',
        NULL
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Troca de palhetas e lavagem detalhada',
        'Substituição das palhetas dianteiras e lavagem técnica externa e interna.',
        3500,
        '2025-12-10',
        'Ford Lapa — São Paulo/SP',
        80.00
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Instalação de protetor de cárter',
        'Acessório original Ford instalado para proteção do motor em uso urbano e estradas.',
        6500,
        '2026-02-05',
        'Ford Lapa — São Paulo/SP',
        240.00
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Vistoria de pintura (garantia)',
        'Avaliação de pequenos pontos de pintura. Reparo coberto pela garantia de fábrica.',
        9000,
        '2026-04-08',
        'Ford Lapa — São Paulo/SP',
        NULL
    );
