import api from './api';

export async function resetarDemo(): Promise<void> {
  await api.post('/api/demo/resetar');
}
