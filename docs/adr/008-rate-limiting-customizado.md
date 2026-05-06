# ADR 008 — Rate limiting com filtro customizado

## Status

Aceito

## Contexto

A API precisa de proteção básica contra abuso e força bruta, especialmente no endpoint de login. Rate limiting é um dos requisitos da disciplina de Cybersecurity embutida no projeto.

Foram consideradas três abordagens:
1. Biblioteca dedicada como **Bucket4j** com integração Spring
2. **Spring Cloud Gateway** com filtros de rate limiting
3. **Filtro customizado** `OncePerRequestFilter` com janela deslizante em memória

Bucket4j é robusto mas adiciona dependência externa e configuração não trivial para um MVP. Spring Cloud Gateway é adequado para arquiteturas de microserviços — desnecessário aqui. Um filtro customizado simples cobre o requisito da Sprint 1 sem adicionar complexidade.

## Decisão

Implementar `RateLimitingFilter` como `OncePerRequestFilter` com **janela deslizante em memória** usando `ConcurrentHashMap<String, List<Long>>`. Limite de **60 requisições por minuto por IP**. O IP é resolvido respeitando o header `X-Forwarded-For` para compatibilidade com proxies reversos (Railway, nginx). Retorna HTTP 429 com mensagem em português.

## Consequências

- Zero dependências externas — implementação contida em uma classe
- Funciona para a Sprint 1 e cobre o requisito de Cybersecurity
- Estado em memória: o contador é reiniciado a cada restart da aplicação e não é compartilhado entre instâncias
- Não adequado para deploy com múltiplas instâncias — nesse cenário, Bucket4j com Redis seria o caminho correto
- A lista de timestamps cresce durante a janela e é limpa a cada requisição — sem leak de memória para volumes normais de tráfego
- Para volumes altos, um `ConcurrentHashMap` crescendo indefinidamente (um entry por IP único) pode ser um problema — aceitável para Sprint 1
