package br.com.fordapp.service;

import br.com.fordapp.dto.LoginRequest;
import br.com.fordapp.dto.LoginResponse;
import br.com.fordapp.model.Usuario;
import br.com.fordapp.model.Veiculo;
import br.com.fordapp.repository.UsuarioRepository;
import br.com.fordapp.repository.VeiculoRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final VeiculoRepository veiculoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository,
                       VeiculoRepository veiculoRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.veiculoRepository = veiculoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        UUID veiculoId = veiculoRepository.findByUsuarioId(usuario.getId())
                .map(Veiculo::getId)
                .orElse(null);

        String token = jwtService.gerarToken(usuario.getEmail());
        return new LoginResponse(token, "Bearer", System.currentTimeMillis(), veiculoId);
    }
}
