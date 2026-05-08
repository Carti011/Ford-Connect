import { buscarVeiculo } from '../../services/veiculo';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const veiculoSeed = {
  id: '22222222-2222-2222-2222-222222222222',
  nomeProprietario: 'João Silva',
  marca: 'Ford',
  modelo: 'Ranger',
  versao: 'XLS 2.2 TDCi 4x4 AT',
  ano: 2022,
  placa: 'BRA2E19',
  quilometragem: 47350,
};

describe('veiculo service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarVeiculo()', () => {
    it('deve chamar GET /api/veiculos/{id} com o ID correto', async () => {
      apiMock.get.mockResolvedValueOnce({ data: veiculoSeed });

      await buscarVeiculo('22222222-2222-2222-2222-222222222222');

      expect(apiMock.get).toHaveBeenCalledWith(
        '/api/veiculos/22222222-2222-2222-2222-222222222222'
      );
    });

    it('deve retornar os campos do veículo corretamente', async () => {
      apiMock.get.mockResolvedValueOnce({ data: veiculoSeed });

      const resultado = await buscarVeiculo('22222222-2222-2222-2222-222222222222');

      expect(resultado.modelo).toBe('Ranger');
      expect(resultado.placa).toBe('BRA2E19');
      expect(resultado.quilometragem).toBe(47350);
      expect(resultado.nomeProprietario).toBe('João Silva');
    });

    it('deve propagar erro 404 quando veículo não encontrado', async () => {
      const erro = Object.assign(new Error('Not Found'), {
        response: { status: 404 },
      });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(buscarVeiculo('id-inexistente')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('deve propagar erro 401 quando token inválido', async () => {
      const erro = Object.assign(new Error('Unauthorized'), {
        response: { status: 401 },
      });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(buscarVeiculo('22222222-2222-2222-2222-222222222222')).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });
});
