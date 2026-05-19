import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Line } from "react-native-svg";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { buscarVeiculo } from "../../services/veiculo";
import { BellIcon, OilIcon, WiperIcon } from "../../components/icons";
import { Veiculo } from "../../types";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { spacing } from "../../constants/spacing";
import { radius } from "../../constants/radius";
import { layout } from "../../constants/layout";

const VITALS = {
  pressaoDianteira: 32,
  pressaoTraseira: 32,
  vidaUtilOleo: 90,
  autonomiaOleo: 300,
  fluidoLimpador: "Boa",
};

const IMG_NATURAL_W = 467;
const IMG_NATURAL_H = 879;

const PNEU = {
  dtEsq: { x: 0.14, y: 0.2 },
  dtDir: { x: 0.86, y: 0.2 },
  trEsq: { x: 0.14, y: 0.7 },
  trDir: { x: 0.86, y: 0.7 },
};

function VistaTopCaminhao({
  pressaoDianteira,
  pressaoTraseira,
}: {
  pressaoDianteira: number;
  pressaoTraseira: number;
}) {
  const { width: screenWidth } = useWindowDimensions();

  const containerW = screenWidth - spacing[6] * 2;

  const imgW = Math.round(containerW * 0.5);
  const imgH = Math.round((imgW * IMG_NATURAL_H) / IMG_NATURAL_W);
  const containerH = imgH + spacing[4];
  const imgLeft = Math.round((containerW - imgW) / 2);

  const pneu = {
    dtEsq: { x: imgLeft + imgW * PNEU.dtEsq.x, y: Math.round(imgH * PNEU.dtEsq.y) },
    dtDir: { x: imgLeft + imgW * PNEU.dtDir.x, y: Math.round(imgH * PNEU.dtDir.y) },
    trEsq: { x: imgLeft + imgW * PNEU.trEsq.x, y: Math.round(imgH * PNEU.trEsq.y) },
    trDir: { x: imgLeft + imgW * PNEU.trDir.x, y: Math.round(imgH * PNEU.trDir.y) },
  };

  const bW = 48;
  const bH = 28;
  const bGap = 10;

  const badge = {
    dtEsq: { x: bGap + bW / 2, y: pneu.dtEsq.y },
    dtDir: { x: containerW - bGap - bW / 2, y: pneu.dtDir.y },
    trEsq: { x: bGap + bW / 2, y: pneu.trEsq.y },
    trDir: { x: containerW - bGap - bW / 2, y: pneu.trDir.y },
  };

  const badgeStyle = (cx: number, cy: number) => ({
    position: "absolute" as const,
    left: cx - bW / 2,
    top: cy - bH / 2,
    width: bW,
    height: bH,
  });

  return (
    <View style={{ width: containerW, height: containerH }}>
      <Image
        source={require("../../assets/images/ranger-topo.webp")}
        style={{
          position: "absolute",
          left: imgLeft,
          top: 0,
          width: imgW,
          height: imgH,
        }}
        resizeMode="contain"
      />

      <Svg
        width={containerW}
        height={containerH}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Line x1={badge.dtEsq.x} y1={badge.dtEsq.y} x2={pneu.dtEsq.x} y2={pneu.dtEsq.y} stroke={colors.ok} strokeWidth={1} opacity={0.55} />
        <Line x1={badge.dtDir.x} y1={badge.dtDir.y} x2={pneu.dtDir.x} y2={pneu.dtDir.y} stroke={colors.ok} strokeWidth={1} opacity={0.55} />
        <Line x1={badge.trEsq.x} y1={badge.trEsq.y} x2={pneu.trEsq.x} y2={pneu.trEsq.y} stroke={colors.ok} strokeWidth={1} opacity={0.55} />
        <Line x1={badge.trDir.x} y1={badge.trDir.y} x2={pneu.trDir.x} y2={pneu.trDir.y} stroke={colors.ok} strokeWidth={1} opacity={0.55} />
      </Svg>

      <View style={[estilos.badgePressao, badgeStyle(badge.dtEsq.x, badge.dtEsq.y)]}>
        <Text style={estilos.badgeTexto}>{pressaoDianteira}</Text>
      </View>
      <View style={[estilos.badgePressao, badgeStyle(badge.dtDir.x, badge.dtDir.y)]}>
        <Text style={estilos.badgeTexto}>{pressaoDianteira}</Text>
      </View>
      <View style={[estilos.badgePressao, badgeStyle(badge.trEsq.x, badge.trEsq.y)]}>
        <Text style={estilos.badgeTexto}>{pressaoTraseira}</Text>
      </View>
      <View style={[estilos.badgePressao, badgeStyle(badge.trDir.x, badge.trDir.y)]}>
        <Text style={estilos.badgeTexto}>{pressaoTraseira}</Text>
      </View>
    </View>
  );
}

