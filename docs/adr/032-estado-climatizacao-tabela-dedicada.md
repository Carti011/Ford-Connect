# ADR 032 — Estado de climatização em tabela dedicada com sensores mockados no endpoint

## Status

Aceito

## Contexto

A tela `climatizacao` controla quatro estados principais (sistema ligado/desligado, temperatura alvo de 16°C a 30°C, modo entre A/C, aquecedor e desembaçador, velocidade do ventilador de 1 a 6) além de zonas independentes (motorista e passageiro, cada uma com temperatura e flag de ativação). Até então todos esses estados eram puramente locais no React Native — nada persistia no backend.

Era preciso decidir três coisas antes de modelar:

1. **Onde guardar** — colunas em `veiculos` (seguindo o padrão do ADR 029 para preferências) ou tabela dedicada
2. **Como representar as zonas** — colunas fixas (`temp_motorista`, `temp_passageiro`) ou tabela filha 1:N
3. **De onde vêm as temperaturas interna e externa** — persistir no banco ou mockar no endpoint

Para o item 1, a comparação foi:

- **Colunas em `veiculos`**: simples, mas mistura "estado corrente do sistema de climatização" com atributos físicos/identitários do veículo (marca, ano, placa). O ADR 029 já adicionou quatro colunas booleanas; mais sete ou oito colunas de clima inflariam demais a entidade
- **Tabela dedicada `estado_climatizacao`**: separa claramente "configuração corrente de um subsistema do veículo" da entidade `Veiculo`. Abre espaço para evoluir (ex: histórico de mudanças, eventos) sem mexer em `veiculos`

Para o item 2, zonas fixas seriam mais simples no curto prazo, mas amarram a modelagem em duas zonas para sempre. Tabela filha resolve quando aparecer pickup com 4 zonas ou cabines com zona traseira.

Para o item 3, temperatura interna e externa são leituras de sensores físicos, não decisões do usuário. Persistir o último valor lido no banco só faria sentido com integração real ao veículo — coisa que não existe no Sprint 1.

## Decisão

A migração V9 cria duas tabelas:

- `estado_climatizacao` — 1:1 com `veiculos` (FK única). Contém `sistema_ligado`, `modo`, `velocidade_ventilador` e `atualizado_em`. CHECK constraints garantem ranges (`velocidade_ventilador` 1-6, `modo` em `ac|aquecedor|desembacador`).
- `zona_climatizacao` — N:1 com `estado_climatizacao`. Contém `rotulo`, `temperatura` (16-30°C), `ativa` e `ordem`.

Seed inicial cria um `estado_climatizacao` para o veículo do João com duas zonas (Motorista ativa, Passageiro inativa).

Três endpoints expõem o recurso, todos autenticados:

- `GET /api/veiculos/{idVeiculo}/climatizacao` — retorna estado + zonas + `temperaturaInterna` e `temperaturaExterna` (mockadas no service, fixas em 28°C e 31°C nesta sprint)
- `PATCH /api/veiculos/{idVeiculo}/climatizacao` — patch parcial (qualquer subset de `sistemaLigado`, `modo`, `velocidadeVentilador`), seguindo o padrão do ADR 028
- `PATCH /api/veiculos/{idVeiculo}/climatizacao/zonas/{idZona}` — patch parcial da zona (`temperatura` e/ou `ativa`); o discador da tela mobile aponta para a zona atualmente ativa

`modo` permanece como `String` validada por `@Pattern` no request, seguindo o padrão de `statusVeiculo` — evita o custo de enum + converter JPA para um vocabulário pequeno e estável.

## Consequências

- Entidade `Veiculo` não cresce
- Schema preparado para evoluir (ex: 4 zonas, eventos de mudança) sem migração disruptiva
- Sensores ficam como dívida técnica registrada na seção 12 do `CLAUDE.md`: quando houver integração real, `temperaturaInterna`/`temperaturaExterna` migram do service para leitura física, e pode fazer sentido criar tabela de histórico para gráficos/alertas
- Service precisa fazer uma busca extra para validar que a zona pertence ao veículo informado na URL (proteção contra IDOR — bug onde um usuário modificaria zona de outro veículo via URL forjada)
- Constraints CHECK no banco duplicam as validações Bean Validation no DTO — proposital: defesa em profundidade, banco continua íntegro mesmo se a camada Java for contornada
- A redundância entre temperatura global e temperatura por zona foi descoberta na integração mobile e resolvida no ADR 033 (drop do campo global via V10, discador edita a zona ativa)
