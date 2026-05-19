package br.com.fordapp.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class AgendamentoServicoRequest {

    @NotNull
    private UUID concessionariaId;

    @NotNull
    @FutureOrPresent
    private LocalDate dataPreferida;

    @NotBlank
    private String periodo;

    @NotEmpty
    private List<UUID> recomendacaoIds;

    private String observacoes;

    public AgendamentoServicoRequest() {}

    public UUID getConcessionariaId() { return concessionariaId; }
    public LocalDate getDataPreferida() { return dataPreferida; }
    public String getPeriodo() { return periodo; }
    public List<UUID> getRecomendacaoIds() { return recomendacaoIds; }
    public String getObservacoes() { return observacoes; }

    public void setConcessionariaId(UUID concessionariaId) { this.concessionariaId = concessionariaId; }
    public void setDataPreferida(LocalDate dataPreferida) { this.dataPreferida = dataPreferida; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public void setRecomendacaoIds(List<UUID> recomendacaoIds) { this.recomendacaoIds = recomendacaoIds; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
