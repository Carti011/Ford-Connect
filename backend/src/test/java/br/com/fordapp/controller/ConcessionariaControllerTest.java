package br.com.fordapp.controller;

import br.com.fordapp.dto.ConcessionariaResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.ConcessionariaService;
import br.com.fordapp.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConcessionariaController.class)
class ConcessionariaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConcessionariaService concessionariaService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar401QuandoSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/concessionarias"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void deveRetornarConcessionariasOrdenadas() throws Exception {
        ConcessionariaResponse c = new ConcessionariaResponse();
        c.setId(UUID.randomUUID());
        c.setNome("Ford Lapa");
        c.setEndereco("Av. Antártica, 1500");
        c.setCidade("São Paulo");
        c.setEstado("SP");
        c.setTelefone("(11) 3030-1100");
        c.setDistanciaKm(4);

        when(concessionariaService.listarOrdenadasPorDistancia()).thenReturn(List.of(c));

        mockMvc.perform(get("/api/concessionarias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Ford Lapa"))
                .andExpect(jsonPath("$[0].distanciaKm").value(4));
    }
}
