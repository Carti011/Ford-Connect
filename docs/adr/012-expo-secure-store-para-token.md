# ADR 012 — expo-secure-store para armazenamento seguro de token e veiculoId

## Status

Aceito

## Contexto

O app mobile precisa persistir o token JWT entre sessões para manter o usuário autenticado sem exigir novo login a cada abertura. Além do token, o `veiculoId` também precisa ser persistido para que as telas saibam qual veículo carregar.

A alternativa mais simples é o `AsyncStorage` (React Native), que armazena dados em texto puro no disco do dispositivo. Isso é inaceitável para credenciais: um token JWT exposto permite que qualquer processo com acesso ao sistema de arquivos se autentique como o usuário.

A disciplina de Cybersecurity exige que dados sensíveis sejam protegidos adequadamente no dispositivo.

## Decisão

Usar **expo-secure-store** para persistir token JWT e `veiculoId`. O `expo-secure-store` usa o **Keychain** no iOS e o **Keystore** no Android — mecanismos nativos do sistema operacional que protegem os dados com criptografia vinculada ao dispositivo. Dados armazenados não são acessíveis a outros aplicativos nem aparecem em backups não criptografados.

As chaves de armazenamento são constantes exportadas de `services/api.ts`:
- `ford_jwt_token` — token JWT
- `ford_veiculo_id` — UUID do veículo do usuário

## Consequências

- Token e veiculoId ficam protegidos por criptografia nativa — atende o requisito de Cybersecurity
- `expo-secure-store` exige acesso nativo — não funciona no simulador web, mas funciona em Expo Go (iOS/Android)
- O hook `useAuth` verifica o token no SecureStore na inicialização — sessão é restaurada automaticamente sem nova autenticação
- Limite de tamanho por valor: 2048 bytes no iOS — suficiente para JWTs padrão
- Em testes unitários, o SecureStore é substituído por um mock em memória (`__mocks__/expo-secure-store.ts`) — sem dependência de APIs nativas nos testes
