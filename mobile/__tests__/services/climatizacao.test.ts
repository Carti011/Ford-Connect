import {
  buscarClimatizacao,
  atualizarClimatizacao,
  atualizarZonaClimatizacao,
} from '../../services/climatizacao';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), patch: jest.fn() },
}));

import api from '../../services/api';
const apiMock = api as jest.Mocked<typeof api>;

const VEICULO_ID = '22222222-2222-2222-2222-222222222222';
const ZONA_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

const estadoSeed = {
  id: '33333333-3333-3333-3333-333333333333',
  veiculoId: VEICULO_ID,
  sistemaLigado: true,
  modo: 'ac',
  velocidadeVentilador: 4,
  temperaturaInterna: 28,
  temperaturaExterna: 31,
  zonas: [
    { id: ZONA_ID, rotulo: 'Motorista',  temperatura: 22, ativa: true,  ordem: 0 },
    { id: 'bb',    rotulo: 'Passageiro', temperatura: 20, ativa: false, ordem: 1 },
  ],
};

describe('climatizacao service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('buscarClimatizacao()', () => {
    it('deve chamar GET /api/veiculos/{id}/climatizacao', async () => {
      apiMock.get.mockResolvedValueOnce({ data: estadoSeed });

      await buscarClimatizacao(VEICULO_ID);

      expect(apiMock.get).toHaveBeenCalledWith(`/api/veiculos/${VEICULO_ID}/climatizacao`);
    });

    it('deve retornar estado completo com zonas e sensores', async () => {
      apiMock.get.mockResolvedValueOnce({ data: estadoSeed });

      const resultado = await buscarClimatizacao(VEICULO_ID);

      expect(resultado.sistemaLigado).toBe(true);
      expect(resultado.modo).toBe('ac');
      expect(resultado.temperaturaInterna).toBe(28);
      expect(resultado.temperaturaExterna).toBe(31);
      expect(resultado.zonas).toHaveLength(2);
      expect(resultado.zonas[0].rotulo).toBe('Motorista');
      expect(resultado.zonas[0].ativa).toBe(true);
    });

    it('deve propagar erro 404 quando veículo sem estado', async () => {
      const erro = Object.assign(new Error('Not Found'), { response: { status: 404 } });
      apiMock.get.mockRejectedValueOnce(erro);

      await expect(buscarClimatizacao(VEICULO_ID)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('atualizarClimatizacao()', () => {
    it('deve chamar PATCH /api/veiculos/{id}/climatizacao com o body parcial', async () => {
      apiMock.patch.mockResolvedValueOnce({ data: { ...estadoSeed, velocidadeVentilador: 5 } });

      await atualizarClimatizacao(VEICULO_ID, { velocidadeVentilador: 5 });

      expect(apiMock.patch).toHaveBeenCalledWith(
        `/api/veiculos/${VEICULO_ID}/climatizacao`,
        { velocidadeVentilador: 5 },
      );
    });

    it('deve aceitar atualização parcial de múltiplos campos', async () => {
      apiMock.patch.mockResolvedValueOnce({
        data: { ...estadoSeed, modo: 'aquecedor', velocidadeVentilador: 6 },
      });

      const resultado = await atualizarClimatizacao(VEICULO_ID, {
        modo: 'aquecedor',
        velocidadeVentilador: 6,
      });

      expect(resultado.modo).toBe('aquecedor');
      expect(resultado.velocidadeVentilador).toBe(6);
    });

    it('deve propagar erro 400 com payload inválido', async () => {
      const erro = Object.assign(new Error('Bad Request'), { response: { status: 400 } });
      apiMock.patch.mockRejectedValueOnce(erro);

      await expect(
        atualizarClimatizacao(VEICULO_ID, { velocidadeVentilador: 99 }),
      ).rejects.toMatchObject({ response: { status: 400 } });
    });
  });

  describe('atualizarZonaClimatizacao()', () => {
    it('deve chamar PATCH /api/veiculos/{id}/climatizacao/zonas/{idZona}', async () => {
      apiMock.patch.mockResolvedValueOnce({
        data: { id: ZONA_ID, rotulo: 'Motorista', temperatura: 22, ativa: false, ordem: 0 },
      });

      await atualizarZonaClimatizacao(VEICULO_ID, ZONA_ID, { ativa: false });

      expect(apiMock.patch).toHaveBeenCalledWith(
        `/api/veiculos/${VEICULO_ID}/climatizacao/zonas/${ZONA_ID}`,
        { ativa: false },
      );
    });

    it('deve retornar a zona atualizada', async () => {
      apiMock.patch.mockResolvedValueOnce({
        data: { id: ZONA_ID, rotulo: 'Passageiro', temperatura: 23, ativa: true, ordem: 1 },
      });

      const resultado = await atualizarZonaClimatizacao(VEICULO_ID, ZONA_ID, {
        temperatura: 23,
        ativa: true,
      });

      expect(resultado.temperatura).toBe(23);
      expect(resultado.ativa).toBe(true);
    });

    it('deve propagar erro 404 quando zona não pertence ao veículo', async () => {
      const erro = Object.assign(new Error('Not Found'), { response: { status: 404 } });
      apiMock.patch.mockRejectedValueOnce(erro);

      await expect(
        atualizarZonaClimatizacao(VEICULO_ID, ZONA_ID, { ativa: true }),
      ).rejects.toMatchObject({ response: { status: 404 } });
    });
  });
});
