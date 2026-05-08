import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertaRevisao, Prioridade } from '../types';

interface Props {
  alerta: AlertaRevisao;
}

const corPrioridade: Record<Prioridade, string> = {
  alta: '#DC2626',
  media: '#D97706',
  baixa: '#16A34A',
};

const rotuloPrioridade: Record<Prioridade, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export function ItemAlerta({ alerta }: Props) {
  const cor = corPrioridade[alerta.prioridade];

  const dataLimite = alerta.dataLimite
    ? new Date(alerta.dataLimite + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <View style={[estilos.item, { borderLeftColor: cor }]}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>{alerta.titulo}</Text>
        <View style={[estilos.badge, { backgroundColor: cor }]}>
          <Text style={estilos.textoBadge}>{rotuloPrioridade[alerta.prioridade]}</Text>
        </View>
      </View>
      <Text style={estilos.descricao}>{alerta.descricao}</Text>
      {dataLimite && (
        <Text style={estilos.dataLimite}>Prazo: {dataLimite}</Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  textoBadge: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  descricao: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  dataLimite: {
    fontSize: 12,
    color: '#999',
  },
});
