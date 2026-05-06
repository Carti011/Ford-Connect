package br.com.fordapp.controller;

import br.com.fordapp.dto.LoginRequest;
import br.com.fordapp.dto.LoginResponse;
import br.com.fordapp.security.UsuarioDetailsService;
import br.com.fordapp.service.AuthService;
import br.com.fordapp.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.test.context.support.WithMockUser;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@WithMockUser
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void deveRetornar200ComTokenQuandoLoginValido() throws Exception {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "ford@123");
        LoginResponse response = new LoginResponse("token.jwt", "Bearer", System.currentTimeMillis());

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/autenticacao/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token.jwt"))
                .andExpect(jsonPath("$.tipo").value("Bearer"));
    }

    @Test
    void deveRetornar401QuandoCredenciaisInvalidas() throws Exception {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "senha_errada");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Credenciais inválidas"));

        mockMvc.perform(post("/api/autenticacao/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensagem").value("Credenciais inválidas"));
    }

    @Test
    void deveRetornar400QuandoBodyInvalido() throws Exception {
        LoginRequest request = new LoginRequest("", "");

        mockMvc.perform(post("/api/autenticacao/login").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
