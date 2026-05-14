package br.com.fordapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "estado_climatizacao")
public class EstadoClimatizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false, unique = true)
    private Veiculo veiculo;

    @Column(name = "sistema_ligado", nullable = false)
    private Boolean sistemaLigado;

    @Column(nullable = false, length = 20)
    private String modo;

    @Column(name = "velocidade_ventilador", nullable = false)
    private Integer velocidadeVentilador;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @OneToMany(mappedBy = "estadoClimatizacao", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<ZonaClimatizacao> zonas = new ArrayList<>();

    public EstadoClimatizacao() {}

    @PrePersist
    private void prePersist() {
        if (this.atualizadoEm == null) this.atualizadoEm = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public Boolean getSistemaLigado() { return sistemaLigado; }
    public String getModo() { return modo; }
    public Integer getVelocidadeVentilador() { return velocidadeVentilador; }
    public LocalDateTime getAtualizadoEm() { return atualizadoEm; }
    public List<ZonaClimatizacao> getZonas() { return zonas; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setSistemaLigado(Boolean sistemaLigado) { this.sistemaLigado = sistemaLigado; }
    public void setModo(String modo) { this.modo = modo; }
    public void setVelocidadeVentilador(Integer velocidadeVentilador) { this.velocidadeVentilador = velocidadeVentilador; }
    public void setAtualizadoEm(LocalDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
    public void setZonas(List<ZonaClimatizacao> zonas) { this.zonas = zonas; }
}
