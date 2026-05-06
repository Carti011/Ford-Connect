# ADR 006 — Sem Lombok: construtores e getters/setters manuais

## Status

Aceito

## Contexto

Lombok é uma biblioteca amplamente usada em projetos Java para eliminar boilerplate gerado por construtores, getters, setters e builders via anotações como `@Data`, `@Getter`, `@AllArgsConstructor`. Em projetos Spring Boot, seu uso é praticamente padrão.

A decisão de não usar Lombok é uma preferência explícita do desenvolvedor responsável pelo projeto. O código gerado por Lombok é invisível no fonte — o que torna mais difícil rastrear problemas em entidades JPA, identificar qual construtor está sendo chamado e entender o comportamento de objetos sem depender da IDE.

## Decisão

**Lombok não será utilizado** em nenhuma parte do projeto. Construtores, getters e setters são escritos manualmente em todas as entidades, DTOs e objetos de valor.

## Consequências

- O código é explícito e legível sem plugin de IDE — qualquer editor mostra exatamente o que está disponível na classe
- Entidades JPA com construtores manuais tornam intencional a distinção entre o construtor padrão (exigido pelo Hibernate) e construtores de negócio
- DTOs de resposta usam o padrão de factory method estático `de(Entidade entidade)` para encapsular a conversão sem depender de biblioteca externa
- O volume de código nas classes de modelo é maior — cada entidade nova exige escrever todos os métodos manualmente
- Sem `@Builder` — a criação de objetos complexos é feita via construtores ou factory methods explícitos
