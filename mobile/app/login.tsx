import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { FormularioLogin } from '../components/FormularioLogin';
import { FordConnectLogo } from '../components/icons/FordConnectLogo';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';

export default function TelaLogin() {
  const { entrar } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(email: string, senha: string) {
    Keyboard.dismiss();
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
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={estilos.conteudo} onPress={Keyboard.dismiss}>

            {/* seção superior */}
            <View>
              <LinearGradient
                colors={[colors.accent, colors.accentDeep]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={estilos.logoContainer}
              >
                <FordConnectLogo size={30} color="#fff" />
              </LinearGradient>
              <Text style={estilos.titulo}>{'Ford\nConnect'}</Text>
              <Text style={estilos.subtitulo}>Conecte, controle e personalize seu Ford</Text>
            </View>

            {/* seção central */}
            <View>
              <FormularioLogin onSubmit={handleSubmit} carregando={carregando} erro={erro} />
              <Pressable style={estilos.linkContainer}>
                <Text style={estilos.link}>Esqueceu sua senha?</Text>
              </Pressable>
            </View>

            {/* rodapé */}
            <Text style={estilos.rodape}>FIAP × FORD CHALLENGE 2026</Text>

          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: spacing[7],
    paddingTop: 60,
    paddingBottom: spacing[10],
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[7],
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.33,
    shadowRadius: 16,
    elevation: 16,
  },
  titulo: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: Math.round(typography.size['3xl'] * typography.lineHeight.tight),
    color: colors.text,
  },
  subtitulo: {
    marginTop: spacing[3],
    color: colors.textDim,
    fontSize: typography.size.base,
    fontFamily: 'Inter_400Regular',
    lineHeight: Math.round(typography.size.base * typography.lineHeight.normal),
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: spacing[5],
    paddingVertical: spacing[2],
  },
  link: {
    color: colors.textDim,
    fontSize: typography.size.md,
    fontFamily: 'Inter_400Regular',
  },
  rodape: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.size.xs,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1.5,
  },
});
