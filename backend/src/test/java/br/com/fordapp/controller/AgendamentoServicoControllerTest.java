package br.com.fordapp.controller;

import br.com.fordapp.dto.AgendamentoServicoRequest;
import br.com.fordapp.dto.AgendamentoServicoResponse;
import br.com.fordapp.dto.ConcessionariaResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.AgendamentoServicoService;
import br.com.fordapp.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AgendamentoServicoController.class)
class AgendamentoServicoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AgendamentoServicoService agendamentoServicoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/agendamentos-servico"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveCriarAgendamento() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        AgendamentoServicoRequest req = new AgendamentoServicoRequest();
        req.setConcessionariaId(UUID.randomUUID());
        req.setDataPreferida(LocalDate.now().plusDays(7));
        req.setPeriodo("manha");
        req.setRecomendacaoIds(List.of(UUID.randomUUID()));

        ConcessionariaResponse concResp = new ConcessionariaResponse();
        concResp.setNome("Ford Lapa");
        concResp.setDistanciaKm(4);

        AgendamentoServicoResponse resp = new AgendamentoServicoResponse();
        resp.setId(UUID.randomUUID());
        resp.setPeriodo("manha");
        resp.setStatus("pendente");
        resp.setConcessionaria(concResp);
        resp.setRecomendacoes(List.of());

        when(agendamentoServicoService.criar(eq(veiculoId), any())).thenReturn(resp);

        mockMvc.perform(post("/api/veiculos/" + veiculoId + "/agendamentos-servico")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("pendente"))
                .andExpect(jsonPath("$.concessionaria.nome").value("Ford Lapa"));
    }

    @Test
    @WithMockUser
    void deveListarAgendamentos() throws Exception {
        UUID veiculoId = UUID.randomUUID();
        when(agendamentoServicoService.listarPorVeiculo(veiculoId)).thenReturn(List.of());

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/agendamentos-servico"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}
