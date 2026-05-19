import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CartaoFidelidade } from '../../components/CartaoFidelidade';
import { Veiculo, RegistroManutencao } from '../../types';

function veiculoBase(overrides: Partial<Veiculo> = {}): Veiculo {
  return {
    id: 'veiculo-1',
    nomeProprietario: 'João Silva',
    marca: 'Ford',
    modelo: 'Ranger',
    versao: 'XLS',
    ano: 2022,
    placa: 'BRA2E19',
    quilometragem: 12000,
    statusVeiculo: 'estacionado',
    nivelCombustivel: 60,
    autonomiaKm: 480,
    climatizacaoAutomatica: true,
    desembacarParabrisa: true,
    bancoAquecido: false,
    notificar: true,
    scoreSaude: 78,
    garantiaDataLimite: '2026-10-18',
    garantiaKmLimite: 30000,
    ...overrides,
  };
}

function manutencao(overrides: Partial<RegistroManutencao> = {}): RegistroManutencao {
  return {
    id: 'm-' + Math.random().toString(36).slice(2),
    tipo: 'Revisão',
    descricao: '',
    quilometragemNoServico: 5000,
    dataServico: '2025-12-01',
    concessionaria: 'Ford Lapa — São Paulo/SP',
    custo: 100,
    ...overrides,
  };
}

describe('CartaoFidelidade', () => {
  it('nao renderiza quando nao ha manutencoes', () => {
    const { toJSON } = render(
      <CartaoFidelidade veiculo={veiculoBase()} manutencoes={[]} />
    );

    expect(toJSON()).toBeNull();
  });

  it('exibe titulo Cliente fiel quando todas as visitas sao na rede Ford', () => {
    render(
      <CartaoFidelidade
        veiculo={veiculoBase()}
        manutencoes={[
          manutencao({ concessionaria: 'Ford Lapa', custo: 100 }),
          manutencao({ concessionaria: 'Ford Tatuapé', custo: 200 }),
        ]}
      />
    );

    expect(screen.getByText(/Cliente fiel/)).toBeTruthy();
    expect(screen.getByText(/100% dos serviços na rede Ford/)).toBeTruthy();
    expect(screen.getByText(/2 de 2 visitas/)).toBeTruthy();
  });

  it('calcula percentual menor quando ha visita fora da rede', () => {
    render(
      <CartaoFidelidade
        veiculo={veiculoBase()}
        manutencoes={[
          manutencao({ concessionaria: 'Ford Lapa', custo: 100 }),
          manutencao({ concessionaria: 'Mecânico do bairro', custo: 50 }),
          manutencao({ concessionaria: 'Ford Tatuapé', custo: 200 }),
        ]}
      />
    );

    expect(screen.getByText(/67% dos serviços na rede Ford/)).toBeTruthy();
    expect(screen.getByText(/2 de 3 visitas/)).toBeTruthy();
    expect(screen.queryByText(/Cliente fiel/)).toBeNull();
  });

  it('soma o total investido considerando custos nulos como zero', () => {
    render(
      <CartaoFidelidade
        veiculo={veiculoBase()}
        manutencoes={[
          manutencao({ concessionaria: 'Ford Lapa', custo: 80 }),
          manutencao({ concessionaria: 'Ford Lapa', custo: null }),
          manutencao({ concessionaria: 'Ford Lapa', custo: 240 }),
        ]}
      />
    );

    expect(screen.getByText(/R\$\s?320/)).toBeTruthy();
  });

  it('exibe proximo marco de 20.000 km quando veiculo esta abaixo', () => {
    render(
      <CartaoFidelidade
        veiculo={veiculoBase({ quilometragem: 12000 })}
        manutencoes={[
          manutencao({ concessionaria: 'Ford Lapa', dataServico: '2025-10-15', custo: 0 }),
        ]}
      />
    );

    expect(screen.getByText(/Próxima revisão obrigatória: 20\.000 km/)).toBeTruthy();
  });

  it('nao exibe proximo marco quando veiculo ja passou de 20.000 km', () => {
    render(
      <CartaoFidelidade
        veiculo={veiculoBase({ quilometragem: 25000 })}
        manutencoes={[
          manutencao({ concessionaria: 'Ford Lapa', custo: 100 }),
        ]}
      />
    );

    expect(screen.queryByText(/Próxima revisão obrigatória/)).toBeNull();
  });
});
