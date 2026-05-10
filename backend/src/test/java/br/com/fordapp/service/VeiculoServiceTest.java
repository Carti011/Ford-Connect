package br.com.fordapp.service;

import br.com.fordapp.dto.VeiculoResponse;
import br.com.fordapp.model.Usuario;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VeiculoServiceTest {

    @Mock
    private VeiculoRepository veiculoRepository;

    @InjectMocks
    private VeiculoService veiculoService;

    private Veiculo veiculo;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario("João Silva", "joao@fordconnect.com", "hash");
        usuario.setId(UUID.randomUUID());

        veiculo = new Veiculo();
        veiculo.setId(UUID.randomUUID());
        veiculo.setUsuario(usuario);
        veiculo.setNomeProprietario("João Silva");
        veiculo.setMarca("Ford");
        veiculo.setModelo("Ranger");
        veiculo.setVersao("XLS 2.2 TDCi 4x4 AT");
        veiculo.setAno(2022);
        veiculo.setPlaca("BRA2E19");
        veiculo.setQuilometragem(47350);
    }

    @Test
    void deveRetornarVeiculoQuandoIdExistente() {
        when(veiculoRepository.findById(veiculo.getId())).thenReturn(Optional.of(veiculo));

        VeiculoResponse response = veiculoService.buscarPorId(veiculo.getId());

        assertThat(response.getId()).isEqualTo(veiculo.getId());
        assertThat(response.getModelo()).isEqualTo("Ranger");
        assertThat(response.getAno()).isEqualTo(2022);
        assertThat(response.getQuilometragem()).isEqualTo(47350);
    }

    @Test
    void deveRetornarVeiculoComDadosExpandidos() {
        veiculo.setStatusVeiculo("Estacionado");
        veiculo.setNivelCombustivel(80);
        veiculo.setAutonomiaKm(400);
        when(veiculoRepository.findById(veiculo.getId())).thenReturn(Optional.of(veiculo));

        VeiculoResponse response = veiculoService.buscarPorId(veiculo.getId());

        assertThat(response.getStatusVeiculo()).isEqualTo("Estacionado");
        assertThat(response.getNivelCombustivel()).isEqualTo(80);
        assertThat(response.getAutonomiaKm()).isEqualTo(400);
    }

    @Test
    void deveLancarExcecaoQuandoVeiculoNaoEncontrado() {
        UUID idInexistente = UUID.randomUUID();
        when(veiculoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> veiculoService.buscarPorId(idInexistente))
                .isInstanceOf(NoSuchElementException.class);
    }
}
