# ADR 025 — Tela de trava com fluxo de confirmação direcional e countdown

## Status

Aceito

## Contexto

Os botões "Travar" e "Destravar" na Home precisavam de uma tela de feedback ao usuário. A primeira abordagem implementada permitia alternar entre os dois estados dentro da mesma tela (toggle), o que gerava ambiguidade: o usuário poderia destravar o carro ao acessar pela ação de travar.

## Decisão

A tela `trava.tsx` opera em modo estritamente direcional, determinado pelo parâmetro `acao` recebido na navegação:

- `acao=travar` → exibe confirmação verde "Tudo trancado". O único CTA ("Concluído") e o botão "X" navegam para a Home via `router.replace('/(tabs)')`. Não há forma de destravar a partir desta tela.
- `acao=destravar` → exibe confirmação laranja "Portas destravadas" com countdown de 30 segundos. Ao expirar, a tela navega automaticamente para a Home. O CTA "Travar agora" e o "X" também retornam à Home imediatamente.

O countdown de 30 segundos simula o comportamento real de veículos modernos que re-travam automaticamente caso nenhuma porta seja aberta.

## Consequências

- Cada ponto de entrada tem exatamente uma ação possível, eliminando ambiguidade
- O usuário nunca pode executar a ação inversa acidentalmente a partir da tela de confirmação
- Para destravar um veículo travado (ou vice-versa), é necessário voltar à Home e usar o botão correto — fluxo intencional e mais seguro
- O countdown é puramente cosmético na Sprint 1 (sem integração real com o veículo)
