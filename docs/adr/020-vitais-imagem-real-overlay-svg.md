# ADR 020 — Tela Vitais: imagem real do veículo e overlay SVG para pressão dos pneus

## Status

Aceito

## Contexto

A tela Vitais (dashboard de diagnóstico) precisava de uma vista superior do veículo para exibir a pressão dos quatro pneus de forma visual e intuitiva. O handoff original usava uma silhueta SVG simplificada (`TruckTopSilhouette`) construída com formas geométricas básicas.

Adicionalmente, o usuário forneceu uma fotografia real do Ford Ranger visto de cima, com fundo transparente (`Ford-Cima.webp`, 467×879 px). A questão era como conectar os badges de pressão aos pneus de forma visualmente limpa.

## Decisão

**Imagem real em vez de silhueta SVG:**
- A fotografia real (`ranger-topo.webp`) substitui a silhueta geométrica.
- A imagem é exibida com largura configurável como fração da tela (`containerW * 0.50` por padrão), calculando altura automaticamente para preservar a proporção 467:879.
- É centralizada horizontalmente, deixando espaço nas laterais para os badges.

**SVG overlay para as linhas de conexão:**
- Um componente `Svg` de `react-native-svg` é posicionado com `StyleSheet.absoluteFill` sobre a imagem.
- Quatro elementos `Line` conectam o centro de cada badge ao centro estimado do pneu correspondente.
- As posições dos pneus são definidas por constantes `PNEU` (frações x/y da imagem renderizada), fáceis de ajustar sem tocar na lógica.
- `pointerEvents="none"` no SVG garante que os toques passem para os elementos abaixo.

**Separação entre constantes de ajuste e lógica:**
- `PNEU` (objeto no topo do arquivo) concentra todos os offsets de posição dos pneus.
- `imgW = containerW * 0.50` controla o tamanho da imagem.
- `bW`, `bH`, `bGap` controlam dimensão e posição dos badges.
- Qualquer ajuste fino é feito nessas constantes, sem entender o restante do componente.

## Consequências

**Melhora:**
- Visual muito mais premium e reconhecível do que a silhueta genérica.
- Linhas de conexão criam uma associação direta entre número e pneu, algo que listas de texto não conseguem.
- Fácil de ajustar: mudar `PNEU.dtEsq.x` move a ponta da linha sem afetar nada mais.
- Responsivo: todo o cálculo usa `useWindowDimensions`, adaptando para qualquer tamanho de tela.

**Piora / pendente:**
- As posições dos pneus (`PNEU`) são estimativas visuais — não vêm de metadados da imagem. Podem precisar de ajuste fino após teste em dispositivo físico.
- Dados de pressão, vida útil do óleo e fluido limpador são placeholder (Sprint 1). O backend não expõe esses dados ainda — ficam para Sprint 2 com integração real ao veículo.
- A imagem `ranger-topo.webp` é específica do Ranger. Para outros modelos (Bronco, Maverick) será necessário imagem equivalente ou fallback para a silhueta SVG.
