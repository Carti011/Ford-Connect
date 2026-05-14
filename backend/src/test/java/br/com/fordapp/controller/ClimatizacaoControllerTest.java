package br.com.fordapp.controller;

import br.com.fordapp.dto.EstadoClimatizacaoResponse;
import br.com.fordapp.dto.ZonaClimatizacaoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.EstadoClimatizacaoService;
import br.com.fordapp.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ClimatizacaoController.class)
class ClimatizacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EstadoClimatizacaoService climatizacaoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    private EstadoClimatizacaoResponse exemploEstado(UUID veiculoId) {
        ZonaClimatizacaoResponse motorista = new ZonaClimatizacaoResponse();
        motorista.setId(UUID.randomUUID());
        motorista.setRotulo("Motorista");
        motorista.setTemperatura(22);
        motorista.setAtiva(true);
        motorista.setOrdem(0);

        ZonaClimatizacaoResponse passageiro = new ZonaClimatizacaoResponse();
        passageiro.setId(UUID.randomUUID());
        passageiro.setRotulo("Passageiro");
        passageiro.setTemperatura(20);
        passageiro.setAtiva(false);
        passageiro.setOrdem(1);

        EstadoClimatizacaoResponse estado = new EstadoClimatizacaoResponse();
        estado.setId(UUID.randomUUID());
        estado.setVeiculoId(veiculoId);
        estado.setSistemaLigado(true);
        estado.setModo("ac");
        estado.setVelocidadeVentilador(4);
        estado.setTemperaturaInterna(28);
        estado.setTemperaturaExterna(31);
        estado.setZonas(List.of(motorista, passageiro));
        return estado;
    }

    @Test
    void deveRetornar401QuandoSemAutenticacaoNoGet() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID() + "/climatizacao"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveRetornar401QuandoSemAutenticacaoNoPatch() throws Exception {
        mockMvc.perform(patch("/api/veiculos/" + UUID.randomUUID() + "/climatizacao").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sistemaLigado\":false}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarEstadoComSensores() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(climatizacaoService.buscarPorVeiculo(veiculoId)).thenReturn(exemploEstado(veiculoId));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/climatizacao"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sistemaLigado").value(true))
                .andExpect(jsonPath("$.modo").value("ac"))
                .andExpect(jsonPath("$.velocidadeVentilador").value(4))
                .andExpect(jsonPath("$.temperaturaInterna").value(28))
                .andExpect(jsonPath("$.temperaturaExterna").value(31))
                .andExpect(jsonPath("$.zonas[0].rotulo").value("Motorista"))
                .andExpect(jsonPath("$.zonas[0].ativa").value(true))
                .andExpect(jsonPath("$.zonas[1].rotulo").value("Passageiro"))
                .andExpect(jsonPath("$.zonas[1].ativa").value(false));
    }

    @Test
    @WithMockUser
    void deveRetornar404QuandoVeiculoSemEstadoDeClimatizacao() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(climatizacaoService.buscarPorVeiculo(veiculoId))
                .thenThrow(new NoSuchElementException("Estado de climatização não encontrado"));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/climatizacao"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Estado de climatização não encontrado"));
    }

    @Test
    @WithMockUser
    void deveAtualizarClimatizacao() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        EstadoClimatizacaoResponse response = exemploEstado(veiculoId);
        response.setModo("aquecedor");
        response.setVelocidadeVentilador(6);

        when(climatizacaoService.atualizar(eq(veiculoId), any())).thenReturn(response);

        mockMvc.perform(patch("/api/veiculos/" + veiculoId + "/climatizacao").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modo\":\"aquecedor\",\"velocidadeVentilador\":6}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modo").value("aquecedor"))
                .andExpect(jsonPath("$.velocidadeVentilador").value(6));
    }

    @Test
    @WithMockUser
    void deveRetornar400ComModoInvalido() throws Exception {
        mockMvc.perform(patch("/api/veiculos/" + UUID.randomUUID() + "/climatizacao").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"modo\":\"turbo\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void deveRetornar400ComVelocidadeForaDoRange() throws Exception {
        mockMvc.perform(patch("/api/veiculos/" + UUID.randomUUID() + "/climatizacao").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"velocidadeVentilador\":9}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void deveAtualizarZona() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        UUID zonaId = UUID.randomUUID();

        ZonaClimatizacaoResponse zona = new ZonaClimatizacaoResponse();
        zona.setId(zonaId);
        zona.setRotulo("Passageiro");
        zona.setTemperatura(23);
        zona.setAtiva(true);
        zona.setOrdem(1);

        when(climatizacaoService.atualizarZona(eq(veiculoId), eq(zonaId), any())).thenReturn(zona);

        mockMvc.perform(patch("/api/veiculos/" + veiculoId + "/climatizacao/zonas/" + zonaId).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"temperatura\":23,\"ativa\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temperatura").value(23))
                .andExpect(jsonPath("$.ativa").value(true));
    }

    @Test
    @WithMockUser
    void deveRetornar404QuandoZonaNaoExiste() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        UUID zonaId = UUID.randomUUID();
        when(climatizacaoService.atualizarZona(eq(veiculoId), eq(zonaId), any()))
                .thenThrow(new NoSuchElementException("Zona de climatização não encontrada"));

        mockMvc.perform(patch("/api/veiculos/" + veiculoId + "/climatizacao/zonas/" + zonaId).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ativa\":false}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Zona de climatização não encontrada"));
    }
}
