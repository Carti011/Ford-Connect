package br.com.fordapp.dto;

import br.com.fordapp.model.Recomendacao;
import java.math.BigDecimal;
import java.util.UUID;

public class RecomendacaoResumida {

    private UUID id;
    private String titulo;
    private String tipo;
    private Boolean obrigatoria;
    private BigDecimal custoMin;
    private BigDecimal custoMax;

    public RecomendacaoResumida() {}

    public static RecomendacaoResumida de(Recomendacao recomendacao) {
        RecomendacaoResumida dto = new RecomendacaoResumida();
        dto.id = recomendacao.getId();
        dto.titulo = recomendacao.getTitulo();
        dto.tipo = recomendacao.getTipo();
        dto.obrigatoria = recomendacao.getObrigatoria();
        dto.custoMin = recomendacao.getCustoMin();
        dto.custoMax = recomendacao.getCustoMax();
        return dto;
    }

    public UUID getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getTipo() { return tipo; }
    public Boolean getObrigatoria() { return obrigatoria; }
    public BigDecimal getCustoMin() { return custoMin; }
    public BigDecimal getCustoMax() { return custoMax; }

    public void setId(UUID id) { this.id = id; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setObrigatoria(Boolean obrigatoria) { this.obrigatoria = obrigatoria; }
    public void setCustoMin(BigDecimal custoMin) { this.custoMin = custoMin; }
    public void setCustoMax(BigDecimal custoMax) { this.custoMax = custoMax; }
}
