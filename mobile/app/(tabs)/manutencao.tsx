import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { BellIcon } from '../../components/icons';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { layout } from '../../constants/layout';

export default function TelaManutencao() {
  const router = useRouter();

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={estilos.topChrome}>
          <Image
            source={require('../../assets/images/logo-ford.png')}
            style={estilos.logo}
          />
          <Pressable
            onPress={() => router.push('/notificacoes')}
            style={estilos.avatarBtn}
          >
            <BellIcon size={20} color={colors.text} />
          </Pressable>
        </SafeAreaView>

        <View style={estilos.header}>
          <Text style={estilos.subtitulo}>Plano de cuidados</Text>
          <Text style={estilos.titulo}>Manutenção</Text>
        </View>

        <View style={estilos.placeholderBox}>
          <Text style={estilos.placeholderTitulo}>Em construção</Text>
          <Text style={estilos.placeholderSub}>
            Aqui vão chegar o score de saúde do veículo, o cartão de garantia, suas recomendações com prazo e custo, e o caminho até a concessionária mais próxima.
          </Text>
        </View>

        <View style={{ height: layout.tabbarHeight }} />
      </ScrollView>
    </View>
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
  topChrome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  titulo: {
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: Math.round(typography.size['3xl'] * typography.lineHeight.snug),
  },
  placeholderBox: {
    marginHorizontal: spacing[6],
    padding: spacing[5],
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing[2],
  },
  placeholderTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  placeholderSub: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});
