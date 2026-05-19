package br.com.fordapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "agendamentos_servico")
public class AgendamentoServico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "veiculo_id", nullable = false)
    private Veiculo veiculo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "concessionaria_id", nullable = false)
    private Concessionaria concessionaria;

    @Column(name = "data_preferida", nullable = false)
    private LocalDate dataPreferida;

    @Column(nullable = false, length = 20)
    private String periodo;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "agendamento_servico_recomendacoes",
        joinColumns = @JoinColumn(name = "agendamento_servico_id"),
        inverseJoinColumns = @JoinColumn(name = "recomendacao_id")
    )
    private Set<Recomendacao> recomendacoes = new HashSet<>();

    public AgendamentoServico() {}

    @PrePersist
    private void prePersist() {
        if (this.criadoEm == null) {
            this.criadoEm = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "pendente";
        }
    }

    public UUID getId() { return id; }
    public Veiculo getVeiculo() { return veiculo; }
    public Concessionaria getConcessionaria() { return concessionaria; }
    public LocalDate getDataPreferida() { return dataPreferida; }
    public String getPeriodo() { return periodo; }
    public String getStatus() { return status; }
    public String getObservacoes() { return observacoes; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public Set<Recomendacao> getRecomendacoes() { return recomendacoes; }

    public void setId(UUID id) { this.id = id; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }
    public void setConcessionaria(Concessionaria concessionaria) { this.concessionaria = concessionaria; }
    public void setDataPreferida(LocalDate dataPreferida) { this.dataPreferida = dataPreferida; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public void setStatus(String status) { this.status = status; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setRecomendacoes(Set<Recomendacao> recomendacoes) { this.recomendacoes = recomendacoes; }
}
