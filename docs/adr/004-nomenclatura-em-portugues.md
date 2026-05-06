# ADR 004 — Nomenclatura em português no código e banco de dados

## Status

Aceito

## Contexto

O projeto segue um padrão global de desenvolvimento em português definido nas diretrizes do time: nomes de variáveis, funções, classes, métodos, rotas, tabelas e colunas devem estar em português. Isso inclui o código Java (entidades, DTOs, serviços, controllers) e o schema do banco de dados (tabelas e colunas).

A maioria dos projetos Spring Boot usa nomenclatura em inglês por convenção do ecossistema. A decisão de usar português é intencional e reflete o contexto do time e do projeto acadêmico.

## Decisão

Toda nomenclatura do projeto — código e banco — será em **português**:

| Inglês (padrão do ecossistema) | Português (adotado no projeto) |
| ------------------------------ | ------------------------------ |
| `Vehicle` | `Veiculo` |
| `MaintenanceRecord` | `RegistroManutencao` |
| `ServiceAlert` | `AlertaRevisao` |
| `vehicles` | `veiculos` |
| `maintenance_records` | `registros_manutencao` |
| `service_alerts` | `alertas_revisao` |
| `owner_name` | `nome_proprietario` |
| `mileage` | `quilometragem` |
| `resolved` | `resolvido` |

Acentos são omitidos nos identificadores de código e banco (`Veiculo`, não `Veículo`) por compatibilidade com convenções de identificadores em Java e SQL.

## Consequências

- Consistência total entre código, banco e comunicação do time — sem necessidade de tradução mental entre camadas
- Tutoriais e documentação do ecossistema Spring Boot usam inglês — nomes de classes e métodos serão diferentes dos exemplos encontrados online
- Novos integrantes familiarizados com o padrão inglês precisarão se adaptar à nomenclatura do projeto
- Commits, comentários, mensagens de log e documentação seguem o mesmo padrão — tudo em português
