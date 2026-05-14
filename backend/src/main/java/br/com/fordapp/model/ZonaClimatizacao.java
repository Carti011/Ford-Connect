package br.com.fordapp.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "zona_climatizacao")
public class ZonaClimatizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estado_climatizacao_id", nullable = false)
    private EstadoClimatizacao estadoClimatizacao;

    @Column(nullable = false, length = 50)
    private String rotulo;

    @Column(nullable = false)
    private Integer temperatura;

    @Column(nullable = false)
    private Boolean ativa;

    @Column(nullable = false)
    private Integer ordem;

    public ZonaClimatizacao() {}

    public UUID getId() { return id; }
    public EstadoClimatizacao getEstadoClimatizacao() { return estadoClimatizacao; }
    public String getRotulo() { return rotulo; }
    public Integer getTemperatura() { return temperatura; }
    public Boolean getAtiva() { return ativa; }
    public Integer getOrdem() { return ordem; }

    public void setId(UUID id) { this.id = id; }
    public void setEstadoClimatizacao(EstadoClimatizacao estadoClimatizacao) { this.estadoClimatizacao = estadoClimatizacao; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setTemperatura(Integer temperatura) { this.temperatura = temperatura; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
