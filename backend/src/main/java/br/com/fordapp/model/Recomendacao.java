package br.com.fordapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "recomendacoes")
public class Recomendacao {

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

    @Column(length = 30)
    private String tipo;

    @Column(nullable = false)
    private Boolean obrigatoria;

    @Column(name = "custo_min")
    private BigDecimal custoMin;

    @Column(name = "custo_max")
    private BigDecimal custoMax;

    @Column(name = "por_que_importa", columnDefinition = "TEXT")
    private String porQueImporta;

    public Recomendacao() {}

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDate getDataLimite() { return dataLimite; }
    public Integer getQuilometragemLimite() { return quilometragemLimite; }
    public String getPrioridade() { return prioridade; }
    public Boolean getResolvido() { return resolvido; }
    public String getTipo() { return tipo; }
    public Boolean getObrigatoria() { return obrigatoria; }
    public BigDecimal getCustoMin() { return custoMin; }
    public BigDecimal getCustoMax() { return custoMax; }
    public String getPorQueImporta() { return porQueImporta; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }
    public void setQuilometragemLimite(Integer quilometragemLimite) { this.quilometragemLimite = quilometragemLimite; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    public void setResolvido(Boolean resolvido) { this.resolvido = resolvido; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setObrigatoria(Boolean obrigatoria) { this.obrigatoria = obrigatoria; }
    public void setCustoMin(BigDecimal custoMin) { this.custoMin = custoMin; }
    public void setCustoMax(BigDecimal custoMax) { this.custoMax = custoMax; }
    public void setPorQueImporta(String porQueImporta) { this.porQueImporta = porQueImporta; }
}
