package br.com.fordapp.service;

import br.com.fordapp.dto.LoginRequest;
import br.com.fordapp.dto.LoginResponse;
import br.com.fordapp.model.Usuario;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.UsuarioRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private VeiculoRepository veiculoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private Veiculo veiculo;
    private UUID veiculoId;

    @BeforeEach
    void setUp() {
        usuario = new Usuario("João Silva", "joao@fordconnect.com", "hash_da_senha");
        usuario.setId(UUID.randomUUID());

        veiculoId = UUID.randomUUID();
        veiculo = new Veiculo();
        veiculo.setId(veiculoId);
    }

    @Test
    void deveRetornarTokenQuandoCredenciaisValidas() {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "ford@123");

        when(usuarioRepository.findByEmail("joao@fordconnect.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ford@123", "hash_da_senha")).thenReturn(true);
        when(jwtService.gerarToken(usuario.getEmail())).thenReturn("token.jwt.gerado");
        when(veiculoRepository.findByUsuarioId(usuario.getId())).thenReturn(Optional.of(veiculo));

        LoginResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("token.jwt.gerado");
        assertThat(response.getTipo()).isEqualTo("Bearer");
    }

    @Test
    void deveRetornarVeiculoIdNaResposta() {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "ford@123");

        when(usuarioRepository.findByEmail("joao@fordconnect.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ford@123", "hash_da_senha")).thenReturn(true);
        when(jwtService.gerarToken(usuario.getEmail())).thenReturn("token.jwt.gerado");
        when(veiculoRepository.findByUsuarioId(usuario.getId())).thenReturn(Optional.of(veiculo));

        LoginResponse response = authService.login(request);

        assertThat(response.getVeiculoId()).isEqualTo(veiculoId);
    }

    @Test
    void deveRetornarVeiculoIdNuloQuandoUsuarioSemVeiculo() {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "ford@123");

        when(usuarioRepository.findByEmail("joao@fordconnect.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("ford@123", "hash_da_senha")).thenReturn(true);
        when(jwtService.gerarToken(usuario.getEmail())).thenReturn("token.jwt.gerado");
        when(veiculoRepository.findByUsuarioId(usuario.getId())).thenReturn(Optional.empty());

        LoginResponse response = authService.login(request);

        assertThat(response.getVeiculoId()).isNull();
    }

    @Test
    void deveLancarExcecaoQuandoEmailNaoEncontrado() {
        LoginRequest request = new LoginRequest("inexistente@fordconnect.com", "ford@123");

        when(usuarioRepository.findByEmail("inexistente@fordconnect.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void deveLancarExcecaoQuandoSenhaIncorreta() {
        LoginRequest request = new LoginRequest("joao@fordconnect.com", "senha_errada");

        when(usuarioRepository.findByEmail("joao@fordconnect.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha_errada", "hash_da_senha")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
