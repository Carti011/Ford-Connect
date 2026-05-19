CREATE TABLE concessionarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    telefone VARCHAR(20),
    distancia_km INTEGER NOT NULL
);

INSERT INTO concessionarias (nome, endereco, cidade, estado, telefone, distancia_km)
VALUES
    ('Ford Lapa', 'Av. Antártica, 1500', 'São Paulo', 'SP', '(11) 3030-1100', 4),
    ('Ford Tatuapé', 'Av. Celso Garcia, 4500', 'São Paulo', 'SP', '(11) 2090-2200', 8),
    ('Ford Morumbi', 'Av. Giovanni Gronchi, 3200', 'São Paulo', 'SP', '(11) 3580-3300', 12),
    ('Ford Santo Amaro', 'Av. Adolfo Pinheiro, 2100', 'São Paulo', 'SP', '(11) 5180-4400', 15);
