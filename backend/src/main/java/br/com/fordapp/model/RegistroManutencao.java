package br.com.fordapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "registros_manutencao")
public class RegistroManutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "quilometragem_no_servico")
    private Integer quilometragemNoServico;

    @Column(name = "data_servico", nullable = false)
    private LocalDate dataServico;

    @Column(length = 100)
    private String concessionaria;

    @Column(precision = 10, scale = 2)
    private BigDecimal custo;

    public RegistroManutencao() {}

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public String getTipo() { return tipo; }
    public String getDescricao() { return descricao; }
    public Integer getQuilometragemNoServico() { return quilometragemNoServico; }
    public LocalDate getDataServico() { return dataServico; }
    public String getConcessionaria() { return concessionaria; }
    public BigDecimal getCusto() { return custo; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setQuilometragemNoServico(Integer quilometragemNoServico) { this.quilometragemNoServico = quilometragemNoServico; }
    public void setDataServico(LocalDate dataServico) { this.dataServico = dataServico; }
    public void setConcessionaria(String concessionaria) { this.concessionaria = concessionaria; }
    public void setCusto(BigDecimal custo) { this.custo = custo; }
}
