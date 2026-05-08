import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../../hooks/useAuth';

const mockReplace = jest.fn();

jest.mock('../../services/auth', () => ({
  obterToken: jest.fn(),
  obterVeiculoId: jest.fn(),
  login: jest.fn(),
  limparSessao: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

import * as authService from '../../services/auth';
const authMock = authService as jest.Mocked<typeof authService>;

describe('useAuth', () => {
  beforeEach(() => jest.clearAllMocks());

  it('estaAutenticado é false quando não há token', async () => {
    authMock.obterToken.mockResolvedValueOnce(null);
    authMock.obterVeiculoId.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAuth());

    await act(async () => {});

    expect(result.current.estaAutenticado).toBe(false);
  });

  it('estaAutenticado é true quando há token', async () => {
    authMock.obterToken.mockResolvedValueOnce('jwt-valido');
    authMock.obterVeiculoId.mockResolvedValueOnce('22222222-2222-2222-2222-222222222222');

    const { result } = renderHook(() => useAuth());

    await act(async () => {});

    expect(result.current.estaAutenticado).toBe(true);
  });

  it('carregando é true antes da verificação e false depois', async () => {
    authMock.obterToken.mockResolvedValueOnce(null);
    authMock.obterVeiculoId.mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.carregando).toBe(true);

    await act(async () => {});

    expect(result.current.carregando).toBe(false);
  });

  it('idVeiculo é preenchido com o valor do SecureStore', async () => {
    authMock.obterToken.mockResolvedValueOnce('jwt-valido');
    authMock.obterVeiculoId.mockResolvedValueOnce('22222222-2222-2222-2222-222222222222');

    const { result } = renderHook(() => useAuth());

    await act(async () => {});

    expect(result.current.idVeiculo).toBe('22222222-2222-2222-2222-222222222222');
  });

  it('entrar() chama login e atualiza estaAutenticado para true', async () => {
    authMock.obterToken.mockResolvedValueOnce(null);
    authMock.obterVeiculoId.mockResolvedValueOnce(null);
    authMock.login.mockResolvedValueOnce('novo-token');

    const { result } = renderHook(() => useAuth());
    await act(async () => {});

    await act(async () => {
      await result.current.entrar('joao@fordconnect.com', 'ford@123');
    });

    expect(authMock.login).toHaveBeenCalledWith('joao@fordconnect.com', 'ford@123');
    expect(result.current.estaAutenticado).toBe(true);
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('sair() chama limparSessao e atualiza estaAutenticado para false', async () => {
    authMock.obterToken.mockResolvedValueOnce('jwt-valido');
    authMock.obterVeiculoId.mockResolvedValueOnce('22222222-2222-2222-2222-222222222222');
    authMock.limparSessao.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth());
    await act(async () => {});

    await act(async () => {
      await result.current.sair();
    });

    expect(authMock.limparSessao).toHaveBeenCalled();
    expect(result.current.estaAutenticado).toBe(false);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});
