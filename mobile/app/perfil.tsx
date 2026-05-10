import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { buscarVeiculo } from '../services/veiculo';
import { Veiculo } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import {
  VehicleIcon, UserIcon, PinIcon, CaretIcon,
  EditIcon, PhoneIcon, ShieldIcon, IdCardIcon,
  ChevronLeftIcon, LogoutIcon,
} from '../components/icons';

// ─── dados mockados enquanto backend não expõe ────────────────
const MOCK_PESSOAL = {
  cpf:      '123.456.789-00',
  telefone: '+55 (11) 9 8765-4321',
  endereco: 'São Paulo, SP',
};

const MOCK_VEICULO = {
  chassi:  '9BFZ...84B7',
  renavam: '008...471',
  cor:     'Azul Velocity',
};

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();
}

function formatarKm(km: number): string {
  return `${km.toLocaleString('pt-BR')} km`;
}

function emailFromNome(nome: string): string {
  const partes = nome.trim().split(' ').filter(Boolean);
  const primeiro = partes[0]?.toLowerCase() ?? '';
  const ultimo   = partes[partes.length - 1]?.toLowerCase() ?? '';
  return `${primeiro}.${ultimo}@fordconnect.com`;
}

export default function TelaPerfil() {
  const router = useRouter();
  const { idVeiculo, sair } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);

  const carregar = useCallback(async () => {
    if (!idVeiculo) { setCarregando(false); return; }
    try {
      setVeiculo(await buscarVeiculo(idVeiculo));
    } catch {
      // falha silenciosa — exibe placeholders
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => { carregar(); }, [carregar]);

  async function confirmarSaida() {
    Alert.alert(
      'Sair da conta',
      'Deseja encerrar sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            setSaindo(true);
            await sair();
          },
        },
      ],
    );
  }

  if (carregando) {
    return (
      <View style={estilos.centrado}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  const nome   = veiculo?.nomeProprietario ?? '—';
  const email  = veiculo ? emailFromNome(nome) : '—';
  const modelo = veiculo
    ? `${veiculo.modelo}${veiculo.versao ? ' ' + veiculo.versao : ''}`
    : '—';
  const info   = veiculo
    ? `${veiculo.ano} · ${MOCK_VEICULO.cor} · ${formatarKm(veiculo.quilometragem)}`
    : '—';

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

        <Text style={estilos.headerTitulo}>Perfil</Text>

        <Pressable
          style={({ pressed }) => [estilos.headerBtn, pressed && estilos.headerBtnPressed]}
        >
          <EditIcon size={18} color={colors.text} />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={estilos.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* avatar + identidade */}
        <View style={estilos.identidadeSecao}>
          <View style={estilos.avatarWrap}>
            <View style={estilos.avatarCirculo}>
              <Text style={estilos.avatarIniciais}>{iniciais(nome)}</Text>
            </View>
            <View style={estilos.avatarEditBadge}>
              <EditIcon size={10} color={colors.text} />
            </View>
          </View>

          <Text style={estilos.nome}>{nome}</Text>
          <Text style={estilos.email}>{email}</Text>

          <View style={estilos.badge}>
            <Text style={estilos.badgeTexto}>FORD CONNECT · MEMBRO PRO</Text>
          </View>
        </View>

        {/* veículo principal */}
        <Text style={estilos.secaoLabel}>VEÍCULO PRINCIPAL</Text>
        <View style={estilos.card}>
          {/* linha do modelo */}
          <Pressable
            style={({ pressed }) => [estilos.veiculoRow, pressed && estilos.rowPressed]}
          >
            <View style={estilos.veiculoIcone}>
              <VehicleIcon size={22} color={colors.accent} />
            </View>
            <View style={estilos.veiculoInfo}>
              <Text style={estilos.veiculoModelo} numberOfLines={2}>{modelo}</Text>
              <Text style={estilos.veiculoMeta}>{info}</Text>
            </View>
            <CaretIcon size={14} color={colors.textMuted} />
          </Pressable>

          {/* grid placa / chassi / renavam */}
          <View style={estilos.placaGrid}>
            <View style={estilos.placaItem}>
              <Text style={estilos.placaLabel}>PLACA</Text>
              <Text style={estilos.placaValor}>{veiculo?.placa ?? '—'}</Text>
            </View>
            <View style={[estilos.placaItem, estilos.placaItemBorder]}>
              <Text style={estilos.placaLabel}>CHASSI</Text>
              <Text style={estilos.placaValor}>{MOCK_VEICULO.chassi}</Text>
            </View>
            <View style={[estilos.placaItem, estilos.placaItemBorder]}>
              <Text style={estilos.placaLabel}>RENAVAM</Text>
              <Text style={estilos.placaValor}>{MOCK_VEICULO.renavam}</Text>
            </View>
          </View>
        </View>

        {/* dados pessoais */}
        <Text style={estilos.secaoLabel}>DADOS PESSOAIS</Text>
        <View style={estilos.card}>
          <LinhaInfo
            icone={<UserIcon size={18} color={colors.accent} />}
            label="Nome completo"
            valor={nome}
          />
          <LinhaInfo
            icone={<IdCardIcon size={18} color={colors.accent} />}
            label="CPF"
            valor={MOCK_PESSOAL.cpf}
            divisor
          />
          <LinhaInfo
            icone={<PhoneIcon size={18} color={colors.accent} />}
            label="Telefone"
            valor={MOCK_PESSOAL.telefone}
            divisor
          />
          <LinhaInfo
            icone={<PinIcon size={18} color={colors.accent} />}
            label="Endereço"
            valor={MOCK_PESSOAL.endereco}
            divisor
            ultimo
          />
        </View>

        {/* conta & segurança */}
        <Text style={estilos.secaoLabel}>CONTA &amp; SEGURANÇA</Text>
        <View style={estilos.card}>
          <LinhaInfo
            icone={<ShieldIcon size={18} color={colors.accent} />}
            label="Alterar senha"
            valor=""
            ultimo
          />
        </View>

        {/* botão sair */}
        <Pressable
          onPress={confirmarSaida}
          disabled={saindo}
          style={({ pressed }) => [estilos.botaoSair, pressed && estilos.botaoSairPressed]}
        >
          {saindo ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <>
              <LogoutIcon size={18} color={colors.danger} />
              <Text style={estilos.botaoSairTexto}>Sair da conta</Text>
            </>
          )}
        </Pressable>

        <View style={{ height: spacing[10] }} />
      </ScrollView>
    </View>
  );
}

