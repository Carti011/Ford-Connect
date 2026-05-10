import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useAuth } from '../hooks/useAuth';
import { buscarVeiculo } from '../services/veiculo';
import { Veiculo } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import {
  ChevronLeftIcon, ShareIcon, VehicleIcon, PowerIcon, PinIcon, CompassIcon,
} from '../components/icons';

// ─── dados mockados ───────────────────────────────────────────
const MOCK = {
  endereco:         'Av. Paulista, 1578',
  bairro:           'Bela Vista',
  cidade:           'São Paulo, SP',
  seguranca:        'SEGURO',
  distancia:        '4,8 km',
  chegada:          '14 min',
  tempoEstacionado: '1h 23min',
  lat:              -23.5613,
  lng:              -46.6565,
};

// ─── mapa SVG ─────────────────────────────────────────────────
function MapaSVG() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 390 320" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="52%" rx="20%" ry="14%">
          <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.35" />
          <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* fundo */}
      <Rect width="390" height="320" fill="#07101F" />

      {/* glow do veículo */}
      <Rect x="0" y="0" width="390" height="320" fill="url(#glow)" />

      {/* avenida principal (horizontal, levemente diagonal — Av. Paulista) */}
      <Path
        d="M -10 162 C 80 155 220 158 400 152"
        stroke="rgba(31,111,235,0.55)" strokeWidth="18" fill="none"
      />
      {/* faixa central tracejada */}
      <Path
        d="M -10 162 C 80 155 220 158 400 152"
        stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"
        strokeDasharray="18 14" fill="none"
      />

      {/* rua secundária perpendicular */}
      <Path
        d="M 192 -5 Q 194 160 196 325"
        stroke="rgba(80,110,150,0.28)" strokeWidth="10" fill="none"
      />
      <Path
        d="M 85 -5 Q 86 160 88 325"
        stroke="rgba(80,110,150,0.18)" strokeWidth="6" fill="none"
      />
      <Path
        d="M 305 -5 Q 307 160 310 325"
        stroke="rgba(80,110,150,0.18)" strokeWidth="6" fill="none"
      />

      {/* ruas horizontais secundárias */}
      <Path
        d="M -5 80 C 120 76 260 82 400 78"
        stroke="rgba(80,110,150,0.2)" strokeWidth="6" fill="none"
      />
      <Path
        d="M -5 248 C 120 244 260 250 400 246"
        stroke="rgba(80,110,150,0.2)" strokeWidth="6" fill="none"
      />

      {/* bloco superior esquerdo */}
      <Rect x="16"  y="18"  width="52" height="44" rx="5" fill="rgba(31,111,235,0.09)" />
      <Rect x="100" y="24"  width="68" height="32" rx="5" fill="rgba(80,110,150,0.1)" />
      <Rect x="220" y="14"  width="48" height="50" rx="5" fill="rgba(80,110,150,0.08)" />
      <Rect x="325" y="22"  width="55" height="38" rx="5" fill="rgba(31,111,235,0.07)" />

      {/* bloco inferior */}
      <Rect x="20"  y="266" width="52" height="44" rx="5" fill="rgba(80,110,150,0.1)" />
      <Rect x="108" y="278" width="66" height="36" rx="5" fill="rgba(80,110,150,0.08)" />
      <Rect x="234" y="270" width="50" height="46" rx="5" fill="rgba(31,111,235,0.08)" />
      <Rect x="328" y="262" width="52" height="48" rx="5" fill="rgba(80,110,150,0.1)" />

      {/* detalhes extra (ruelas) */}
      <Path d="M 20 115 L 70 115" stroke="rgba(80,110,150,0.14)" strokeWidth="3" fill="none" />
      <Path d="M 130 115 L 175 115" stroke="rgba(80,110,150,0.14)" strokeWidth="3" fill="none" />
      <Path d="M 215 115 L 278 115" stroke="rgba(80,110,150,0.14)" strokeWidth="3" fill="none" />
      <Path d="M 20 210 L 70 210" stroke="rgba(80,110,150,0.14)" strokeWidth="3" fill="none" />
      <Path d="M 315 210 L 375 210" stroke="rgba(80,110,150,0.14)" strokeWidth="3" fill="none" />
    </Svg>
  );
}

