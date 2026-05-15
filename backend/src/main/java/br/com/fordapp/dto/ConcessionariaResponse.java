package br.com.fordapp.dto;

import br.com.fordapp.model.Concessionaria;
import java.util.UUID;

public class ConcessionariaResponse {

    private UUID id;
    private String nome;
    private String endereco;
    private String cidade;
    private String estado;
    private String telefone;
    private Integer distanciaKm;

    public ConcessionariaResponse() {}

    public static ConcessionariaResponse de(Concessionaria concessionaria) {
        ConcessionariaResponse dto = new ConcessionariaResponse();
        dto.id = concessionaria.getId();
        dto.nome = concessionaria.getNome();
        dto.endereco = concessionaria.getEndereco();
        dto.cidade = concessionaria.getCidade();
        dto.estado = concessionaria.getEstado();
        dto.telefone = concessionaria.getTelefone();
        dto.distanciaKm = concessionaria.getDistanciaKm();
        return dto;
    }

    public UUID getId() { return id; }
    public String getNome() { return nome; }
    public String getEndereco() { return endereco; }
    public String getCidade() { return cidade; }
    public String getEstado() { return estado; }
    public String getTelefone() { return telefone; }
    public Integer getDistanciaKm() { return distanciaKm; }

    public void setId(UUID id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public void setEstado(String estado) { this.estado = estado; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setDistanciaKm(Integer distanciaKm) { this.distanciaKm = distanciaKm; }
}