function CardVital({
  icone,
  pct,
  label,
  sub,
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
      const veiculoDados = await buscarVeiculo(idVeiculo);
      setVeiculo(veiculoDados);
    } catch (e: any) {
      setErro(
        e?.response?.status === 401
          ? "Sessão expirada. Faça login novamente."
          : "Não foi possível carregar os dados.",
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

  const kmFormatado = veiculo?.quilometragem
    ? veiculo.quilometragem.toLocaleString("pt-BR")
    : "—";

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={["top"]} style={estilos.topChrome}>
          <Image
            source={require("../../assets/images/logo-ford.png")}
            style={estilos.logo}
          />
          <Pressable
            onPress={() => router.push("/notificacoes")}
            style={estilos.avatarBtn}
          >
            <BellIcon size={20} color={colors.text} />
          </Pressable>
        </SafeAreaView>

        <View style={estilos.header}>
          <Text style={estilos.subtitulo}>Visão geral</Text>
          <Text style={estilos.titulo}>Dashboard</Text>
        </View>

        <View style={estilos.odometroSecao}>
          <Text style={estilos.odometroLabel}>Odômetro</Text>
          <Text style={estilos.odometroValor}>{kmFormatado} km</Text>
        </View>

        {erro && (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        )}

        <View style={estilos.truckSecao}>
          <VistaTopCaminhao
            pressaoDianteira={VITALS.pressaoDianteira}
            pressaoTraseira={VITALS.pressaoTraseira}
          />
        </View>

        <Text style={estilos.pressaoLegenda}>
          {"Pressão ideal dos pneus frios:\n"}
          <Text style={estilos.pressaoDestaque}>
            {`Dianteira ${VITALS.pressaoDianteira} · Traseira ${VITALS.pressaoTraseira}`}
          </Text>
        </Text>

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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
  },
  topChrome: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  titulo: {
    fontSize: typography.size["3xl"],
    fontWeight: typography.weight.bold,
    fontFamily: "Inter_700Bold",
    color: colors.text,
    letterSpacing: typography.letterSpacing.tight,
    lineHeight: Math.round(typography.size["3xl"] * typography.lineHeight.snug),
  },
  odometroSecao: {
    alignItems: "center",
    paddingVertical: spacing[5],
  },
  odometroLabel: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
    marginBottom: spacing[1],
  },
  odometroValor: {
    fontSize: 28,
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
    color: colors.text,
    letterSpacing: -0.4,
  },
  truckSecao: {
    alignItems: "center",
    marginBottom: spacing[3],
  },
  badgePressao: {
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.ok,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
    color: colors.ok,
  },
  pressaoLegenda: {
    textAlign: "center",
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
    lineHeight: Math.round(typography.size.sm * typography.lineHeight.normal),
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
  },
  pressaoDestaque: {
    color: colors.text,
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
  },
  vitaisGrid: {
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  vitalPct: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
    color: colors.ok,
  },
  vitalLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    fontFamily: "Inter_500Medium",
    color: colors.text,
    marginBottom: spacing[1],
  },
  vitalSub: {
    fontSize: typography.size.xs,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
  },
  erroContainer: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    alignItems: "center",
    gap: spacing[2],
  },
  erroTexto: {
    color: colors.danger,
    fontSize: typography.size.sm,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  erroLink: {
    color: colors.accent,
    fontSize: typography.size.sm,
    fontFamily: "Inter_500Medium",
  },
});
