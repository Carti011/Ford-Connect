import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as serviceLogin, obterToken, obterVeiculoId, limparSessao } from '../services/auth';

interface AuthContextData {
  estaAutenticado: boolean;
  carregando: boolean;
  idVeiculo: string | null;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [idVeiculo, setIdVeiculo] = useState<string | null>(null);

  useEffect(() => {
    async function verificarSessao() {
      const token = await obterToken();
      const veiculoId = await obterVeiculoId();
      if (token && !veiculoId) {
        await limparSessao();
        setEstaAutenticado(false);
      } else {
        setEstaAutenticado(token !== null);
        setIdVeiculo(veiculoId);
      }
      setCarregando(false);
    }
    verificarSessao();
  }, []);

  async function entrar(email: string, senha: string): Promise<void> {
    await serviceLogin(email, senha);
    const veiculoId = await obterVeiculoId();
    setIdVeiculo(veiculoId);
    setEstaAutenticado(true);
  }

  async function sair(): Promise<void> {
    await limparSessao();
    setEstaAutenticado(false);
    setIdVeiculo(null);
  }

  return (
    <AuthContext.Provider value={{ estaAutenticado, carregando, idVeiculo, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
