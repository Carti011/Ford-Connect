import * as SecureStore from 'expo-secure-store';
import api, { CHAVE_TOKEN, CHAVE_VEICULO_ID } from './api';
import { RespostaLogin } from '../types';

export async function login(email: string, senha: string): Promise<string> {
  const resposta = await api.post<RespostaLogin>('/api/autenticacao/login', { email, senha });
  const { token, veiculoId } = resposta.data;
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
  await SecureStore.setItemAsync(CHAVE_VEICULO_ID, veiculoId);
  return token;
}

export async function obterToken(): Promise<string | null> {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function obterVeiculoId(): Promise<string | null> {
  return SecureStore.getItemAsync(CHAVE_VEICULO_ID);
}

export async function limparSessao(): Promise<void> {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
  await SecureStore.deleteItemAsync(CHAVE_VEICULO_ID);
}
