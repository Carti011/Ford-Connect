package br.com.fordapp.dto;

import br.com.fordapp.model.ZonaClimatizacao;
import java.util.UUID;

public class ZonaClimatizacaoResponse {

    private UUID id;
    private String rotulo;
    private Integer temperatura;
    private Boolean ativa;
    private Integer ordem;

    public ZonaClimatizacaoResponse() {}

    public static ZonaClimatizacaoResponse de(ZonaClimatizacao zona) {
        ZonaClimatizacaoResponse dto = new ZonaClimatizacaoResponse();
        dto.id = zona.getId();
        dto.rotulo = zona.getRotulo();
        dto.temperatura = zona.getTemperatura();
        dto.ativa = zona.getAtiva();
        dto.ordem = zona.getOrdem();
        return dto;
    }

    public UUID getId() { return id; }
    public String getRotulo() { return rotulo; }
    public Integer getTemperatura() { return temperatura; }
    public Boolean getAtiva() { return ativa; }
    public Integer getOrdem() { return ordem; }

    public void setId(UUID id) { this.id = id; }
    public void setRotulo(String rotulo) { this.rotulo = rotulo; }
    public void setTemperatura(Integer temperatura) { this.temperatura = temperatura; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
}
