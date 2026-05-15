package br.com.fordapp.controller;

import br.com.fordapp.dto.RecomendacaoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.JwtService;
import br.com.fordapp.service.RecomendacaoService;
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

@WebMvcTest(RecomendacaoController.class)
class RecomendacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecomendacaoService recomendacaoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID() + "/recomendacoes"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarRecomendacoesPendentes() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        RecomendacaoResponse r = new RecomendacaoResponse();
        r.setId(UUID.randomUUID());
        r.setTitulo("Revisão de 10.000 km");
        r.setTipo("revisao");
        r.setObrigatoria(true);
        r.setPrioridade("alta");
        r.setDataLimite(LocalDate.of(2025, 1, 15));
        r.setCustoMin(BigDecimal.valueOf(480));
        r.setCustoMax(BigDecimal.valueOf(620));
        r.setStatus("atrasada");
        r.setResolvido(false);

        when(recomendacaoService.buscarPendentesPorVeiculo(veiculoId)).thenReturn(List.of(r));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/recomendacoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Revisão de 10.000 km"))
                .andExpect(jsonPath("$[0].tipo").value("revisao"))
                .andExpect(jsonPath("$[0].obrigatoria").value(true))
                .andExpect(jsonPath("$[0].status").value("atrasada"))
                .andExpect(jsonPath("$[0].custoMin").value(480))
                .andExpect(jsonPath("$[0].custoMax").value(620));
    }

    @Test
    @WithMockUser
    void deveRetornarListaVaziaQuandoSemRecomendacoes() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(recomendacaoService.buscarPendentesPorVeiculo(veiculoId)).thenReturn(List.of());

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/recomendacoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
