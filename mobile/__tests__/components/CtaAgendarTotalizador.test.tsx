import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { CtaAgendarTotalizador } from '../../components/CtaAgendarTotalizador';
import { Recomendacao } from '../../types';

const onPressMock = jest.fn();

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
    custoMin: null,
    custoMax: null,
    porQueImporta: null,
    resolvido: false,
    status: 'em_dia',
    ...overrides,
  };
}

describe('CtaAgendarTotalizador', () => {
  beforeEach(() => jest.clearAllMocks());

  it('nao renderiza quando todas as recomendacoes estao em dia', () => {
    const { toJSON } = render(
      <CtaAgendarTotalizador
        recomendacoes={[
          recomendacao({ status: 'em_dia', custoMin: 100, custoMax: 200 }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(toJSON()).toBeNull();
  });

  it('soma custoMin e custoMax apenas das pendentes (atrasada + proxima)', () => {
    render(
      <CtaAgendarTotalizador
        recomendacoes={[
          recomendacao({ status: 'atrasada', custoMin: 480, custoMax: 620 }),
          recomendacao({ status: 'proxima', custoMin: 280, custoMax: 420 }),
          recomendacao({ status: 'em_dia', custoMin: 120, custoMax: 180 }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Agendar 2 serviços')).toBeTruthy();
    expect(screen.getByText(/R\$\s?760/)).toBeTruthy();
    expect(screen.getByText(/R\$\s?1\.040/)).toBeTruthy();
  });

  it('usa singular servico quando ha apenas uma pendente', () => {
    render(
      <CtaAgendarTotalizador
        recomendacoes={[
          recomendacao({ status: 'atrasada', custoMin: 480, custoMax: 620 }),
        ]}
        onPress={onPressMock}
      />
    );

    expect(screen.getByText('Agendar 1 serviço')).toBeTruthy();
  });

  it('chama onPress ao tocar no botao', () => {
    render(
      <CtaAgendarTotalizador
        recomendacoes={[
          recomendacao({ status: 'atrasada', custoMin: 100, custoMax: 200 }),
        ]}
        onPress={onPressMock}
      />
    );

    fireEvent.press(screen.getByText('Agendar 1 serviço'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
