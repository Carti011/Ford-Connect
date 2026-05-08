import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  mensagem?: string;
}

export function EstadoCarregando({ mensagem }: Props) {
  return (
    <View style={estilos.container}>
      <ActivityIndicator size="large" color="#003478" />
      {mensagem && <Text style={estilos.mensagem}>{mensagem}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  mensagem: {
    color: '#666',
    fontSize: 15,
  },
});
