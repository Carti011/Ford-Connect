# ADR 021 — Correção de case sensitivity no CI e naming de jobs obrigatórios

## Status

Aceito

## Contexto

Dois bugs distintos quebraram o CI durante a Sprint 1, ambos invisíveis no macOS e só aparentes no Ubuntu (Linux) do GitHub Actions.

### Bug 1 — Case sensitivity em nome de arquivo

O arquivo `mobile/constants/Colors.ts` foi criado com `C` maiúsculo (padrão do template Expo). Em algum momento, o código passou a importar como `'../constants/colors'` (minúsculo). No macOS (filesystem HFS+/APFS case-insensitive), o import resolvia `Colors.ts` sem erro. No Linux (ext4, case-sensitive), o módulo simplesmente não existia.

O bug ficou mascarado localmente porque `npx tsc --noEmit` e `npm test` passavam no Mac. No CI, o Jest quebrava com:

```
Cannot find module '../constants/colors' from 'components/FormularioLogin.tsx'
```

A causa raiz foi identificada comparando `git ls-tree main --name-only` com `git ls-tree develop --name-only`: o arquivo estava rastreado como `Colors.ts` no git, não como `colors.ts`.

### Bug 2 — Renomear job invalida check obrigatório

Ao renomear o job de `Mobile — TypeScript` para `Mobile — Testes e TypeScript`, o check registrado na branch protection da `main` deixou de receber status. O GitHub ficou esperando indefinidamente por `Mobile — TypeScript`, enquanto o job novo (`Mobile — Testes e TypeScript`) passava sem ser reconhecido como obrigatório.

## Decisão

**Bug 1 — Rename forçado no git:**

No macOS, `git mv Colors.ts colors.ts` não funciona porque o filesystem trata como o mesmo arquivo. A solução é o rename em dois passos:

```bash
git mv -f constants/Colors.ts constants/colors_temp.ts
git mv constants/colors_temp.ts constants/colors.ts
```

Isso força o git a registrar a mudança de case no índice, independente do filesystem subjacente.

**Bug 2 — Manter o nome do job consistente com a branch protection:**

O nome do job no `ci.yml` deve sempre bater exatamente com o nome cadastrado como required status check nas branch protection rules. Qualquer renomeação de job exige atualização simultânea nas configurações do repositório no GitHub (Settings → Branches → Branch protection rules → Required status checks).

Como alternativa mais segura ao renomear: manter o nome do job e alterar apenas os nomes dos steps internos, que não afetam a branch protection.

**Adição de testes Jest ao CI:**

O CI mobile passou a rodar também os testes Jest (`npm test -- --ci`), além do check de TypeScript. Isso foi o que revelou o bug de case sensitivity — o `tsc` passava mesmo sem o arquivo correto, porque a resolução de módulos do TypeScript e do Jest diferem em alguns cenários.

## Consequências

- Arquivos com nomes que diferem apenas em case devem ser renomeados via dois passos no git quando desenvolvendo no macOS
- Todo novo arquivo criado no mobile deve usar apenas letras minúsculas no nome — sem exceção
- Renomear um job do CI é uma operação de dois passos: `ci.yml` + branch protection rules no GitHub
- O CI mobile agora valida tanto TypeScript quanto Jest, dando cobertura mais real do que só a verificação de tipos
- A adição do `npm test` ao CI foi o que tornou o problema detectável automaticamente — sem ele, o bug só seria encontrado no dispositivo físico ou num ambiente Linux
