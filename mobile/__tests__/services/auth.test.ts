import * as SecureStore from 'expo-secure-store';
import { login, obterToken, obterVeiculoId, limparSessao } from '../../services/auth';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
  CHAVE_TOKEN: 'ford_jwt_token',
  CHAVE_VEICULO_ID: 'ford_veiculo_id',
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const respostaMock = {
  data: {
    token: 'jwt-valido',
    tipo: 'Bearer',
    expiracaoEm: 9999999999999,
    veiculoId: '22222222-2222-2222-2222-222222222222',
  },
};

describe('auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login()', () => {
    it('deve chamar POST /api/autenticacao/login com email e senha', async () => {
      apiMock.post.mockResolvedValueOnce(respostaMock);

      await login('joao@fordconnect.com', 'ford@123');

      expect(apiMock.post).toHaveBeenCalledWith('/api/autenticacao/login', {
        email: 'joao@fordconnect.com',
        senha: 'ford@123',
      });
    });

    it('deve salvar o token no SecureStore', async () => {
      apiMock.post.mockResolvedValueOnce(respostaMock);

      await login('joao@fordconnect.com', 'ford@123');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('ford_jwt_token', 'jwt-valido');
    });

    it('deve salvar o veiculoId no SecureStore', async () => {
      apiMock.post.mockResolvedValueOnce(respostaMock);

      await login('joao@fordconnect.com', 'ford@123');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'ford_veiculo_id',
        '22222222-2222-2222-2222-222222222222'
      );
    });

    it('deve retornar o token após login bem-sucedido', async () => {
      apiMock.post.mockResolvedValueOnce(respostaMock);

      const token = await login('joao@fordconnect.com', 'ford@123');

      expect(token).toBe('jwt-valido');
    });

    it('deve propagar erro quando a API retorna 401', async () => {
      const erro = Object.assign(new Error('Credenciais inválidas'), {
        response: { status: 401 },
      });
      apiMock.post.mockRejectedValueOnce(erro);

      await expect(login('errado@email.com', 'senha-errada')).rejects.toThrow(
        'Credenciais inválidas'
      );
    });
  });

  describe('obterToken()', () => {
    it('deve retornar o token armazenado', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('jwt-armazenado');

      const token = await obterToken();

      expect(token).toBe('jwt-armazenado');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('ford_jwt_token');
    });

    it('deve retornar null quando não há token', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const token = await obterToken();

      expect(token).toBeNull();
    });
  });

  describe('obterVeiculoId()', () => {
    it('deve retornar o veiculoId armazenado', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(
        '22222222-2222-2222-2222-222222222222'
      );

      const id = await obterVeiculoId();

      expect(id).toBe('22222222-2222-2222-2222-222222222222');
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('ford_veiculo_id');
    });

    it('deve retornar null quando não há veiculoId', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

      const id = await obterVeiculoId();

      expect(id).toBeNull();
    });
  });

  describe('limparSessao()', () => {
    it('deve apagar token e veiculoId do SecureStore', async () => {
      await limparSessao();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('ford_jwt_token');
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('ford_veiculo_id');
    });
  });
});
