package br.com.fordapp.controller;

import br.com.fordapp.dto.RegistroManutencaoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.JwtService;
import br.com.fordapp.service.ManutencaoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ManutencaoController.class)
class ManutencaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ManutencaoService manutencaoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID() + "/maintenance"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarHistoricoDoVeiculo() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        RegistroManutencaoResponse r = new RegistroManutencaoResponse();
        r.setId(UUID.randomUUID());
        r.setTipo("Revisão de 40.000 km");
        r.setDataServico(LocalDate.of(2024, 6, 14));
        r.setCusto(new BigDecimal("1750.00"));

        when(manutencaoService.buscarPorVeiculo(veiculoId)).thenReturn(List.of(r));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/maintenance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tipo").value("Revisão de 40.000 km"))
                .andExpect(jsonPath("$[0].custo").value(1750.00));
    }

    @Test
    @WithMockUser
    void deveRetornarListaVaziaQuandoSemHistorico() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(manutencaoService.buscarPorVeiculo(veiculoId)).thenReturn(List.of());

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/maintenance"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
