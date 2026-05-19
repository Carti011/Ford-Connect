package br.com.fordapp.dto;

import br.com.fordapp.model.Recomendacao;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class RecomendacaoResponse {

    private UUID id;
    private String titulo;
    private String descricao;
    private String tipo;
    private Boolean obrigatoria;
    private LocalDate dataLimite;
    private Integer quilometragemLimite;
    private String prioridade;
    private BigDecimal custoMin;
    private BigDecimal custoMax;
    private Boolean resolvido;
    private String status;

    public RecomendacaoResponse() {}

    public static RecomendacaoResponse de(Recomendacao recomendacao, Integer kmAtual, LocalDate hoje) {
        RecomendacaoResponse dto = new RecomendacaoResponse();
        dto.id = recomendacao.getId();
        dto.titulo = recomendacao.getTitulo();
        dto.descricao = recomendacao.getDescricao();
        dto.tipo = recomendacao.getTipo();
        dto.obrigatoria = recomendacao.getObrigatoria();
        dto.dataLimite = recomendacao.getDataLimite();
        dto.quilometragemLimite = recomendacao.getQuilometragemLimite();
        dto.prioridade = recomendacao.getPrioridade();
        dto.custoMin = recomendacao.getCustoMin();
        dto.custoMax = recomendacao.getCustoMax();
        dto.resolvido = recomendacao.getResolvido();
        dto.status = calcularStatus(recomendacao, kmAtual, hoje);
        return dto;
    }

    private static String calcularStatus(Recomendacao recomendacao, Integer kmAtual, LocalDate hoje) {
        LocalDate dataLimite = recomendacao.getDataLimite();
        Integer kmLimite = recomendacao.getQuilometragemLimite();

        // atrasada
        if (dataLimite != null && dataLimite.isBefore(hoje)) {
            return "atrasada";
        }
        if (kmLimite != null && kmAtual != null && kmLimite < kmAtual) {
            return "atrasada";
        }

        // proxima (<= 30 dias ou <= 2000 km)
        if (dataLimite != null) {
            long dias = ChronoUnit.DAYS.between(hoje, dataLimite);
            if (dias <= 30) {
                return "proxima";
            }
        }
        if (kmLimite != null && kmAtual != null && (kmLimite - kmAtual) <= 2000) {
            return "proxima";
        }

        return "em_dia";
    }

    public UUID getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescricao() { return descricao; }
    public String getTipo() { return tipo; }
    public Boolean getObrigatoria() { return obrigatoria; }
    public LocalDate getDataLimite() { return dataLimite; }
    public Integer getQuilometragemLimite() { return quilometragemLimite; }
    public String getPrioridade() { return prioridade; }
    public BigDecimal getCustoMin() { return custoMin; }
    public BigDecimal getCustoMax() { return custoMax; }
    public Boolean getResolvido() { return resolvido; }
    public String getStatus() { return status; }

    public void setId(UUID id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setObrigatoria(Boolean obrigatoria) { this.obrigatoria = obrigatoria; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }
    public void setQuilometragemLimite(Integer quilometragemLimite) { this.quilometragemLimite = quilometragemLimite; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }
    public void setCustoMin(BigDecimal custoMin) { this.custoMin = custoMin; }
    public void setCustoMax(BigDecimal custoMax) { this.custoMax = custoMax; }
    public void setResolvido(Boolean resolvido) { this.resolvido = resolvido; }
    public void setStatus(String status) { this.status = status; }
}
