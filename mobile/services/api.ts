import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const CHAVE_TOKEN = 'ford_jwt_token';
export const CHAVE_VEICULO_ID = 'ford_veiculo_id';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080',
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
