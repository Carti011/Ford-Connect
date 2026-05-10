# ADR 024 — Discador circular de temperatura com SVG e PanResponder

## Status

Aceito

## Contexto

A tela de climatização exige um controle de temperatura com interação por arrastar — semelhante a um termostato circular. As alternativas avaliadas foram:

1. **Slider nativo do React Native** — linear, não atende ao design circular
2. **Biblioteca de terceiros** (react-native-circular-slider, etc.) — dependência extra, risco de incompatibilidade com Expo managed workflow e SDK 54
3. **SVG + PanResponder** — react-native-svg já estava instalado no projeto; PanResponder é API nativa sem dependências adicionais

## Decisão

Implementar o discador inteiramente com `react-native-svg` (arco, gradiente, marcadores e handle) e `PanResponder` para captura de toque. A posição do handle é calculada convertendo coordenadas de toque em ângulo polar em relação ao centro do SVG, mapeando o ângulo para a faixa de temperatura (16°C–30°C).

O gradiente do arco usa `LinearGradient` SVG com `gradientUnits="userSpaceOnUse"`, produzindo a transição azul → roxo → rosa ao longo do arco de 270°.

O componente `Discador` é isolado com prop `onChange` e ref interna para o callback, evitando re-criação do PanResponder a cada render.

## Consequências

- Zero dependências novas; reaproveita bibliotecas já presentes
- Funciona no Expo Go sem dev build
- A interpolação angular é uma aproximação: em ângulos muito próximos dos extremos do arco (zona de gap inferior) o toque é fixado ao mínimo ou máximo por heurística de distância
- Animações de alta frequência no handle rodam na thread JS (não na UI thread), o que é aceitável dado que o componente não realiza animações contínuas
