package br.com.fordapp.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "agendamentos_veiculo")
public class AgendamentoVeiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 150)
    private String rotulo;

    @Column(length = 5)
    private String hora;

    @Column(nullable = false)
    private Boolean ativo;

    public AgendamentoVeiculo() {}

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public String getTipo() { return tipo; }
    public String getRotulo() { return rotulo; }
    public String getHora() { return hora; }
    public Boolean getAtivo() { return ativo; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setHora(String hora) { this.hora = hora; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
