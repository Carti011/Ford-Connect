# ADR 029 — Preferências de pré-aquecimento como atributos globais do veículo

## Status

Aceito

## Contexto

A tela `agendar` mostra uma seção "OPÇÕES" com quatro switches: climatização automática, desembaçar para-brisa, banco do motorista aquecido e notificar quando pronto. Na primeira versão, esses switches eram puro estado local da tela. Era preciso decidir onde persistir essas configurações no backend.

Duas modelagens foram avaliadas:

1. **Colunas booleanas em `agendamentos_veiculo`** — cada agendamento (motor, clima, revisão) teria seu próprio conjunto de opções. Modelo flexível, mas com cara de overengineering: o dono do carro raramente quer "banco aquecido só na agendar das terças".
2. **Colunas booleanas em `veiculos`** — preferências valem para o veículo todo, qualquer pré-aquecimento agendado as respeita. Modelo mais simples e alinhado com como o dono pensa ("eu gosto de banco aquecido", não "eu gosto de banco aquecido entre 7:00 e 7:10 às terças").

Em conversa com o usuário (decisão de produto), ficou claro que essas opções são preferências do dono do carro, não de um evento específico. Banco aquecido configurado uma vez deve valer para todas as partidas.

## Decisão

A migração V8 adiciona quatro colunas `BOOLEAN NOT NULL DEFAULT` em `veiculos`:

- `climatizacao_automatica` (default TRUE)
- `desembacar_parabrisa` (default TRUE)
- `banco_aquecido` (default FALSE)
- `notificar` (default TRUE)

Um endpoint dedicado `PATCH /api/veiculos/{id}/preferencias` aceita um body parcial com qualquer subset dessas quatro. O `VeiculoResponse` (GET `/api/veiculos/{id}`) passa a serializar as quatro para que a tela `agendar` carregue as preferências junto com os outros dados do veículo.

No mobile, os switches da seção OPÇÕES são dirigidos por `veiculo[chave]` (não estado local) e cada toque dispara o PATCH otimisticamente.

## Consequências

- Modelo mais simples: quatro colunas em `veiculos`, sem tabela auxiliar
- Endpoint dedicado evita inflar o `PATCH /api/veiculos/{id}` (que poderia mexer em qualquer campo do veículo)
- Se no futuro fizer sentido ter opções específicas por agendamento (ex: "essa partida não notifica"), a modelagem aceita evoluir com colunas opcionais em `agendamentos_veiculo` que sobrescrevem as do veículo (padrão "override")
- A próxima partida da Home não usa essas opções no cálculo — elas afetam o comportamento real do veículo no momento da partida, fora do escopo do mock atual