// ─── marker animado ───────────────────────────────────────────
function MarkerVeiculo({ modelo }: { modelo: string }) {
  const escala = useSharedValue(1);
  const opacidade = useSharedValue(0.7);

  useEffect(() => {
    escala.value = withRepeat(
      withSequence(
        withTiming(2.8, { duration: 1700, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
    opacidade.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1700, easing: Easing.out(Easing.ease) }),
        withTiming(0.7, { duration: 0 }),
      ),
      -1,
    );
  }, []);

  const anel = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
    opacity: opacidade.value,
  }));

  return (
    <View style={estilos.markerGroup} pointerEvents="none">
      {/* callout bubble */}
      <View style={estilos.callout}>
        <VehicleIcon size={15} color="#fff" />
        <View style={estilos.calloutTextos}>
          <Text style={estilos.calloutLinha1}>{modelo.toUpperCase()} · ESTACIONADO</Text>
          <Text style={estilos.calloutLinha2}>Há {MOCK.tempoEstacionado}</Text>
        </View>
      </View>
      {/* cauda */}
      <View style={estilos.calloutCauda} />

      {/* anel pulsante + dot */}
      <View style={estilos.dotWrap}>
        <Animated.View style={[estilos.anel, anel]} />
        <View style={estilos.dot} />
      </View>
    </View>
  );
}

// ─── tela ─────────────────────────────────────────────────────
export default function TelaLocalizacao() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [coords, setCoords] = useState({ lat: MOCK.lat, lng: MOCK.lng });

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    try { setVeiculo(await buscarVeiculo(idVeiculo)); } catch { /* silencioso */ }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  async function compartilhar() {
    try {
      await Share.share({
        message: `Localização do veículo:\n${MOCK.endereco}, ${MOCK.bairro}, ${MOCK.cidade}`,
        title: 'Localização do veículo',
      });
    } catch { /* silencioso */ }
  }

  function ligarCarro() {
    router.push(`/iniciando-motor?modelo=${encodeURIComponent(modelo)}&origem=localizacao`);
  }

  const modelo = veiculo?.modelo ?? 'Ranger';
  const latStr = `${coords.lat < 0 ? 'S' : 'N'} ${Math.abs(coords.lat).toFixed(4)}°`;
  const lngStr = `${coords.lng < 0 ? 'O' : 'L'} ${Math.abs(coords.lng).toFixed(4)}°`;

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />

      {/* header */}
      <SafeAreaView edges={['top']} style={estilos.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <ChevronLeftIcon size={20} color={colors.text} />
        </Pressable>
        <Text style={estilos.headerTitulo}>Localização</Text>
        <Pressable
          onPress={compartilhar}
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <ShareIcon size={19} color={colors.text} />
        </Pressable>
      </SafeAreaView>

      {/* mapa */}
      <View style={estilos.mapa}>
        <MapaSVG />

        {/* overlay de coordenadas */}
        <View style={estilos.coordsBadge} pointerEvents="none">
          <Text style={estilos.coordsTexto}>{latStr} · {lngStr}</Text>
        </View>

        {/* controles de zoom */}
        <View style={estilos.controles}>
          <View style={estilos.controleBtn}>
            <Text style={estilos.controleSimbolo}>+</Text>
          </View>
          <View style={[estilos.controleBtn, { marginTop: spacing[2] }]}>
            <Text style={estilos.controleSimbolo}>−</Text>
          </View>
          <View style={[estilos.controleBtn, { marginTop: spacing[2] }]}>
            <CompassIcon size={17} color={colors.text} />
          </View>
        </View>

        {/* marker centralizado */}
        <MarkerVeiculo modelo={modelo} />
      </View>

      {/* card de informações */}
      <View style={estilos.infoCard}>
        {/* endereço */}
        <View style={estilos.enderecoRow}>
          <View style={estilos.enderecoIcone}>
            <PinIcon size={18} color={colors.accent} />
          </View>
          <View style={estilos.enderecoTextos}>
            <Text style={estilos.enderecoRua}>{MOCK.endereco}</Text>
            <Text style={estilos.enderecoBairro}>{MOCK.bairro} · {MOCK.cidade}</Text>
          </View>
          <View style={estilos.seguroBadge}>
            <Text style={estilos.seguroTexto}>{MOCK.seguranca}</Text>
          </View>
        </View>

        {/* divisor */}
        <View style={estilos.divisor} />

        {/* stats */}
        <View style={estilos.statsRow}>
          <View style={estilos.stat}>
            <Text style={estilos.statLabel}>DISTÂNCIA</Text>
            <Text style={estilos.statValor}>{MOCK.distancia}</Text>
          </View>
          <View style={[estilos.stat, estilos.statBorda]}>
            <Text style={estilos.statLabel}>CHEGADA</Text>
            <Text style={estilos.statValor}>{MOCK.chegada}</Text>
          </View>
          <View style={[estilos.stat, estilos.statBorda]}>
            <Text style={estilos.statLabel}>ESTACIONADO</Text>
            <Text style={estilos.statValor}>{MOCK.tempoEstacionado}</Text>
          </View>
        </View>

        {/* divisor */}
        <View style={estilos.divisor} />

        {/* ações */}
        <View style={estilos.acoesRow}>
          <Pressable
            onPress={ligarCarro}
            style={({ pressed }) => [
              estilos.btnLigar,
              pressed && estilos.btnLigarPressed,
            ]}
          >
            <PowerIcon size={18} color="#fff" />
            <Text style={estilos.btnLigarTexto}>Ligar o carro</Text>
          </Pressable>

          <Pressable
            onPress={compartilhar}
            style={({ pressed }) => [
              estilos.btnCompartilhar,
              pressed && estilos.btnCompartilharPressed,
            ]}
          >
            <ShareIcon size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <SafeAreaView edges={['bottom']} />
    </View>
  );
}

