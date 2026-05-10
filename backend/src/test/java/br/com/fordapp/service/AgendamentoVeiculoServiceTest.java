package br.com.fordapp.service;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.model.AgendamentoVeiculo;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.AgendamentoVeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgendamentoVeiculoServiceTest {

    @Mock
    private AgendamentoVeiculoRepository agendamentoRepository;

    @InjectMocks
    private AgendamentoVeiculoService agendamentoService;

    private UUID veiculoId;
    private AgendamentoVeiculo agendamentoMotor;
    private AgendamentoVeiculo agendamentoClima;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();

        Veiculo veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        agendamentoMotor = new AgendamentoVeiculo();
        agendamentoMotor.setId(UUID.randomUUID());
        agendamentoMotor.setVeiculo(veiculo);
        agendamentoMotor.setTipo("motor");
        agendamentoMotor.setRotulo("Ligar o motor · Dias úteis");
        agendamentoMotor.setHora("07:30");
        agendamentoMotor.setDiasSemana("DIAS_UTEIS");
        agendamentoMotor.setAtivo(true);

        agendamentoClima = new AgendamentoVeiculo();
        agendamentoClima.setId(UUID.randomUUID());
        agendamentoClima.setVeiculo(veiculo);
        agendamentoClima.setTipo("clima");
        agendamentoClima.setRotulo("Climatização automática");
        agendamentoClima.setHora("08:00");
        agendamentoClima.setAtivo(false);
    }

    @Test
    void deveRetornarDiasSemanaNoResponse() {
        when(agendamentoRepository.findByVeiculoId(veiculoId))
                .thenReturn(List.of(agendamentoMotor));

        List<AgendamentoVeiculoResponse> resultado = agendamentoService.listarPorVeiculo(veiculoId);

        assertThat(resultado.get(0).getDiasSemana()).isEqualTo("DIAS_UTEIS");
    }

    @Test
    void deveListarAgendamentosPorVeiculo() {
        when(agendamentoRepository.findByVeiculoId(veiculoId))
                .thenReturn(List.of(agendamentoMotor, agendamentoClima));

        List<AgendamentoVeiculoResponse> resultado = agendamentoService.listarPorVeiculo(veiculoId);

        assertThat(resultado).hasSize(2);
        assertThat(resultado.get(0).getTipo()).isEqualTo("motor");
        assertThat(resultado.get(0).getAtivo()).isTrue();
        assertThat(resultado.get(1).getTipo()).isEqualTo("clima");
        assertThat(resultado.get(1).getAtivo()).isFalse();
    }

    @Test
    void deveAlternarAtivoParaFalse() {
        when(agendamentoRepository.findById(agendamentoMotor.getId()))
                .thenReturn(Optional.of(agendamentoMotor));
        when(agendamentoRepository.save(agendamentoMotor)).thenReturn(agendamentoMotor);

        AgendamentoVeiculoResponse resultado = agendamentoService.alternarAtivo(agendamentoMotor.getId());

        assertThat(resultado.getAtivo()).isFalse();
        verify(agendamentoRepository).save(agendamentoMotor);
    }

    @Test
    void deveAlternarAtivoParaTrue() {
        when(agendamentoRepository.findById(agendamentoClima.getId()))
                .thenReturn(Optional.of(agendamentoClima));
        when(agendamentoRepository.save(agendamentoClima)).thenReturn(agendamentoClima);

        AgendamentoVeiculoResponse resultado = agendamentoService.alternarAtivo(agendamentoClima.getId());

        assertThat(resultado.getAtivo()).isTrue();
        verify(agendamentoRepository).save(agendamentoClima);
    }

    @Test
    void deveLancarExcecaoQuandoAgendamentoNaoEncontrado() {
        UUID idInexistente = UUID.randomUUID();
        when(agendamentoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> agendamentoService.alternarAtivo(idInexistente))
                .isInstanceOf(NoSuchElementException.class);
    }
}
