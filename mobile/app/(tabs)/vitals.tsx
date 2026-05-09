import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable,
  ActivityIndicator, StyleSheet, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Rect, Path, Line, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { buscarVeiculo } from '../../services/veiculo';
import { buscarAlertas } from '../../services/alerta';
import { BellIcon, CaretIcon, OilIcon, WiperIcon } from '../../components/icons';
import { Veiculo } from '../../types';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { layout } from '../../constants/layout';

// dados placeholder — backend não expõe vitals na Sprint 1
const VITALS = {
  pressaoDianteira: 32,
  pressaoTraseira: 32,
  vidaUtilOleo: 90,
  autonomiaOleo: 300,
  fluidoLimpador: 'Boa',
};

function TruckTopView() {
  return (
    <Svg width={100} height={196} viewBox="0 0 100 196">
      <Defs>
        <LinearGradient id="ttd" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#1F2A3A" />
          <Stop offset="0.5" stopColor="#2A3648" />
          <Stop offset="1" stopColor="#1F2A3A" />
        </LinearGradient>
      </Defs>
      {/* corpo */}
      <Rect x="0" y="8" width="100" height="180" rx="14" fill="url(#ttd)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* para-brisa frontal */}
      <Path d="M 8 36 L 92 36 L 86 64 L 14 64 Z" fill="rgba(0,0,0,0.45)" />
      {/* teto cabine */}
      <Rect x="14" y="64" width="72" height="34" fill="rgba(255,255,255,0.04)" />
      {/* vidro traseiro cabine */}
      <Path d="M 14 98 L 86 98 L 92 108 L 8 108 Z" fill="rgba(0,0,0,0.4)" />
      {/* caçamba */}
      <Rect x="6" y="108" width="88" height="74" rx="3" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      {/* divisórias caçamba */}
      <Line x1="10" y1="128" x2="90" y2="128" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <Line x1="10" y1="148" x2="90" y2="148" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <Line x1="10" y1="168" x2="90" y2="168" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </Svg>
  );
}

function BadgePressao({ valor, estilo }: { valor: number; estilo: object }) {
  return (
    <View style={[estilos.badgePressao, estilo]}>
      <Text style={estilos.badgePressaoTexto}>{valor}</Text>
    </View>
  );
}

function CardVital({
  icone, pct, label, sub,
}: {
  icone: React.ReactNode;
  pct?: string;
  label: string;
  sub: string;
}) {
  return (
    <View style={estilos.vitalCard}>
      <View style={estilos.vitalCardTopo}>
        {icone}
        {pct && <Text style={estilos.vitalPct}>{pct}</Text>}
      </View>
      <Text style={estilos.vitalLabel}>{label}</Text>
      <Text style={estilos.vitalSub}>{sub}</Text>
    </View>
  );
}

