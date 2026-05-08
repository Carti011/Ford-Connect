import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { FormularioLogin } from '../../components/FormularioLogin';

const onSubmitMock = jest.fn();

describe('FormularioLogin', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve renderizar campo de e-mail e senha', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={false} erro={null} />);

    expect(screen.getByPlaceholderText('E-mail')).toBeTruthy();
    expect(screen.getByPlaceholderText('Senha')).toBeTruthy();
  });

  it('deve renderizar botão Entrar', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={false} erro={null} />);

    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('deve chamar onSubmit com email e senha ao pressionar Entrar', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={false} erro={null} />);

    fireEvent.changeText(screen.getByPlaceholderText('E-mail'), 'joao@fordconnect.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'ford@123');
    fireEvent.press(screen.getByText('Entrar'));

    expect(onSubmitMock).toHaveBeenCalledWith('joao@fordconnect.com', 'ford@123');
  });

  it('não deve chamar onSubmit quando e-mail está vazio', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={false} erro={null} />);

    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'ford@123');
    fireEvent.press(screen.getByText('Entrar'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('não deve chamar onSubmit quando senha está vazia', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={false} erro={null} />);

    fireEvent.changeText(screen.getByPlaceholderText('E-mail'), 'joao@fordconnect.com');
    fireEvent.press(screen.getByText('Entrar'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('deve exibir mensagem de erro quando prop erro não é null', () => {
    render(
      <FormularioLogin
        onSubmit={onSubmitMock}
        carregando={false}
        erro="E-mail ou senha incorretos."
      />
    );

    expect(screen.getByText('E-mail ou senha incorretos.')).toBeTruthy();
  });

  it('deve ocultar botão Entrar e exibir indicador quando carregando é true', () => {
    render(<FormularioLogin onSubmit={onSubmitMock} carregando={true} erro={null} />);

    expect(screen.queryByText('Entrar')).toBeNull();
    expect(screen.getByTestId('indicador-carregando')).toBeTruthy();
  });
});
