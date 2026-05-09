import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable,
  ActivityIndicator, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { buscarManutencoes } from '../../services/manutencao';
import { buscarVeiculo } from '../../services/veiculo';
import { BellIcon } from '../../components/icons';
import { RegistroManutencao, Veiculo } from '../../types';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { layout } from '../../constants/layout';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${parseInt(dia, 10)} ${MESES[parseInt(mes, 10) - 1]} ${ano}`;
}

function formatarKm(km: number): string {
  return km.toLocaleString('pt-BR');
}

function formatarCusto(custo: number | null): { texto: string; cortesia: boolean } {
  if (!custo) return { texto: 'Cortesia', cortesia: true };
  return {
    texto: custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    cortesia: false,
  };
}

function CardManutencao({ item }: { item: RegistroManutencao }) {
  const custo = formatarCusto(item.custo);
  return (
    <View style={estilos.card}>
      <View style={estilos.cardTopo}>
        <Text style={estilos.cardTipo} numberOfLines={2}>{item.tipo}</Text>
        <Text style={estilos.cardCusto}>{custo.texto}</Text>
      </View>
      {item.descricao ? (
        <Text style={estilos.cardDesc}>{item.descricao}</Text>
      ) : null}
      <View style={estilos.cardRodape}>
        <Text style={estilos.cardMeta}>{formatarData(item.dataServico)}</Text>
        <Text style={estilos.cardDot}>·</Text>
        <Text style={estilos.cardMeta}>{formatarKm(item.quilometragemNoServico)} km</Text>
        <Text style={estilos.cardDot}>·</Text>
        <Text style={estilos.cardMeta} numberOfLines={1}>{item.concessionaria}</Text>
      </View>
    </View>
  );
}

export default function TelaHistorico() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [manutencoes, setManutencoes] = useState<RegistroManutencao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!idVeiculo) { setCarregando(false); return; }
    setCarregando(true);
    setErro(null);
    try {
      const [veiculoDados, manutencoesDados] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarManutencoes(idVeiculo),
      ]);
      setVeiculo(veiculoDados);
      setManutencoes(manutencoesDados);
    } catch (e: any) {
      setErro(e?.response?.status === 401
        ? 'Sessão expirada. Faça login novamente.'
        : 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const totalInvestido = manutencoes.reduce((acc, m) => acc + (m.custo ?? 0), 0);
  const totalFormatado = totalInvestido > 0
    ? `R$ ${Math.round(totalInvestido).toLocaleString('pt-BR')}`
    : '—';

  const kmFormatado = veiculo?.quilometragem
    ? `${formatarKm(veiculo.quilometragem)} km`
    : '—';

  const subtitulo = [veiculo?.modelo ?? '—', kmFormatado].join(' · ');

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* top chrome */}
        <SafeAreaView edges={['top']} style={estilos.topChrome}>
          <Image source={require('../../assets/images/logo-ford.png')} style={estilos.logo} />
          <Pressable onPress={() => router.push('/alerts')} style={estilos.avatarBtn}>
            <BellIcon size={20} color={colors.text} />
          </Pressable>
        </SafeAreaView>

        {/* header */}
        <View style={estilos.header}>
          <Text style={estilos.subtitulo}>{subtitulo}</Text>
          <Text style={estilos.titulo}>Histórico</Text>
        </View>

        {/* card resumo */}
        <View style={estilos.resumoCard}>
          <View style={estilos.resumoLado}>
            <Text style={estilos.resumoLabel}>SERVIÇOS · 12 MESES</Text>
            <Text style={estilos.resumoValor}>
              {manutencoes.length} visita{manutencoes.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={estilos.resumoDivisor} />
          <View style={[estilos.resumoLado, estilos.resumoLadoDireita]}>
            <Text style={[estilos.resumoLabel, estilos.resumoLabelDireita]}>TOTAL INVESTIDO</Text>
            <Text style={[estilos.resumoValor, estilos.resumoValorDireita]}>{totalFormatado}</Text>
          </View>
        </View>

        {/* erro */}
        {erro ? (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        ) : (
          <View style={estilos.lista}>
            {manutencoes.length === 0 ? (
              <Text style={estilos.textoVazio}>Nenhuma manutenção registrada</Text>
            ) : (
              manutencoes.map(item => (
                <CardManutencao key={item.id} item={item} />
              ))
            )}
          </View>
        )}

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

  // top chrome
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

  // header
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

  // resumo
  resumoCard: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  resumoLado: {
    flex: 1,
  },
  resumoLadoDireita: {
    alignItems: 'flex-end',
  },
  resumoLabel: {
    fontSize: typography.size.xs,
    color: colors.textDim,
    fontFamily: 'Inter_500Medium',
    letterSpacing: typography.letterSpacing.loose,
    marginBottom: spacing[1],
  },
  resumoLabelDireita: {
    textAlign: 'right',
  },
  resumoValor: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.normal,
  },
  resumoValorDireita: {
    textAlign: 'right',
  },
  resumoDivisor: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },

  // lista
  lista: {
    paddingHorizontal: spacing[6],
  },

  // card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[3],
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  cardTipo: {
    flex: 1,
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    lineHeight: Math.round(typography.size.base * typography.lineHeight.snug),
  },
  cardCusto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.accent,
  },
  cardDesc: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: Math.round(typography.size.md * typography.lineHeight.normal),
    marginBottom: spacing[3],
  },
  cardRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  cardMeta: {
    fontSize: typography.size.sm,
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  cardDot: {
    fontSize: typography.size.sm,
    color: colors.borderStrong,
    fontFamily: 'Inter_400Regular',
  },

  // erro
  erroContainer: {
    marginHorizontal: spacing[6],
    marginTop: spacing[4],
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

  // vazio
  textoVazio: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_400Regular',
    paddingTop: spacing[10],
  },
});
