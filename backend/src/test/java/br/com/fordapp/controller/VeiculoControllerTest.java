package br.com.fordapp.controller;

import br.com.fordapp.dto.VeiculoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.JwtService;
import br.com.fordapp.service.VeiculoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VeiculoController.class)
class VeiculoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VeiculoService veiculoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornar200ComDadosDoVeiculo() throws Exception {
        UUID id = UUID.randomUUID();
        VeiculoResponse response = new VeiculoResponse();
        response.setId(id);
        response.setModelo("Ranger");
        response.setAno(2022);

        when(veiculoService.buscarPorId(id)).thenReturn(response);

        mockMvc.perform(get("/api/veiculos/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.modelo").value("Ranger"))
                .andExpect(jsonPath("$.ano").value(2022));
    }

    @Test
    @WithMockUser
    void deveSerializarCamposExpandidosNoResponse() throws Exception {
        UUID id = UUID.randomUUID();
        VeiculoResponse response = new VeiculoResponse();
        response.setId(id);
        response.setModelo("Ranger");
        response.setStatusVeiculo("Estacionado");
        response.setNivelCombustivel(80);
        response.setAutonomiaKm(400);

        when(veiculoService.buscarPorId(id)).thenReturn(response);

        mockMvc.perform(get("/api/veiculos/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusVeiculo").value("Estacionado"))
                .andExpect(jsonPath("$.nivelCombustivel").value(80))
                .andExpect(jsonPath("$.autonomiaKm").value(400));
    }

    @Test
    @WithMockUser
    void deveRetornar404QuandoVeiculoNaoEncontrado() throws Exception {
        UUID id = UUID.randomUUID();
        when(veiculoService.buscarPorId(id))
                .thenThrow(new NoSuchElementException("Veículo não encontrado"));

        mockMvc.perform(get("/api/veiculos/" + id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Veículo não encontrado"));
    }
}
