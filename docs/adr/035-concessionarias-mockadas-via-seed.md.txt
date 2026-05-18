# ADR 035 — Concessionárias mockadas via seed com distância como coluna fixa

## Status

Aceito

## Contexto

O dashboard da aba `vitals` precisa mostrar a "concessionária mais próxima" com um botão de agendamento. Para o pitch, o que importa é a experiência: o usuário abre o app, vê uma concessionária próxima, toca em "Agendar". Isso fecha o ciclo "saber o que → onde → agendar".

Três caminhos foram pensados para resolver isso:

1. **Geolocalização real** — pedir permissão de GPS no mobile, capturar lat/lng do usuário, ter coordenadas reais das concessionárias no banco e calcular distância por Haversine no backend.
2. **Mockar lat/lng** — armazenar coordenadas fictícias no banco e ainda assim calcular distância via Haversine, simulando o futuro.
3. **Distância direto como coluna** — gravar `distancia_km INTEGER` fixo na tabela, ordenar por essa coluna no `GET`. Zero matemática, zero GPS.

A regra do projeto (ADR 007) é que **dados são mockados via seed** na Sprint 1. O esforço de geolocalização real (permissão de GPS, edge cases de denied, fallback para localização inferida do IP) não agrega ao pitch — agrega quando integrarmos com o sistema real da Ford.

## Decisão

Adotar a opção 3: `distancia_km INTEGER` como coluna fixa em `concessionarias`. Sem GPS, sem Haversine, sem coordenadas.

Schema (V13):

```sql
CREATE TABLE concessionarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(200) NOT NULL,
  cidade VARCHAR(80) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  telefone VARCHAR(20),
  distancia_km INTEGER NOT NULL
);
```

Seed:

| Nome | Distância |
| ---- | --------- |
| Ford Lapa | 4 km |
| Ford Tatuapé | 8 km |
| Ford Morumbi | 12 km |
| Ford Santo Amaro | 15 km |

Endpoint: `GET /api/concessionarias` retorna todas ordenadas por `distancia_km ASC`. O mobile pega o primeiro item como "mais próxima".

## Consequências

- **Demo determinística:** Ford Lapa sempre é a mais próxima. O pitch nunca quebra por GPS desligado, por simulador iOS sem localização, por permissão negada.
- **Zero dependência de runtime do dispositivo:** funciona idêntico em iOS, Android e Expo Go. Importante porque a banca pode pedir pra demonstrar em qualquer simulador.
- **Migração para o futuro é direta:** quando houver geolocalização real, a coluna `distancia_km` é trocada por `latitude` e `longitude` numa migração posterior. O endpoint passa a calcular Haversine com base no lat/lng do usuário (recebido via header ou query). A assinatura da API muda pouco.
- **Não cabem regras de "concessionária autorizada para esse modelo"** nesta sprint. Todas as concessionárias do seed atendem qualquer veículo. Se virar requisito, vira sprint posterior com tabela de relacionamento.
- **Consistente com ADR 007 e ADR 032:** este projeto trata "mock via seed" como pilar do MVP, não como atalho.
