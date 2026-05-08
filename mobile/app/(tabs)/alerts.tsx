import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { buscarAlertas } from '../../services/alerta';
import { ItemAlerta } from '../../components/ItemAlerta';
import { EstadoCarregando } from '../../components/EstadoCarregando';
import { AlertaRevisao } from '../../types';

export default function TelaAlertas() {
  const { idVeiculo } = useAuth();
  const [alertas, setAlertas] = useState<AlertaRevisao[]>([]);
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
      const dados = await buscarAlertas(idVeiculo);
      setAlertas(dados);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        setErro('Sessão expirada. Faça login novamente.');
      } else {
        setErro('Não foi possível carregar os dados. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }, [idVeiculo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) return <EstadoCarregando mensagem="Carregando alertas..." />;

  return (
    <SafeAreaViewContext style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Alertas</Text>
      </View>

      {erro ? (
        <View style={estilos.containerErro}>
          <Text style={estilos.textoErro}>{erro}</Text>
          <TouchableOpacity style={estilos.botaoTentar} onPress={carregar}>
            <Text style={estilos.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemAlerta alerta={item} />}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <Text style={estilos.textoVazio}>Nenhum alerta pendente</Text>
          }
        />
      )}
    </SafeAreaViewContext>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cabecalho: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  lista: {
    padding: 20,
    gap: 12,
  },
  containerErro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
  },
  textoErro: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  botaoTentar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#003478',
    borderRadius: 8,
  },
  textoBotaoTentar: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  textoVazio: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingTop: 40,
  },
});
