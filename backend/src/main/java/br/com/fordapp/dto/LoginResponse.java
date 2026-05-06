package br.com.fordapp.dto;

public class LoginResponse {

    private String token;
    private String tipo;
    private Long expiracaoEm;

    public LoginResponse() {}

    public LoginResponse(String token, String tipo, Long expiracaoEm) {
        this.token = token;
        this.tipo = tipo;
        this.expiracaoEm = expiracaoEm;
    }

    public String getToken() { return token; }
    public String getTipo() { return tipo; }
    public Long getExpiracaoEm() { return expiracaoEm; }

    public void setToken(String token) { this.token = token; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setExpiracaoEm(Long expiracaoEm) { this.expiracaoEm = expiracaoEm; }
}
