package br.com.fordapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "alertas_revisao")
public class AlertaRevisao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_limite")
    private LocalDate dataLimite;

    @Column(name = "quilometragem_limite")
    private Integer quilometragemLimite;

    @Column(nullable = false, length = 20)
    private String prioridade;

    @Column(nullable = false)
    private Boolean resolvido;

    public AlertaRevisao() {}

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDate getDataLimite() { return dataLimite; }
    public Integer getQuilometragemLimite() { return quilometragemLimite; }
    public String getPrioridade() { return prioridade; }
    public Boolean getResolvido() { return resolvido; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }
    public void setQuilometragemLimite(Integer quilometragemLimite) { this.quilometragemLimite = quilometragemLimite; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    public void setResolvido(Boolean resolvido) { this.resolvido = resolvido; }
}