// ─── estilos ──────────────────────────────────────────────────
const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    letterSpacing: 0.1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnPressed: {
    backgroundColor: colors.surface,
    transform: [{ scale: 0.95 }],
  },

  // mapa
  mapa: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },

  // coords
  coordsBadge: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    backgroundColor: 'rgba(10, 15, 26, 0.72)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  coordsTexto: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
  },

  // controles
  controles: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
  },
  controleBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: 'rgba(10, 15, 26, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controleSimbolo: {
    fontSize: 20,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },

  // marker group
  markerGroup: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '38%',
    alignItems: 'center',
  },
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.xl,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },
  calloutTextos: {
    gap: 2,
  },
  calloutLinha1: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: typography.letterSpacing.loose,
  },
  calloutLinha2: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  calloutCauda: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.accent,
    marginBottom: spacing[2],
  },
  dotWrap: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anel: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
    borderWidth: 2.5,
    borderColor: '#fff',
    zIndex: 2,
  },

  // info card
  infoCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing[6],
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },

  // endereço
  enderecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  enderecoIcone: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  enderecoTextos: {
    flex: 1,
    gap: 3,
  },
  enderecoRua: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  enderecoBairro: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  seguroBadge: {
    flexShrink: 0,
  },
  seguroTexto: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.ok,
    letterSpacing: typography.letterSpacing.loose,
  },

  divisor: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing[5],
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing[5],
  },
  stat: {
    flex: 1,
    gap: spacing[1],
  },
  statBorda: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingLeft: spacing[4],
  },
  statLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.loose,
  },
  statValor: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: typography.letterSpacing.normal,
  },

  // ações
  acoesRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  btnLigar: {
    flex: 1,
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnLigarPressed: {
    backgroundColor: colors.accentPressed,
    transform: [{ scale: 0.97 }],
  },
  btnLigarDesabilitado: {
    opacity: 0.7,
  },
  btnLigarTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  btnCompartilhar: {
    width: 54,
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceHi,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompartilharPressed: {
    backgroundColor: colors.surface,
    transform: [{ scale: 0.95 }],
  },
});
