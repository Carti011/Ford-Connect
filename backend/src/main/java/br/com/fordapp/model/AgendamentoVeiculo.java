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

    @Column(name = "dias_semana", length = 20)
    private String diasSemana;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    @Column(name = "alvo_temperatura")
    private Integer alvoTemperatura;

    public AgendamentoVeiculo() {}

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public String getTipo() { return tipo; }
    public String getRotulo() { return rotulo; }
    public String getHora() { return hora; }
    public String getDiasSemana() { return diasSemana; }
    public Boolean getAtivo() { return ativo; }
    public Integer getDuracaoMinutos() { return duracaoMinutos; }
    public Integer getAlvoTemperatura() { return alvoTemperatura; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setHora(String hora) { this.hora = hora; }
    public void setDiasSemana(String diasSemana) { this.diasSemana = diasSemana; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public void setDuracaoMinutos(Integer duracaoMinutos) { this.duracaoMinutos = duracaoMinutos; }
    public void setAlvoTemperatura(Integer alvoTemperatura) { this.alvoTemperatura = alvoTemperatura; }
}
