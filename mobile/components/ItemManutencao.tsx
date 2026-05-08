import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RegistroManutencao } from '../types';

interface Props {
  manutencao: RegistroManutencao;
}

export function ItemManutencao({ manutencao }: Props) {
  const data = new Date(manutencao.dataServico + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const custo = manutencao.custo.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const km = manutencao.quilometragemNoServico.toLocaleString('pt-BR');

  return (
    <View style={estilos.item}>
      <View style={estilos.linha}>
        <Text style={estilos.tipo}>{manutencao.tipo}</Text>
        <Text style={estilos.custo}>{custo}</Text>
      </View>
      <Text style={estilos.descricao}>{manutencao.descricao}</Text>
      <View style={estilos.rodape}>
        <Text style={estilos.detalhe}>{data}</Text>
        <Text style={estilos.separador}>·</Text>
        <Text style={estilos.detalhe}>{km} km</Text>
        <Text style={estilos.separador}>·</Text>
        <Text style={estilos.detalhe}>{manutencao.concessionaria}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tipo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  custo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#003478',
  },
  descricao: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  detalhe: {
    fontSize: 12,
    color: '#999',
  },
  separador: {
    fontSize: 12,
    color: '#ccc',
  },
});
