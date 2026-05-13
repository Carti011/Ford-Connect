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

    @Column(name = "status_veiculo", nullable = false, length = 50)
    private String statusVeiculo;

    @Column(name = "nivel_combustivel", nullable = false)
    private Integer nivelCombustivel;

    @Column(name = "autonomia_km", nullable = false)
    private Integer autonomiaKm;

    @Column(name = "climatizacao_automatica", nullable = false)
    private Boolean climatizacaoAutomatica;

    @Column(name = "desembacar_parabrisa", nullable = false)
    private Boolean desembacarParabrisa;

    @Column(name = "banco_aquecido", nullable = false)
    private Boolean bancoAquecido;

    @Column(name = "notificar", nullable = false)
    private Boolean notificar;

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
    public String getStatusVeiculo() { return statusVeiculo; }
    public Integer getNivelCombustivel() { return nivelCombustivel; }
    public Integer getAutonomiaKm() { return autonomiaKm; }
    public Boolean getClimatizacaoAutomatica() { return climatizacaoAutomatica; }
    public Boolean getDesembacarParabrisa() { return desembacarParabrisa; }
    public Boolean getBancoAquecido() { return bancoAquecido; }
    public Boolean getNotificar() { return notificar; }
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
    public void setStatusVeiculo(String statusVeiculo) { this.statusVeiculo = statusVeiculo; }
    public void setNivelCombustivel(Integer nivelCombustivel) { this.nivelCombustivel = nivelCombustivel; }
    public void setAutonomiaKm(Integer autonomiaKm) { this.autonomiaKm = autonomiaKm; }
    public void setClimatizacaoAutomatica(Boolean climatizacaoAutomatica) { this.climatizacaoAutomatica = climatizacaoAutomatica; }
    public void setDesembacarParabrisa(Boolean desembacarParabrisa) { this.desembacarParabrisa = desembacarParabrisa; }
    public void setBancoAquecido(Boolean bancoAquecido) { this.bancoAquecido = bancoAquecido; }
    public void setNotificar(Boolean notificar) { this.notificar = notificar; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}
