import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormularioLogin } from '../components/FormularioLogin';
import { useAuth } from '../hooks/useAuth';

export default function TelaLogin() {
  const { entrar } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(email: string, senha: string) {
    setCarregando(true);
    setErro(null);
    try {
      await entrar(email, senha);
    } catch {
      setErro('E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={estilos.tela}>
      <View style={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <View style={estilos.logoContainer}>
            <Text style={estilos.logoTexto}>FORD</Text>
          </View>
          <Text style={estilos.titulo}>Ford Connect</Text>
          <Text style={estilos.subtitulo}>Acesse sua conta para ver seu veículo</Text>
        </View>
        <FormularioLogin onSubmit={handleSubmit} carregando={carregando} erro={erro} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 32,
  },
  cabecalho: {
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#003478',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
