import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { buscarVeiculo } from "../../services/veiculo";
import { buscarAgendamentos, alternarAtivo } from "../../services/agendamento";
import { calcularProximaPartida } from "../../utils/proximaPartida";
import { VehicleHero } from "../../components/VehicleHero";
import { SlideToStart } from "../../components/SlideToStart";
import {
  UserIcon,
  PinIcon,
  FuelIcon,
  CalendarIcon,
  LockIcon,
  UnlockIcon,
  FanIcon,
  BellIcon,
} from "../../components/icons";
import { Veiculo, AgendamentoVeiculo } from "../../types";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { spacing } from "../../constants/spacing";
import { radius } from "../../constants/radius";
import { layout } from "../../constants/layout";


export default function TelaHome() {
  const router = useRouter();
  const { idVeiculo } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [agendamentos, setAgendamentos] = useState<AgendamentoVeiculo[]>([]);
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
      const [v, ags] = await Promise.all([
        buscarVeiculo(idVeiculo),
        buscarAgendamentos(idVeiculo),
      ]);
      setVeiculo(v);
      setAgendamentos(ags);
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

  async function toggleAgendamento(id: string) {
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a)),
    );
    try {
      const atualizado = await alternarAtivo(id);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? atualizado : a)),
      );
    } catch {
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a)),
      );
    }
  }

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

  const modelo = veiculo
    ? `${veiculo.modelo}${veiculo.versao ? " " + veiculo.versao : ""}`
    : "—";
  const proximaPartida = calcularProximaPartida(agendamentos);

  return (
    <View style={estilos.tela}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* top chrome */}
        <SafeAreaView edges={["top"]} style={estilos.topChrome}>
          <Image
            source={require("../../assets/images/logo-ford.png")}
            style={estilos.logo}
          />
          <View style={estilos.topChromeDir}>
            <Pressable
              onPress={() => router.push("/notificacoes")}
              style={estilos.avatarBtn}
            >
              <BellIcon size={20} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => router.push("/perfil")}
              style={estilos.avatarBtn}
            >
              <UserIcon size={20} color={colors.text} />
            </Pressable>
          </View>
        </SafeAreaView>

        {/* status header */}
        <View style={estilos.statusHeader}>
          <Text style={estilos.modeloTexto}>{modelo}</Text>
          <Text style={estilos.statusTexto}>{veiculo?.statusVeiculo ?? "—"}</Text>
        </View>

        {/* pill localização */}
        <Pressable
          onPress={() => router.push("/localizacao")}
          style={({ pressed }) => [
            estilos.locationPill,
            pressed && estilos.locationPillPressed,
          ]}
        >
          <PinIcon size={18} color={colors.text} />
          <Text style={estilos.locationTexto}>Localização</Text>
          <View style={estilos.locationCaret} />
        </Pressable>

        {/* hero veículo */}
        <View style={estilos.heroContainer}>
          <VehicleHero />
        </View>

        {/* stats grid */}
        <View style={estilos.statsGrid}>
          <View style={estilos.stat}>
            <View style={estilos.statHeader}>
              <FuelIcon size={15} color={colors.textDim} />
              <Text style={estilos.statLabel}>Nível de combustível</Text>
            </View>
            <View style={estilos.statValores}>
              <Text style={estilos.statBig}>{veiculo ? `${veiculo.nivelCombustivel}%` : "—"}</Text>
              <Text style={estilos.statSub}>{veiculo ? `${veiculo.autonomiaKm} km` : "—"}</Text>
            </View>
          </View>

          <View style={[estilos.stat, estilos.statDireita]}>
            <View style={[estilos.statHeader, estilos.statHeaderDireita]}>
              <Text style={estilos.statLabel}>Próxima partida</Text>
              <CalendarIcon size={15} color={colors.textDim} />
            </View>
            <View style={[estilos.statValores, estilos.statValoresDireita]}>
              <Text style={estilos.statBig}>{proximaPartida?.dia ?? "—"}</Text>
              <Text style={estilos.statSub}>{proximaPartida?.hora ?? "—"}</Text>
            </View>
          </View>
        </View>

        {/* erro */}
        {erro && (
          <Pressable onPress={carregar} style={estilos.erroContainer}>
            <Text style={estilos.erroTexto}>{erro}</Text>
            <Text style={estilos.erroLink}>Tentar novamente</Text>
          </Pressable>
        )}

        {/* slide para partida */}
        <View style={estilos.slideContainer}>
          <SlideToStart
            onComplete={() =>
              router.push(
                `/iniciando-motor?modelo=${encodeURIComponent(veiculo?.modelo ?? 'Ranger')}`,
              )
            }
          />
        </View>

        {/* climatização */}
        <Pressable
          onPress={() => router.push('/climatizacao')}
          style={({ pressed }) => [
            estilos.climaTile,
            pressed && estilos.climaTilePressed,
          ]}
        >
          <FanIcon size={18} color={colors.text} />
          <Text style={estilos.acaoTexto}>Climatização</Text>
        </Pressable>

        {/* travar / destravar */}
        <View style={estilos.acoes}>
          <Pressable
            onPress={() => router.push('/trava?acao=travar')}
            style={({ pressed }) => [
              estilos.acaoTile,
              pressed && estilos.acaoTilePressed,
            ]}
          >
            <LockIcon size={18} color={colors.text} />
            <Text style={estilos.acaoTexto}>Travar</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/trava?acao=destravar')}
            style={({ pressed }) => [
              estilos.acaoTile,
              pressed && estilos.acaoTilePressed,
            ]}
          >
            <UnlockIcon size={18} color={colors.text} />
            <Text style={estilos.acaoTexto}>Destravar</Text>
          </Pressable>
        </View>

        {/* agendar */}
        <View style={estilos.agendarSecao}>
          <Pressable
            onPress={() => router.push('/agendar')}
            style={({ pressed }) => [estilos.agendarHeader, pressed && estilos.agendarHeaderPressed]}
          >
            <Text style={estilos.agendarTitulo}>Agendar</Text>
            <Text style={estilos.agendarPlus}>+</Text>
          </Pressable>
          {agendamentos.map((item, idx) => (
            <View
              key={item.id}
              style={[
                estilos.agendarRow,
                idx < agendamentos.length - 1 && estilos.agendarRowBorder,
              ]}
            >
              {item.hora ? (
                <Text style={estilos.agendarHora}>{item.hora}</Text>
              ) : (
                <BellIcon size={16} color={colors.textDim} />
              )}
              <Text style={estilos.agendarLabel} numberOfLines={1}>
                {item.rotulo}
              </Text>
              <Switch
                value={item.ativo}
                onValueChange={() => toggleAgendamento(item.id)}
                trackColor={{ false: colors.surfaceHi, true: colors.accent }}
                thumbColor={colors.text}
                ios_backgroundColor={colors.surfaceHi}
              />
            </View>
          ))}
        </View>

        {/* espaço para a tab bar flutuante */}
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

  // top chrome
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
  topChromeDir: {
    flexDirection: "row",
    gap: spacing[2],
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

  // status header
  statusHeader: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  modeloTexto: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
    marginBottom: spacing[2],
    letterSpacing: 0.2,
  },
  statusTexto: {
    fontSize: typography.size["4xl"],
    fontWeight: typography.weight.bold,
    fontFamily: "Inter_700Bold",
    color: colors.text,
    lineHeight: Math.round(
      typography.size["4xl"] * typography.lineHeight.tight,
    ),
    letterSpacing: typography.letterSpacing.tight,
  },

  // location pill
  locationPill: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[5],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius["2xl"],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationPillPressed: {
    backgroundColor: colors.surfaceHi,
    transform: [{ scale: 0.98 }],
  },
  locationTexto: {
    flex: 1,
    fontSize: typography.size.base,
    color: colors.text,
    fontFamily: "Inter_400Regular",
  },
  locationCaret: {
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: colors.textDim,
    transform: [{ rotate: "45deg" }],
  },

  // hero
  heroContainer: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
    backgroundColor: colors.surfaceLo,
    borderRadius: radius["2xl"],
    paddingVertical: spacing[3],
    paddingHorizontal: 0,
  },

  // stats
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[5],
    gap: spacing[5],
  },
  stat: {
    flex: 1,
  },
  statDireita: {
    alignItems: "flex-end",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  statHeaderDireita: {
    justifyContent: "flex-end",
  },
  statLabel: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
  },
  statValores: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing[2],
  },
  statValoresDireita: {
    justifyContent: "flex-end",
  },
  statBig: {
    fontSize: typography.size["2xl"],
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
    color: colors.text,
    letterSpacing: typography.letterSpacing.normal,
  },
  statSub: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    fontFamily: "Inter_500Medium",
    color: colors.text,
  },

  // erro
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

  // slide
  slideContainer: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[3],
  },

  // climatização
  climaTile: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[3],
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
  },
  climaTilePressed: {
    backgroundColor: colors.surfaceHi,
    transform: [{ scale: 0.98 }],
  },

  // ações
  acoes: {
    flexDirection: "row",
    marginHorizontal: spacing[6],
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  acaoTile: {
    flex: 1,
    height: 60,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
  },
  acaoTilePressed: {
    backgroundColor: colors.surfaceHi,
    transform: [{ scale: 0.97 }],
  },
  acaoTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    fontFamily: "Inter_500Medium",
    color: colors.text,
  },

  // agendar
  agendarSecao: {
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  agendarHeader: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agendarHeaderPressed: {
    backgroundColor: colors.surfaceHi,
  },
  agendarPlus: {
    fontSize: 22,
    color: colors.accent,
    fontFamily: 'Inter_400Regular',
    lineHeight: 26,
  },
  agendarTitulo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: "Inter_600SemiBold",
    color: colors.text,
    letterSpacing: 0.1,
  },
  agendarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[4],
  },
  agendarRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  agendarHora: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    fontFamily: "Inter_700Bold",
    color: colors.text,
    minWidth: 48,
  },
  agendarLabel: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: "Inter_400Regular",
  },
});
