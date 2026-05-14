-- a temperatura passa a ser editada por zona; o discador da tela controla a zona ativa
-- (ver ADR 032 - seção de revisão)
ALTER TABLE estado_climatizacao DROP COLUMN temperatura;
