import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';

interface Props {
  onSubmit: (email: string, senha: string) => void;
  carregando: boolean;
  erro: string | null;
}

export function FormularioLogin({ onSubmit, carregando, erro }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailFocado, setEmailFocado] = useState(false);
  const [senhaFocado, setSenhaFocado] = useState(false);

  function handleSubmit() {
    if (!email.trim() || !senha.trim()) return;
    onSubmit(email, senha);
  }

  return (
    <View style={estilos.container}>
      <View>
        <Text style={estilos.label}>E-mail</Text>
        <TextInput
          style={[estilos.input, emailFocado && estilos.inputFocado, !!erro && estilos.inputErro]}
          placeholder="E-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setEmailFocado(true)}
          onBlur={() => setEmailFocado(false)}
        />
      </View>

      <View style={{ marginTop: spacing[3] }}>
        <Text style={estilos.label}>Senha</Text>
        <TextInput
          style={[estilos.input, senhaFocado && estilos.inputFocado, !!erro && estilos.inputErro]}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          onFocus={() => setSenhaFocado(true)}
          onBlur={() => setSenhaFocado(false)}
        />
      </View>

      {erro && <Text style={estilos.erro}>{erro}</Text>}

      <Pressable
        style={({ pressed }) => [
          estilos.botao,
          pressed && estilos.botaoPressionado,
        ]}
        onPress={handleSubmit}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator testID="indicador-carregando" color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Entrar</Text>
        )}
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    marginBottom: spacing[2],
    letterSpacing: typography.letterSpacing.loose,
  },
  input: {
    height: 54,
    paddingHorizontal: spacing[4],
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: typography.size.base,
    color: colors.text,
  },
  inputFocado: {
    borderColor: colors.accent,
  },
  inputErro: {
    borderColor: colors.danger,
  },
  erro: {
    color: colors.danger,
    fontSize: typography.size.sm,
    marginTop: spacing[2],
  },
  botao: {
    marginTop: spacing[6],
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  botaoPressionado: {
    backgroundColor: colors.accentPressed,
    transform: [{ scale: 0.98 }],
  },
  textoBotao: {
    color: '#fff',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },
});
