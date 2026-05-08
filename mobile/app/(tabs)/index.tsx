import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { buscarVeiculo } from '../../services/veiculo';
import { CartaoVeiculo } from '../../components/CartaoVeiculo';
import { EstadoCarregando } from '../../components/EstadoCarregando';
import { Veiculo } from '../../types';

export default function TelaHome() {
  const { idVeiculo, sair } = useAuth();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!idVeiculo) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await buscarVeiculo(idVeiculo);
      setVeiculo(dados);
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

  if (carregando) return <EstadoCarregando mensagem="Carregando veículo..." />;

  return (
    <SafeAreaViewContext style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Meu Veículo</Text>
          <TouchableOpacity onPress={sair}>
            <Text style={estilos.sair}>Sair</Text>
          </TouchableOpacity>
        </View>

        {erro ? (
          <View style={estilos.containerErro}>
            <Text style={estilos.textoErro}>{erro}</Text>
            <TouchableOpacity style={estilos.botaoTentar} onPress={carregar}>
              <Text style={estilos.textoBotaoTentar}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : veiculo ? (
          <CartaoVeiculo veiculo={veiculo} />
        ) : null}
      </ScrollView>
    </SafeAreaViewContext>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  conteudo: {
    padding: 20,
    gap: 16,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  sair: {
    fontSize: 14,
    color: '#003478',
    fontWeight: '600',
  },
  containerErro: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 40,
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
});