// ─── componente auxiliar ──────────────────────────────────────
interface LinhaInfoProps {
  icone: React.ReactNode;
  label: string;
  valor: string;
  divisor?: boolean;
  ultimo?: boolean;
}

function LinhaInfo({ icone, label, valor, divisor, ultimo }: LinhaInfoProps) {
  return (
    <>
      {divisor && <View style={estilos.divisor} />}
      <Pressable
        style={({ pressed }) => [estilos.linhaRow, pressed && estilos.rowPressed]}
      >
        <View style={estilos.linhaIcone}>{icone}</View>
        <View style={estilos.linhaTextos}>
          <Text style={estilos.linhaLabel}>{label}</Text>
          {valor ? <Text style={estilos.linhaValor}>{valor}</Text> : null}
        </View>
        <CaretIcon size={14} color={colors.textMuted} />
      </Pressable>
    </>
  );
}

// ─── estilos ──────────────────────────────────────────────────
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

  // scroll
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },

  // identidade
  identidadeSecao: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing[4],
  },
  avatarCirculo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarIniciais: {
    fontSize: 30,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    letterSpacing: 1,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceHi,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    marginBottom: spacing[1],
    letterSpacing: typography.letterSpacing.normal,
  },
  email: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing[4],
  },
  badge: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  badgeTexto: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.accent,
    letterSpacing: typography.letterSpacing.loose,
  },

  // seção label
  secaoLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.loose,
    marginBottom: spacing[3],
    marginLeft: spacing[1],
  },

  // card
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing[6],
  },

  // veículo row
  veiculoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5],
    gap: spacing[4],
  },
  veiculoIcone: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  veiculoInfo: {
    flex: 1,
    gap: spacing[1],
  },
  veiculoModelo: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    lineHeight: Math.round(typography.size.base * typography.lineHeight.snug),
  },
  veiculoMeta: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },

  // placa grid
  placaGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placaItem: {
    flex: 1,
    paddingVertical: spacing[4],
    alignItems: 'center',
    gap: spacing[1],
  },
  placaItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  placaLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.loose,
  },
  placaValor: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },

  // linha info
  linhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    gap: spacing[4],
  },
  rowPressed: {
    backgroundColor: colors.surfaceHi,
  },
  linhaIcone: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  linhaTextos: {
    flex: 1,
    gap: spacing[1],
  },
  linhaLabel: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.medium,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
  },
  linhaValor: {
    fontSize: typography.size.md,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing[5] + 40 + spacing[4],
  },

  // botão sair
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingVertical: spacing[5],
    borderRadius: radius['2xl'],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(229, 55, 42, 0.25)',
    marginBottom: spacing[4],
  },
  botaoSairPressed: {
    backgroundColor: colors.dangerSoft,
    transform: [{ scale: 0.98 }],
  },
  botaoSairTexto: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.danger,
  },
});
