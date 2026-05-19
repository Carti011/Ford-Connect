import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { CartaoGarantia } from '../../components/CartaoGarantia';
import { Veiculo, Recomendacao } from '../../types';

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

function recomendacao(overrides: Partial<Recomendacao> = {}): Recomendacao {
  return {
    id: 'rec-' + Math.random().toString(36).slice(2),
    titulo: 'Revisão',
    descricao: '',
    tipo: 'revisao',
    obrigatoria: false,
    dataLimite: null,
    quilometragemLimite: null,
    prioridade: 'media',
    custoMin: 100,
    custoMax: 200,
    porQueImporta: null,
    resolvido: false,
    status: 'em_dia',
    ...overrides,
  };
}

const SEM_AGENDAMENTOS = new Set<string>();

describe('CartaoGarantia', () => {
  it('exibe estado normal quando nao ha recomendacao obrigatoria atrasada', () => {
    render(
      <CartaoGarantia
        veiculo={veiculoBase()}
        recomendacoes={[recomendacao({ obrigatoria: true, status: 'em_dia' })]}
        recomendacaoIdsAgendadas={SEM_AGENDAMENTOS}
      />
    );

    expect(screen.getByText('Garantia ativa')).toBeTruthy();
    expect(screen.queryByText(/Garantia em risco/)).toBeNull();
    expect(screen.queryByText(/perda de cobertura/)).toBeNull();
  });

  it('exibe estado de risco quando ha recomendacao obrigatoria atrasada nao agendada', () => {
    render(
      <CartaoGarantia
        veiculo={veiculoBase()}
        recomendacoes={[
          recomendacao({ obrigatoria: true, status: 'atrasada' }),
          recomendacao({ obrigatoria: false, status: 'em_dia' }),
        ]}
        recomendacaoIdsAgendadas={SEM_AGENDAMENTOS}
      />
    );

    expect(screen.getByText('Garantia em risco')).toBeTruthy();
    expect(screen.getByText(/perda de cobertura/)).toBeTruthy();
  });

  it('exibe estado de revisao agendada quando a obrigatoria atrasada esta agendada', () => {
    const obrigatoria = recomendacao({ obrigatoria: true, status: 'atrasada' });

    render(
      <CartaoGarantia
        veiculo={veiculoBase()}
        recomendacoes={[obrigatoria]}
        recomendacaoIdsAgendadas={new Set([obrigatoria.id])}
      />
    );

    expect(screen.getByText('Revisão agendada')).toBeTruthy();
    expect(screen.getByText(/garantia segue protegida/)).toBeTruthy();
    expect(screen.queryByText('Garantia em risco')).toBeNull();
  });

  it('nao exibe estado de risco quando recomendacao atrasada nao e obrigatoria', () => {
    render(
      <CartaoGarantia
        veiculo={veiculoBase()}
        recomendacoes={[recomendacao({ obrigatoria: false, status: 'atrasada' })]}
        recomendacaoIdsAgendadas={SEM_AGENDAMENTOS}
      />
    );

    expect(screen.getByText('Garantia ativa')).toBeTruthy();
    expect(screen.queryByText(/Garantia em risco/)).toBeNull();
  });

  it('nao renderiza quando veiculo nao tem dados de garantia', () => {
    const { toJSON } = render(
      <CartaoGarantia
        veiculo={veiculoBase({ garantiaDataLimite: null, garantiaKmLimite: null })}
        recomendacoes={[]}
        recomendacaoIdsAgendadas={SEM_AGENDAMENTOS}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('mostra km restantes calculados a partir da quilometragem atual', () => {
    render(
      <CartaoGarantia
        veiculo={veiculoBase({ quilometragem: 12000, garantiaKmLimite: 30000 })}
        recomendacoes={[]}
        recomendacaoIdsAgendadas={SEM_AGENDAMENTOS}
      />
    );

    expect(screen.getByText(/faltam 18\.000 km/)).toBeTruthy();
  });
});
