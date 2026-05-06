# ADR 009 — React Native com Expo para o app mobile

## Status

Aceito

## Contexto

O app mobile precisa rodar em iOS e Android a partir de uma única base de código. A disciplina de Mobile Development exige o uso de React Native com Expo. A escolha de Expo sobre React Native CLI puro e a versão do SDK precisavam ser definidas.

Expo oferece duas abordagens: **Expo Go** (app sandbox, sem ejeção) e **Expo bare workflow** (acesso nativo completo, similar ao CLI puro). Para a Sprint 1, que não usa nenhum módulo nativo customizado (câmera, biometria, Bluetooth), o Expo Go é suficiente e elimina a necessidade de configurar Xcode e Android Studio para builds nativas.

## Decisão

Usar **React Native + Expo SDK** (versão estável mais recente) com **Expo Router** para navegação baseada em arquivos. A estrutura de rotas segue o padrão file-based do Expo Router:

```
app/
├── (tabs)/
│   ├── index.tsx       ← Home
│   ├── history.tsx     ← Histórico
│   └── alerts.tsx      ← Alertas
└── _layout.tsx
```

Chamadas à API são centralizadas em `services/` — nenhuma tela faz fetch diretamente.

## Consequências

- Expo Router elimina configuração manual de navegação — rotas são derivadas da estrutura de arquivos
- Expo Go permite testar em dispositivo físico sem build nativa — reduz o ciclo de feedback durante desenvolvimento
- Sem acesso a APIs nativas customizadas sem ejeção — aceitável para Sprint 1
- Notificações push (Sprint 2) exigirão Expo Notifications, que funciona dentro do ecossistema Expo sem ejeção
- A URL da API é configurada via variável de ambiente `EXPO_PUBLIC_API_URL` — a troca entre local e Railway é feita sem alterar código
