import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { buscarVeiculo } from '../../services/veiculo';
import { buscarRecomendacoes } from '../../services/recomendacao';
import { listarConcessionarias } from '../../services/concessionaria';
import { BellIcon } from '../../components/icons';
import { CartaoRecomendacao } from '../../components/CartaoRecomendacao';
import { CartaoConcessionaria } from '../../components/CartaoConcessionaria';
import { CartaoScoreSaude } from '../../components/CartaoScoreSaude';
import { CartaoGarantia } from '../../components/CartaoGarantia';
import { BannerAtrasada } from '../../components/BannerAtrasada';
import { CtaAgendarTotalizador } from '../../components/CtaAgendarTotalizador';
import { Veiculo, Recomendacao, Concessionaria } from '../../types';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { layout } from '../../constants/layout';

export default function TelaManutencao() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [concessionariaProxima, setConcessionariaProxima] =
    useState<Concessionaria | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!idVeiculo) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [veiculoDados, recomendacoesDados, concessionarias] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarRecomendacoes(idVeiculo),
        listarConcessionarias(),
      ]);
      setVeiculo(veiculoDados);
      setRecomendacoes(recomendacoesDados);
      setConcessionariaProxima(concessionarias[0] ?? null);
    } catch (e: any) {
      setErro(
        e?.response?.status === 401
          ? 'Sessão expirada. Faça login novamente.'
          : 'Não foi possível carregar os dados.',
      );
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const modeloTexto = veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '—';
  const score = veiculo?.scoreSaude ?? null;

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

        <View style={estilos.scoreSecao}>
          <CartaoScoreSaude score={score} modelo={modeloTexto} />
        </View>

        {veiculo ? (
          <View style={estilos.garantiaSecao}>
            <CartaoGarantia veiculo={veiculo} recomendacoes={recomendacoes} />
          </View>
        ) : null}

        {erro && (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        )}

        <View style={estilos.recomendacoesSecao}>
          <Text style={estilos.recomendacoesTitulo}>
            O que precisa fazer agora
          </Text>

          <BannerAtrasada
            recomendacoes={recomendacoes}
            onPress={() => router.push('/agendar-servico' as never)}
          />

          {recomendacoes.length === 0 ? (
            <Text style={estilos.recomendacoesVazio}>
              Nenhuma recomendação no momento. Seu veículo está em dia.
            </Text>
          ) : (
            <>
              <View style={estilos.recomendacoesLista}>
                {recomendacoes.map((rec) => (
                  <CartaoRecomendacao key={rec.id} recomendacao={rec} />
                ))}
              </View>
              <CtaAgendarTotalizador
                recomendacoes={recomendacoes}
                onPress={() => router.push('/agendar-servico' as never)}
              />
            </>
          )}
        </View>

        {concessionariaProxima ? (
          <View style={estilos.concessionariaSecao}>
            <Text style={estilos.concessionariaTitulo}>
              Concessionária mais próxima
            </Text>
            <CartaoConcessionaria
              concessionaria={concessionariaProxima}
              onAgendar={() => router.push('/agendar-servico' as never)}
            />
          </View>
        ) : null}

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
  centrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  scoreSecao: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
  },
  garantiaSecao: {
    paddingHorizontal: spacing[6],
    marginBottom: spacing[5],
  },
  recomendacoesSecao: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
    gap: spacing[3],
  },
  recomendacoesTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  recomendacoesLista: {
    gap: spacing[3],
  },
  recomendacoesVazio: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  concessionariaSecao: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
  },
  concessionariaTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginBottom: spacing[3],
  },
  erroContainer: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    alignItems: 'center',
    gap: spacing[2],
  },
  erroTexto: {
    color: colors.danger,
    fontSize: typography.size.sm,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  erroLink: {
    color: colors.accent,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_500Medium',
  },
});
