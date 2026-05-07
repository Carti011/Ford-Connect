package br.com.fordapp.dto;

public class LoginResponse {

    private String token;
    private String tipo;
    private Long expiracaoEm;
    private java.util.UUID veiculoId;

    public LoginResponse() {}

    public LoginResponse(String token, String tipo, Long expiracaoEm, java.util.UUID veiculoId) {
        this.token = token;
        this.tipo = tipo;
        this.expiracaoEm = expiracaoEm;
        this.veiculoId = veiculoId;
    }

    public String getToken() { return token; }
    public String getTipo() { return tipo; }
    public Long getExpiracaoEm() { return expiracaoEm; }
    public java.util.UUID getVeiculoId() { return veiculoId; }

    public void setToken(String token) { this.token = token; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setExpiracaoEm(Long expiracaoEm) { this.expiracaoEm = expiracaoEm; }
    public void setVeiculoId(java.util.UUID veiculoId) { this.veiculoId = veiculoId; }
}