export default function TelaVitais() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!idVeiculo) { setCarregando(false); return; }
    setCarregando(true);
    setErro(null);
    try {
      const [veiculoDados, alertasDados] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarAlertas(idVeiculo),
      ]);
      setVeiculo(veiculoDados);
      setTotalAlertas(alertasDados.length);
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

  const modeloTexto = veiculo ? `${veiculo.marca} ${veiculo.modelo}` : '—';
  const kmFormatado = veiculo?.quilometragem
    ? veiculo.quilometragem.toLocaleString('pt-BR')
    : '—';

  const tituloAlerta = totalAlertas === 0
    ? 'Nenhum alerta\nativo'
    : totalAlertas === 1
      ? '1 alerta\nativo'
      : `${totalAlertas} alertas\nativos`;

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
          <Text style={estilos.subtitulo}>{modeloTexto}</Text>
          <Text style={estilos.titulo}>{tituloAlerta}</Text>
        </View>

        {/* odômetro */}
        <View style={estilos.odometroSecao}>
          <Text style={estilos.odometroLabel}>Odômetro</Text>
          <Text style={estilos.odometroValor}>{kmFormatado} km</Text>
        </View>

        {/* erro */}
        {erro && (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        )}

        {/* vista top do caminhão com badges de pressão */}
        <View style={estilos.truckContainer}>
          <View style={estilos.truckSvgWrapper}>
            <TruckTopView />
          </View>
          <BadgePressao valor={VITALS.pressaoDianteira} estilo={estilos.badgeTopEsq} />
          <BadgePressao valor={VITALS.pressaoDianteira} estilo={estilos.badgeTopDir} />
          <BadgePressao valor={VITALS.pressaoTraseira} estilo={estilos.badgeBotEsq} />
          <BadgePressao valor={VITALS.pressaoTraseira} estilo={estilos.badgeBotDir} />
        </View>

        {/* legenda pressão */}
        <Text style={estilos.pressaoLegenda}>
          {'Pressão ideal dos pneus frios:\n'}
          <Text style={estilos.pressaoLegendaDestaque}>
            {`Dianteira ${VITALS.pressaoDianteira} · Traseira ${VITALS.pressaoTraseira}`}
          </Text>
        </Text>

        {/* cards vitais */}
        <View style={estilos.vitaisGrid}>
          <CardVital
            icone={<OilIcon size={18} color={colors.ok} />}
            pct={`${VITALS.vidaUtilOleo}%`}
            label="Vida útil do óleo"
            sub={`${VITALS.autonomiaOleo} km autonomia`}
          />
          <CardVital
            icone={<WiperIcon size={18} color={colors.ok} />}
            label="Fluido limpador"
            sub={VITALS.fluidoLimpador}
          />
        </View>

        {/* programação da manutenção */}
        <View style={estilos.manutencaoSecao}>
          <Text style={estilos.manutencaoTitulo}>Programação da manutenção</Text>
          <Pressable
            style={({ pressed }) => [estilos.manutencaoRow, pressed && estilos.manutencaoRowPressed]}
          >
            <Text style={estilos.manutencaoLabel}>Plano de manutenção</Text>
            <CaretIcon size={14} color={colors.textDim} />
          </Pressable>
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
    paddingBottom: spacing[3],
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
    lineHeight: Math.round(typography.size['3xl'] * typography.lineHeight.tight),
  },

  // odômetro
  odometroSecao: {
    alignItems: 'center',
    paddingVertical: spacing[5],
  },
  odometroLabel: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[1],
  },
  odometroValor: {
    fontSize: 28,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    letterSpacing: -0.4,
  },

  // truck top
  truckContainer: {
    position: 'relative',
    height: 220,
    marginHorizontal: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  truckSvgWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // badges de pressão
  badgePressao: {
    position: 'absolute',
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.ok,
  },
  badgePressaoTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.ok,
  },
  badgeTopEsq: { top: 24, left: 20 },
  badgeTopDir: { top: 24, right: 20 },
  badgeBotEsq: { bottom: 24, left: 20 },
  badgeBotDir: { bottom: 24, right: 20 },

  // legenda pressão
  pressaoLegenda: {
    textAlign: 'center',
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    lineHeight: Math.round(typography.size.sm * typography.lineHeight.normal),
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
  },
  pressaoLegendaDestaque: {
    color: colors.text,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
  },

  // grid vitais
  vitaisGrid: {
    flexDirection: 'row',
    marginHorizontal: spacing[6],
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  vitalCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
  },
  vitalCardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  vitalPct: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.ok,
  },
  vitalLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
    marginBottom: spacing[1],
  },
  vitalSub: {
    fontSize: typography.size.xs,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },

  // manutenção
  manutencaoSecao: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  manutencaoTitulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginBottom: spacing[3],
  },
  manutencaoRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  manutencaoRowPressed: {
    backgroundColor: colors.surfaceHi,
  },
  manutencaoLabel: {
    fontSize: typography.size.base,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },

  // erro
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
