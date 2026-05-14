package br.com.fordapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class AtualizarZonaClimatizacaoRequest {

    @Min(value = 16, message = "Temperatura mínima é 16°C")
    @Max(value = 30, message = "Temperatura máxima é 30°C")
    private Integer temperatura;

    private Boolean ativa;

    public AtualizarZonaClimatizacaoRequest() {}

    public Integer getTemperatura() { return temperatura; }
    public Boolean getAtiva() { return ativa; }

    public void setTemperatura(Integer temperatura) { this.temperatura = temperatura; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }
}
