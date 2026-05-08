import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Veiculo } from '../types';

interface Props {
  veiculo: Veiculo;
}

export function CartaoVeiculo({ veiculo }: Props) {
  const km = veiculo.quilometragem.toLocaleString('pt-BR');

  return (
    <View style={estilos.cartao}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.marca}>{veiculo.marca}</Text>
        <Text style={estilos.placa}>{veiculo.placa}</Text>
      </View>
      <Text style={estilos.modelo}>
        {veiculo.modelo} {veiculo.versao}
      </Text>
      <View style={estilos.rodape}>
        <View style={estilos.info}>
          <Text style={estilos.rotuloInfo}>Ano</Text>
          <Text style={estilos.valorInfo}>{veiculo.ano}</Text>
        </View>
        <View style={estilos.divisor} />
        <View style={estilos.info}>
          <Text style={estilos.rotuloInfo}>Quilometragem</Text>
          <Text style={estilos.valorInfo}>{km} km</Text>
        </View>
        <View style={estilos.divisor} />
        <View style={estilos.info}>
          <Text style={estilos.rotuloInfo}>Proprietário</Text>
          <Text style={estilos.valorInfo}>{veiculo.nomeProprietario}</Text>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marca: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003478',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  placa: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modelo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  rotuloInfo: {
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valorInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  divisor: {
    width: 1,
    height: 36,
    backgroundColor: '#e8e8e8',
    marginHorizontal: 12,
  },
});
