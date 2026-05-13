import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const CHAVE_TOKEN = 'ford_jwt_token';
export const CHAVE_VEICULO_ID = 'ford_veiculo_id';

const PORTA_BACKEND = 8080;

function resolverBaseURL(): string {
  // 1. URL explicita via variavel de ambiente (producao, Railway, override manual)
  const urlConfigurada = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (urlConfigurada) {
    return urlConfigurada;
  }

  // 2. desenvolvimento: descobre o IP do host atraves do servidor de dev Expo
  const hostUri = Constants.expoConfig?.hostUri;
  if (typeof hostUri === 'string' && hostUri.length > 0) {
    const host = hostUri.split(':')[0];
    return `http://${host}:${PORTA_BACKEND}`;
  }

  // 3. fallback para simulador iOS / web rodando no mesmo host
  if (Platform.OS === 'android') {
    // emulador Android usa 10.0.2.2 para alcancar o host
    return `http://10.0.2.2:${PORTA_BACKEND}`;
  }
  return `http://localhost:${PORTA_BACKEND}`;
}

export const BASE_URL = resolverBaseURL();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(CHAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
