package br.com.fordapp.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "concessionarias")
public class Concessionaria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 80)
    private String cidade;

    @Column(nullable = false, length = 2)
    private String estado;

    @Column(length = 20)
    private String telefone;

    @Column(name = "distancia_km", nullable = false)
    private Integer distanciaKm;

    public Concessionaria() {}

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
