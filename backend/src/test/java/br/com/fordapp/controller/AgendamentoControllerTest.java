package br.com.fordapp.controller;

import br.com.fordapp.dto.AgendamentoVeiculoResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.AgendamentoVeiculoService;
import br.com.fordapp.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.http.MediaType;

@WebMvcTest(AgendamentoController.class)
class AgendamentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AgendamentoVeiculoService agendamentoService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacaoNoGet() throws Exception {
        mockMvc.perform(get("/api/veiculos/" + UUID.randomUUID() + "/agendamentos"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveRetornar401QuandoSemAutenticacaoNoPatch() throws Exception {
        mockMvc.perform(patch("/api/agendamentos/" + UUID.randomUUID() + "/ativo").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarListaDeAgendamentos() throws Exception {
        UUID veiculoId = UUID.randomUUID();

        AgendamentoVeiculoResponse motor = new AgendamentoVeiculoResponse();
        motor.setId(UUID.randomUUID());
        motor.setTipo("motor");
        motor.setRotulo("Ligar o motor · Dias úteis");
        motor.setHora("07:30");
        motor.setDiasSemana("DIAS_UTEIS");
        motor.setAtivo(true);

        AgendamentoVeiculoResponse clima = new AgendamentoVeiculoResponse();
        clima.setId(UUID.randomUUID());
        clima.setTipo("clima");
        clima.setRotulo("Climatização automática");
        clima.setHora("08:00");
        clima.setAtivo(false);

        when(agendamentoService.listarPorVeiculo(veiculoId)).thenReturn(List.of(motor, clima));

        mockMvc.perform(get("/api/veiculos/" + veiculoId + "/agendamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tipo").value("motor"))
                .andExpect(jsonPath("$[0].diasSemana").value("DIAS_UTEIS"))
                .andExpect(jsonPath("$[0].ativo").value(true))
                .andExpect(jsonPath("$[1].tipo").value("clima"))
                .andExpect(jsonPath("$[1].ativo").value(false));
    }

    @Test
    @WithMockUser
    void deveAlternarAtivoDoAgendamento() throws Exception {
        UUID id = UUID.randomUUID();

        AgendamentoVeiculoResponse response = new AgendamentoVeiculoResponse();
        response.setId(id);
        response.setTipo("motor");
        response.setAtivo(false);

        when(agendamentoService.alternarAtivo(id)).thenReturn(response);

        mockMvc.perform(patch("/api/agendamentos/" + id + "/ativo").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    @Test
    @WithMockUser
    void deveRetornar404QuandoAgendamentoNaoEncontrado() throws Exception {
        UUID id = UUID.randomUUID();
        when(agendamentoService.alternarAtivo(id))
                .thenThrow(new NoSuchElementException("Agendamento não encontrado"));

        mockMvc.perform(patch("/api/agendamentos/" + id + "/ativo").with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem").value("Agendamento não encontrado"));
    }

    @Test
    void deveRetornar401SemTokenNoPatchAtualizar() throws Exception {
        mockMvc.perform(patch("/api/agendamentos/" + UUID.randomUUID()).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hora\":\"09:00\",\"diasSemana\":\"FINS_DE_SEMANA\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveAtualizarAgendamento() throws Exception {
        UUID id = UUID.randomUUID();

        AgendamentoVeiculoResponse response = new AgendamentoVeiculoResponse();
        response.setId(id);
        response.setTipo("motor");
        response.setHora("09:00");
        response.setDiasSemana("FINS_DE_SEMANA");
        response.setAtivo(true);

        when(agendamentoService.atualizar(eq(id), any())).thenReturn(response);

        mockMvc.perform(patch("/api/agendamentos/" + id).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hora\":\"09:00\",\"diasSemana\":\"FINS_DE_SEMANA\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hora").value("09:00"))
                .andExpect(jsonPath("$.diasSemana").value("FINS_DE_SEMANA"));
    }

    @Test
    @WithMockUser
    void deveRetornar400ComBodyInvalido() throws Exception {
        mockMvc.perform(patch("/api/agendamentos/" + UUID.randomUUID()).with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hora\":\"25:99\",\"diasSemana\":\"FINS_DE_SEMANA\"}"))
                .andExpect(status().isBadRequest());
    }
}
