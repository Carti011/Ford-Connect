package br.com.fordapp.dto;

import br.com.fordapp.model.RegistroManutencao;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class RegistroManutencaoResponse {

    private UUID id;
    private String tipo;
    private String descricao;
    private Integer quilometragemNoServico;
    private LocalDate dataServico;
    private String concessionaria;
    private BigDecimal custo;

    public RegistroManutencaoResponse() {}

    public static RegistroManutencaoResponse de(RegistroManutencao registro) {
        RegistroManutencaoResponse dto = new RegistroManutencaoResponse();
        dto.id = registro.getId();
        dto.tipo = registro.getTipo();
        dto.descricao = registro.getDescricao();
        dto.quilometragemNoServico = registro.getQuilometragemNoServico();
        dto.dataServico = registro.getDataServico();
        dto.concessionaria = registro.getConcessionaria();
        dto.custo = registro.getCusto();
        return dto;
    }

    public UUID getId() { return id; }
    public String getTipo() { return tipo; }
    public String getDescricao() { return descricao; }
    public Integer getQuilometragemNoServico() { return quilometragemNoServico; }
    public LocalDate getDataServico() { return dataServico; }
    public String getConcessionaria() { return concessionaria; }
    public BigDecimal getCusto() { return custo; }

    public void setId(UUID id) { this.id = id; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setQuilometragemNoServico(Integer quilometragemNoServico) { this.quilometragemNoServico = quilometragemNoServico; }
    public void setDataServico(LocalDate dataServico) { this.dataServico = dataServico; }
    public void setConcessionaria(String concessionaria) { this.concessionaria = concessionaria; }
    public void setCusto(BigDecimal custo) { this.custo = custo; }
}
