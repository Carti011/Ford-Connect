package br.com.fordapp.controller;

import br.com.fordapp.dto.AlertaRevisaoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.AlertaService;
import br.com.fordapp.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AlertaController.class)
class AlertaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AlertaService alertaService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID() + "/alertas"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarAlertasPendentes() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        AlertaRevisaoResponse a = new AlertaRevisaoResponse();
        a.setId(UUID.randomUUID());
        a.setTitulo("Revisão de 50.000 km");
        a.setPrioridade("alta");
        a.setDataLimite(LocalDate.of(2025, 1, 15));
        a.setResolvido(false);

        when(alertaService.buscarPendentesPorVeiculo(veiculoId)).thenReturn(List.of(a));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/alertas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Revisão de 50.000 km"))
                .andExpect(jsonPath("$[0].prioridade").value("alta"))
                .andExpect(jsonPath("$[0].resolvido").value(false));
    }

    @Test
    @WithMockUser
    void deveRetornarListaVaziaQuandoSemAlertas() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(alertaService.buscarPendentesPorVeiculo(veiculoId)).thenReturn(List.of());

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/alertas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
