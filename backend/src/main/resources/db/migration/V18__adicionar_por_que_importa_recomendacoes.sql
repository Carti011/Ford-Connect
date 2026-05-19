ALTER TABLE recomendacoes ADD COLUMN por_que_importa TEXT;

UPDATE recomendacoes
SET por_que_importa = 'Sem essa revisão, o óleo perde viscosidade e o filtro satura. O motor passa a operar com proteção reduzida, acelerando o desgaste interno. Atrasar essa revisão também coloca a garantia de fábrica em risco.'
WHERE titulo = 'Revisão dos 10.000 km';

UPDATE recomendacoes
SET por_que_importa = 'Pastilhas no limite reduzem a eficiência da frenagem e podem danificar o disco. Esperar demais transforma uma troca simples em substituição de disco e pastilha, multiplicando o custo.'
WHERE titulo = 'Troca de pastilha de freio dianteiro';

UPDATE recomendacoes
SET por_que_importa = 'Sem alinhamento e balanceamento periódicos, os pneus desgastam de forma irregular e a direção fica desconfortável. Pneus mal alinhados podem precisar de troca antecipada.'
WHERE titulo = 'Alinhamento e balanceamento';
