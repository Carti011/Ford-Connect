ALTER TABLE veiculos ADD COLUMN garantia_data_limite DATE;
ALTER TABLE veiculos ADD COLUMN garantia_km_limite INTEGER;

UPDATE veiculos
SET garantia_data_limite = '2026-10-18',
    garantia_km_limite = 30000
WHERE id = '22222222-2222-2222-2222-222222222222';
