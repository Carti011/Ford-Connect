import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Veiculo, RegistroManutencao } from '../types';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { radius } from '../constants/radius';
import { ShieldIcon } from './icons';

interface Props {
  veiculo: Veiculo;
  manutencoes: RegistroManutencao[];
}

const MESES_TEXTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const PROXIMO_MARCO_KM = 20000;

function ehFord(concessionaria: string): boolean {
  return concessionaria.toLowerCase().includes('ford');
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

function mesesDesde(iso: string): number {
  const inicial = new Date(iso + 'T12:00:00').getTime();
  const agora = Date.now();
  return Math.max(1, Math.round((agora - inicial) / (1000 * 60 * 60 * 24 * 30)));
}

function rotuloMesPrazo(meses: number): string {
  if (meses <= 0) return 'agora';
  if (meses === 1) return '1 mês';
  if (meses < 12) return `${meses} meses`;
  const anos = Math.round(meses / 12);
  return anos === 1 ? '1 ano' : `${anos} anos`;
}

export function CartaoFidelidade({ veiculo, manutencoes }: Props) {
  if (manutencoes.length === 0) return null;

  const totalVisitas = manutencoes.length;
  const visitasFord = manutencoes.filter((m) => ehFord(m.concessionaria)).length;
  const percentualFord = Math.round((visitasFord / totalVisitas) * 100);
  const totalInvestido = manutencoes.reduce((acc, m) => acc + (m.custo ?? 0), 0);

  const concessionariasFord = manutencoes
    .filter((m) => ehFord(m.concessionaria))
    .map((m) => m.concessionaria);
  const concessionariaPrincipal = concessionariasFord[0] ?? '';

  const datasOrdenadas = manutencoes
    .map((m) => m.dataServico)
    .sort();
  const primeiraVisita = datasOrdenadas[0];
  const ultimaVisita = datasOrdenadas[datasOrdenadas.length - 1];
  const mesesAtivos = primeiraVisita ? mesesDesde(primeiraVisita) : 1;

  const kmAtual = veiculo.quilometragem ?? 0;
  let proximoMarcoTexto: string | null = null;
  if (kmAtual > 0 && kmAtual < PROXIMO_MARCO_KM) {
    const kmFaltantes = PROXIMO_MARCO_KM - kmAtual;
    const kmPorMes = kmAtual / mesesAtivos;
    const mesesEstimados =
      kmPorMes > 0 ? Math.max(1, Math.round(kmFaltantes / kmPorMes)) : 0;
    proximoMarcoTexto =
      mesesEstimados > 0
        ? `Próxima revisão obrigatória: ${PROXIMO_MARCO_KM.toLocaleString('pt-BR')} km · ~${rotuloMesPrazo(mesesEstimados)}`
        : `Próxima revisão obrigatória: ${PROXIMO_MARCO_KM.toLocaleString('pt-BR')} km`;
  }

  const ultima = ultimaVisita
    ? formatarData(ultimaVisita)
    : null;

  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <View style={estilos.iconeWrap}>
          <ShieldIcon size={18} color={colors.ok} />
        </View>
        <View style={estilos.tituloBloco}>
          <Text style={estilos.titulo}>
            {percentualFord === 100 ? 'Cliente fiel · Rede oficial' : 'Histórico recente'}
          </Text>
          <Text style={estilos.subtitulo}>
            {percentualFord}% dos serviços na rede Ford · {visitasFord} de {totalVisitas} visitas
          </Text>
        </View>
      </View>

      <View style={estilos.linhas}>
        {concessionariaPrincipal ? (
          <View style={estilos.linha}>
            <Text style={estilos.linhaChave}>Concessionária</Text>
            <Text style={estilos.linhaValor} numberOfLines={1}>
              {concessionariaPrincipal}
            </Text>
          </View>
        ) : null}
        <View style={estilos.linha}>
          <Text style={estilos.linhaChave}>Investido</Text>
          <Text style={estilos.linhaValor}>{formatarMoeda(totalInvestido)}</Text>
        </View>
        {ultima ? (
          <View style={estilos.linha}>
            <Text style={estilos.linhaChave}>Última visita</Text>
            <Text style={estilos.linhaValor}>{ultima}</Text>
          </View>
        ) : null}
      </View>

      {proximoMarcoTexto ? (
        <View style={estilos.marco}>
          <Text style={estilos.marcoTexto}>{proximoMarcoTexto}</Text>
        </View>
      ) : null}
    </View>
  );
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${parseInt(dia, 10)} ${MESES_TEXTO[parseInt(mes, 10) - 1]} ${ano}`;
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    gap: spacing[3],
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconeWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.okSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloBloco: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  subtitulo: {
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  linhas: {
    gap: spacing[2],
  },
  linha: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  linhaChave: {
    width: 100,
    fontSize: typography.size.sm,
    color: colors.textDim,
    fontFamily: 'Inter_400Regular',
  },
  linhaValor: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
  },
  marco: {
    backgroundColor: colors.surfaceHi,
    borderRadius: radius.md,
    padding: spacing[3],
  },
  marcoTexto: {
    fontSize: typography.size.sm,
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    lineHeight: 18,
  },
});
