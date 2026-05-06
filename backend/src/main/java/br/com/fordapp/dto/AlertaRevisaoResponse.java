package br.com.fordapp.dto;

import br.com.fordapp.model.AlertaRevisao;
import java.time.LocalDate;
import java.util.UUID;

public class AlertaRevisaoResponse {

    private UUID id;
    private String titulo;
    private String descricao;
    private LocalDate dataLimite;
    private Integer quilometragemLimite;
    private String prioridade;
    private Boolean resolvido;

    public AlertaRevisaoResponse() {}

    public static AlertaRevisaoResponse de(AlertaRevisao alerta) {
        AlertaRevisaoResponse dto = new AlertaRevisaoResponse();
        dto.id = alerta.getId();
        dto.titulo = alerta.getTitulo();
        dto.descricao = alerta.getDescricao();
        dto.dataLimite = alerta.getDataLimite();
        dto.quilometragemLimite = alerta.getQuilometragemLimite();
        dto.prioridade = alerta.getPrioridade();
        dto.resolvido = alerta.getResolvido();
        return dto;
    }

    public UUID getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public LocalDate getDataLimite() { return dataLimite; }
    public Integer getQuilometragemLimite() { return quilometragemLimite; }
    public String getPrioridade() { return prioridade; }
    public Boolean getResolvido() { return resolvido; }

    public void setId(UUID id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }
    public void setQuilometragemLimite(Integer quilometragemLimite) { this.quilometragemLimite = quilometragemLimite; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    public void setResolvido(Boolean resolvido) { this.resolvido = resolvido; }
}
