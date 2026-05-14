package br.com.fordapp.service;

import br.com.fordapp.dto.AtualizarClimatizacaoRequest;
import br.com.fordapp.dto.AtualizarZonaClimatizacaoRequest;
import br.com.fordapp.dto.EstadoClimatizacaoResponse;
import br.com.fordapp.dto.ZonaClimatizacaoResponse;
import br.com.fordapp.model.EstadoClimatizacao;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.model.ZonaClimatizacao;
import br.com.fordapp.repository.EstadoClimatizacaoRepository;
import br.com.fordapp.repository.ZonaClimatizacaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EstadoClimatizacaoServiceTest {

    @Mock
    private EstadoClimatizacaoRepository estadoRepository;

    @Mock
    private ZonaClimatizacaoRepository zonaRepository;

    @InjectMocks
    private EstadoClimatizacaoService climatizacaoService;

    private UUID veiculoId;
    private UUID estadoId;
    private UUID zonaMotoristaId;
    private UUID zonaPassageiroId;
    private Veiculo veiculo;
    private EstadoClimatizacao estado;
    private ZonaClimatizacao zonaMotorista;
    private ZonaClimatizacao zonaPassageiro;

    @BeforeEach
    void setUp() {
        veiculoId = UUID.randomUUID();
        estadoId = UUID.randomUUID();
        zonaMotoristaId = UUID.randomUUID();
        zonaPassageiroId = UUID.randomUUID();

        veiculo = new Veiculo();
        veiculo.setId(veiculoId);

        estado = new EstadoClimatizacao();
        estado.setId(estadoId);
        estado.setVeiculo(veiculo);
        estado.setSistemaLigado(true);
        estado.setModo("ac");
        estado.setVelocidadeVentilador(4);

        zonaMotorista = new ZonaClimatizacao();
        zonaMotorista.setId(zonaMotoristaId);
        zonaMotorista.setEstadoClimatizacao(estado);
        zonaMotorista.setRotulo("Motorista");
        zonaMotorista.setTemperatura(22);
        zonaMotorista.setAtiva(true);
        zonaMotorista.setOrdem(0);

        zonaPassageiro = new ZonaClimatizacao();
        zonaPassageiro.setId(zonaPassageiroId);
        zonaPassageiro.setEstadoClimatizacao(estado);
        zonaPassageiro.setRotulo("Passageiro");
        zonaPassageiro.setTemperatura(20);
        zonaPassageiro.setAtiva(false);
        zonaPassageiro.setOrdem(1);

        List<ZonaClimatizacao> zonas = new ArrayList<>();
        zonas.add(zonaMotorista);
        zonas.add(zonaPassageiro);
        estado.setZonas(zonas);
    }

    @Test
    void deveBuscarEstadoComSensoresMockados() {
        when(estadoRepository.findByVeiculoId(veiculoId)).thenReturn(Optional.of(estado));

        EstadoClimatizacaoResponse resultado = climatizacaoService.buscarPorVeiculo(veiculoId);

        assertThat(resultado.getSistemaLigado()).isTrue();
        assertThat(resultado.getModo()).isEqualTo("ac");
        assertThat(resultado.getVelocidadeVentilador()).isEqualTo(4);
        assertThat(resultado.getTemperaturaInterna()).isEqualTo(28);
        assertThat(resultado.getTemperaturaExterna()).isEqualTo(31);
        assertThat(resultado.getZonas()).hasSize(2);
        assertThat(resultado.getZonas().get(0).getRotulo()).isEqualTo("Motorista");
        assertThat(resultado.getZonas().get(0).getAtiva()).isTrue();
        assertThat(resultado.getZonas().get(1).getRotulo()).isEqualTo("Passageiro");
        assertThat(resultado.getZonas().get(1).getAtiva()).isFalse();
    }

    @Test
    void deveLancarExcecaoQuandoEstadoNaoEncontrado() {
        when(estadoRepository.findByVeiculoId(veiculoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> climatizacaoService.buscarPorVeiculo(veiculoId))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveAtualizarApenasCamposEnviados() {
        AtualizarClimatizacaoRequest request = new AtualizarClimatizacaoRequest();
        request.setModo("aquecedor");
        request.setVelocidadeVentilador(6);

        when(estadoRepository.findByVeiculoId(veiculoId)).thenReturn(Optional.of(estado));
        when(estadoRepository.save(estado)).thenReturn(estado);

        EstadoClimatizacaoResponse resultado = climatizacaoService.atualizar(veiculoId, request);

        assertThat(resultado.getModo()).isEqualTo("aquecedor");
        assertThat(resultado.getVelocidadeVentilador()).isEqualTo(6);
        assertThat(resultado.getSistemaLigado()).isTrue();
        verify(estadoRepository).save(estado);
    }

    @Test
    void deveDesligarSistema() {
        AtualizarClimatizacaoRequest request = new AtualizarClimatizacaoRequest();
        request.setSistemaLigado(false);

        when(estadoRepository.findByVeiculoId(veiculoId)).thenReturn(Optional.of(estado));
        when(estadoRepository.save(estado)).thenReturn(estado);

        EstadoClimatizacaoResponse resultado = climatizacaoService.atualizar(veiculoId, request);

        assertThat(resultado.getSistemaLigado()).isFalse();
    }

    @Test
    void deveLancarExcecaoAoAtualizarEstadoInexistente() {
        AtualizarClimatizacaoRequest request = new AtualizarClimatizacaoRequest();
        request.setModo("aquecedor");

        when(estadoRepository.findByVeiculoId(veiculoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> climatizacaoService.atualizar(veiculoId, request))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveAtualizarZonaComTemperaturaEAtiva() {
        AtualizarZonaClimatizacaoRequest request = new AtualizarZonaClimatizacaoRequest();
        request.setTemperatura(23);
        request.setAtiva(true);

        when(zonaRepository.findById(zonaPassageiroId)).thenReturn(Optional.of(zonaPassageiro));
        when(zonaRepository.save(zonaPassageiro)).thenReturn(zonaPassageiro);

        ZonaClimatizacaoResponse resultado = climatizacaoService.atualizarZona(veiculoId, zonaPassageiroId, request);

        assertThat(resultado.getTemperatura()).isEqualTo(23);
        assertThat(resultado.getAtiva()).isTrue();
        verify(zonaRepository).save(zonaPassageiro);
    }

    @Test
    void deveLancarExcecaoQuandoZonaNaoPertenceAoVeiculo() {
        UUID outroVeiculoId = UUID.randomUUID();
        AtualizarZonaClimatizacaoRequest request = new AtualizarZonaClimatizacaoRequest();
        request.setAtiva(true);

        when(zonaRepository.findById(zonaPassageiroId)).thenReturn(Optional.of(zonaPassageiro));

        assertThatThrownBy(() -> climatizacaoService.atualizarZona(outroVeiculoId, zonaPassageiroId, request))
                .isInstanceOf(NoSuchElementException.class);
    }

    @Test
    void deveLancarExcecaoAoAtualizarZonaInexistente() {
        UUID idInexistente = UUID.randomUUID();
        AtualizarZonaClimatizacaoRequest request = new AtualizarZonaClimatizacaoRequest();
        request.setAtiva(true);

        when(zonaRepository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> climatizacaoService.atualizarZona(veiculoId, idInexistente, request))
                .isInstanceOf(NoSuchElementException.class);
    }
}
