# ADR 039 — Endpoint público de reset da demo

## Status

Aceito

## Contexto

O app vai ser avaliado pelos professores na Sprint 1. Cada avaliador roda backend e mobile localmente, com o próprio banco PostgreSQL. A demonstração precisa de um **loop repetível**: o avaliador abre o app, agenda um serviço, vê a aba Manutenção mudar para o estado "confirmado" e, ao fechar e reabrir o app, encontra tudo zerado para agendar de novo.

Sem isso, o primeiro agendamento ficaria gravado para sempre — o segundo avaliador (ou o mesmo, num segundo teste) já encontraria a tela no estado "confirmado", sem conseguir reproduzir o fluxo desde o início.

Não há login por usuário na Sprint 1 (fica para sprints futuras, junto do cadastro). Portanto não dá para resetar "os dados daquele usuário" — o reset é global no banco.

## Decisão

Criar um endpoint **`POST /api/demo/resetar`**, público (sem autenticação), que restaura o estado de demonstração apagando todos os agendamentos de serviço (`agendamentos_servico` e a tabela de junção `agendamento_servico_recomendacoes`).

O app chama esse endpoint **uma vez a cada cold start** (abertura do zero, não retomada de segundo plano). Assim cada nova sessão começa limpa.

O escopo do reset é **apenas o agendamento de serviço**. Climatização, preferências do veículo e rotinas recorrentes não são tocadas — agendar serviço é o único fluxo do loop de demonstração, e o resto da seed nunca é modificado por ele.

O endpoint é público porque roda no boot do app, antes do login. Como cada avaliador usa o próprio banco local, não há risco de um avaliador apagar dados de outro.

## Consequências

- **Loop de demonstração funciona:** abrir → agendar → ver confirmado → fechar/reabrir → zerado.
- **Reset é global, não por usuário.** Aceitável porque cada avaliador tem o próprio banco. Quando o login por usuário entrar (sprint futura), o reset deixaria de fazer sentido como está — passaria a ser "resetar os dados de teste do usuário X" ou seria removido. Esta ADR fica como registro dessa dívida.
- **Endpoint público que apaga dados.** Em produção real isso seria inaceitável. É restrito ao contexto de demonstração da Sprint 1 com dados mockados e banco local. Não deve sobreviver à introdução de dados reais.
- **Não re-semeia nada.** Apagar os agendamentos basta: agendar nunca altera recomendações, garantia, score ou veículo, então o baseline da seed permanece intacto.
