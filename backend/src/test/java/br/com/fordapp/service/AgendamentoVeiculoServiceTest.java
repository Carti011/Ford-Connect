package br.com.fordapp.service;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.dto.AtualizarAgendamentoRequest;
import br.com.fordapp.dto.CriarAgendamentoRequest;
import br.com.fordapp.model.AgendamentoVeiculo;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.AgendamentoVeiculoRepository;
import br.com.fordapp.repository.VeiculoRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgendamentoVeiculoServiceTest {

    @Mock
    private AgendamentoVeiculoRepository agendamentoRepository;

    @Mock
    private VeiculoRepository veiculoRepository;

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
        agendamentoMotor.setDiasSemana("1,2,3,4,5");
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

        assertThat(resultado.get(0).getDiasSemana()).isEqualTo("1,2,3,4,5");
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

    @Test
    void deveAtualizarHoraEDiasSemana() {
        AtualizarAgendamentoRequest request = new AtualizarAgendamentoRequest();
        request.setHora("09:00");
        request.setDiasSemana("0,6");

        when(agendamentoRepository.findById(agendamentoMotor.getId()))
                .thenReturn(Optional.of(agendamentoMotor));
        when(agendamentoRepository.save(agendamentoMotor)).thenReturn(agendamentoMotor);

        AgendamentoVeiculoResponse resultado = agendamentoService.atualizar(agendamentoMotor.getId(), request);

        assertThat(resultado.getHora()).isEqualTo("09:00");
        assertThat(resultado.getDiasSemana()).isEqualTo("0,6");
        verify(agendamentoRepository).save(agendamentoMotor);
    }

    @Test
    void deveLancarExcecaoAoAtualizarAgendamentoInexistente() {
        UUID idInexistente = UUID.randomUUID();
        AtualizarAgendamentoRequest request = new AtualizarAgendamentoRequest();
        request.setHora("09:00");
        request.setDiasSemana("0,1,2,3,4,5,6");

        when(agendamentoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> agendamentoService.atualizar(idInexistente, request))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveCriarAgendamento() {
        Veiculo veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        CriarAgendamentoRequest request = new CriarAgendamentoRequest();
        request.setTipo("motor");
        request.setRotulo("Ligar o motor");
        request.setHora("06:00");
        request.setDiasSemana("1,2,3,4,5");

        AgendamentoVeiculo salvo = new AgendamentoVeiculo();
        salvo.setId(UUID.randomUUID());
        salvo.setVeiculo(veiculo);
        salvo.setTipo("motor");
        salvo.setRotulo("Ligar o motor");
        salvo.setHora("06:00");
        salvo.setDiasSemana("1,2,3,4,5");
        salvo.setAtivo(false);

        when(veiculoRepository.findById(veiculoId)).thenReturn(Optional.of(veiculo));
        when(agendamentoRepository.save(any())).thenReturn(salvo);

        AgendamentoVeiculoResponse resultado = agendamentoService.criar(veiculoId, request);

        assertThat(resultado.getTipo()).isEqualTo("motor");
        assertThat(resultado.getHora()).isEqualTo("06:00");
        assertThat(resultado.getDiasSemana()).isEqualTo("1,2,3,4,5");
        assertThat(resultado.getAtivo()).isFalse();
        verify(agendamentoRepository).save(any());
    }

    @Test
    void deveLancarExcecaoAoCriarParaVeiculoInexistente() {
        UUID idInexistente = UUID.randomUUID();
        CriarAgendamentoRequest request = new CriarAgendamentoRequest();
        request.setTipo("motor");
        request.setRotulo("Ligar o motor");

        when(veiculoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> agendamentoService.criar(idInexistente, request))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveDeletarAgendamento() {
        when(agendamentoRepository.findById(agendamentoMotor.getId()))
                .thenReturn(Optional.of(agendamentoMotor));

        agendamentoService.deletar(agendamentoMotor.getId());

        verify(agendamentoRepository).delete(agendamentoMotor);
    }

    @Test
    void deveLancarExcecaoAoDeletarInexistente() {
        UUID idInexistente = UUID.randomUUID();
        when(agendamentoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> agendamentoService.deletar(idInexistente))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveAtualizarDuracaoEAlvoTemperatura() {
        AtualizarAgendamentoRequest request = new AtualizarAgendamentoRequest();
        request.setDuracaoMinutos(15);
        request.setAlvoTemperatura(24);

        when(agendamentoRepository.findById(agendamentoMotor.getId()))
                .thenReturn(Optional.of(agendamentoMotor));
        when(agendamentoRepository.save(agendamentoMotor)).thenReturn(agendamentoMotor);

        AgendamentoVeiculoResponse resultado = agendamentoService.atualizar(agendamentoMotor.getId(), request);

        assertThat(resultado.getDuracaoMinutos()).isEqualTo(15);
        assertThat(resultado.getAlvoTemperatura()).isEqualTo(24);
    }

    @Test
    void atualizarParcialDeveManterCamposNaoEnviados() {
        agendamentoMotor.setDuracaoMinutos(10);
        agendamentoMotor.setAlvoTemperatura(22);

        AtualizarAgendamentoRequest request = new AtualizarAgendamentoRequest();
        request.setHora("08:15");

        when(agendamentoRepository.findById(agendamentoMotor.getId()))
                .thenReturn(Optional.of(agendamentoMotor));
        when(agendamentoRepository.save(agendamentoMotor)).thenReturn(agendamentoMotor);

        AgendamentoVeiculoResponse resultado = agendamentoService.atualizar(agendamentoMotor.getId(), request);

        assertThat(resultado.getHora()).isEqualTo("08:15");
        assertThat(resultado.getDuracaoMinutos()).isEqualTo(10);
        assertThat(resultado.getAlvoTemperatura()).isEqualTo(22);
        assertThat(resultado.getDiasSemana()).isEqualTo("1,2,3,4,5");
    }
}
