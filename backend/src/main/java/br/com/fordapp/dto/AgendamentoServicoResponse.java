package br.com.fordapp.dto;

import br.com.fordapp.model.AgendamentoServico;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class AgendamentoServicoResponse {

    private UUID id;
    private LocalDate dataPreferida;
    private String periodo;
    private String status;
    private String observacoes;
    private LocalDateTime criadoEm;
    private ConcessionariaResponse concessionaria;
    private List<RecomendacaoResumida> recomendacoes;

    public AgendamentoServicoResponse() {}

    public static AgendamentoServicoResponse de(AgendamentoServico agendamento) {
        AgendamentoServicoResponse dto = new AgendamentoServicoResponse();
        dto.id = agendamento.getId();
        dto.dataPreferida = agendamento.getDataPreferida();
        dto.periodo = agendamento.getPeriodo();
        dto.status = agendamento.getStatus();
        dto.observacoes = agendamento.getObservacoes();
        dto.criadoEm = agendamento.getCriadoEm();
        dto.concessionaria = ConcessionariaResponse.de(agendamento.getConcessionaria());
        dto.recomendacoes = agendamento.getRecomendacoes().stream()
                .map(RecomendacaoResumida::de)
                .toList();
        return dto;
    }

    public UUID getId() { return id; }
    public LocalDate getDataPreferida() { return dataPreferida; }
    public String getPeriodo() { return periodo; }
    public String getStatus() { return status; }
    public String getObservacoes() { return observacoes; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public ConcessionariaResponse getConcessionaria() { return concessionaria; }
    public List<RecomendacaoResumida> getRecomendacoes() { return recomendacoes; }

    public void setId(UUID id) { this.id = id; }
    public void setDataPreferida(LocalDate dataPreferida) { this.dataPreferida = dataPreferida; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public void setStatus(String status) { this.status = status; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public void setConcessionaria(ConcessionariaResponse concessionaria) { this.concessionaria = concessionaria; }
    public void setRecomendacoes(List<RecomendacaoResumida> recomendacoes) { this.recomendacoes = recomendacoes; }
}
