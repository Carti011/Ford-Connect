import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface Props {
  onSubmit: (email: string, senha: string) => void;
  carregando: boolean;
  erro: string | null;
}

export function FormularioLogin({ onSubmit, carregando, erro }: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function handleSubmit() {
    if (!email.trim() || !senha.trim()) return;
    onSubmit(email, senha);
  }

  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      {erro && <Text style={estilos.erro}>{erro}</Text>}
      <TouchableOpacity style={estilos.botao} onPress={handleSubmit} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator testID="indicador-carregando" color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  erro: {
    color: '#DC2626',
    fontSize: 14,
  },
  botao: {
    backgroundColor: '#003478',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
