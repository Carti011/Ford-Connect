package br.com.fordapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "nome_proprietario", nullable = false, length = 100)
    private String nomeProprietario;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(nullable = false, length = 100)
    private String modelo;

    @Column(length = 100)
    private String versao;

    @Column(nullable = false)
    private Integer ano;

    @Column(length = 20)
    private String placa;

    private Integer quilometragem;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    public Veiculo() {}

    @PrePersist
    private void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public Usuario getUsuario() { return usuario; }
    public String getNomeProprietario() { return nomeProprietario; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public String getVersao() { return versao; }
    public Integer getAno() { return ano; }
    public String getPlaca() { return placa; }
    public Integer getQuilometragem() { return quilometragem; }
    public LocalDateTime getCriadoEm() { return criadoEm; }

    public void setId(UUID id) { this.id = id; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public void setNomeProprietario(String nomeProprietario) { this.nomeProprietario = nomeProprietario; }
    public void setMarca(String marca) { this.marca = marca; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public void setVersao(String versao) { this.versao = versao; }
    public void setAno(Integer ano) { this.ano = ano; }
    public void setPlaca(String placa) { this.placa = placa; }
    public void setQuilometragem(Integer quilometragem) { this.quilometragem = quilometragem; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
