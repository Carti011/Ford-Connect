import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { login as serviceLogin, obterToken, obterVeiculoId, limparSessao } from '../services/auth';

export function useAuth() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [idVeiculo, setIdVeiculo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function verificarSessao() {
      const token = await obterToken();
      const veiculoId = await obterVeiculoId();
      setEstaAutenticado(token !== null);
      setIdVeiculo(veiculoId);
      setCarregando(false);
    }
    verificarSessao();
  }, []);

  async function entrar(email: string, senha: string): Promise<void> {
    await serviceLogin(email, senha);
    const veiculoId = await obterVeiculoId();
    setIdVeiculo(veiculoId);
    setEstaAutenticado(true);
    router.replace('/(tabs)');
  }

  async function sair(): Promise<void> {
    await limparSessao();
    setEstaAutenticado(false);
    setIdVeiculo(null);
    router.replace('/login');
  }

  return { estaAutenticado, carregando, idVeiculo, entrar, sair };
}
