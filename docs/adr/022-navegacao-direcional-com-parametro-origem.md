# ADR 022 — Navegação direcional com parâmetro `origem` na tela de partida do motor

## Status

Aceito

## Contexto

A tela `iniciando-motor` é acessada de dois pontos distintos: o slide "Deslize para dar partida" na Home e o botão "Ligar o carro" dentro da tela de Localização. O comportamento esperado ao fechar a tela difere conforme a origem: ao vir da Home o usuário deve retornar à Home; ao vir da Localização, o botão "Cancelar partida" / "Desligar o carro" deve retornar à Localização, enquanto o botão "X" sempre vai à Home.

## Decisão

Passar o query param `origem=localizacao` na navegação feita a partir de `localizacao.tsx`. A tela `iniciando-motor` lê esse parâmetro via `useLocalSearchParams` e separa as duas ações em funções distintas:

- `fechar()` — sempre chama `router.replace('/(tabs)')`, usado pelo botão "X"
- `cancelar()` — verifica `origem`: se `localizacao`, chama `router.back()`; caso contrário, chama `router.replace('/(tabs)')`

## Consequências

- O comportamento de fechamento fica explícito e rastreável no parâmetro de URL, sem estado global
- Adicionar uma terceira origem no futuro requer apenas um novo valor de param e uma branch no `cancelar()`
- A tela mantém uma única implementação sem duplicação de código
