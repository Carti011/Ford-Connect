package br.com.fordapp.dto;

public class AtualizarPreferenciasRequest {

    private Boolean climatizacaoAutomatica;
    private Boolean desembacarParabrisa;
    private Boolean bancoAquecido;
    private Boolean notificar;

    public AtualizarPreferenciasRequest() {}

    public Boolean getClimatizacaoAutomatica() { return climatizacaoAutomatica; }
    public Boolean getDesembacarParabrisa() { return desembacarParabrisa; }
    public Boolean getBancoAquecido() { return bancoAquecido; }
    public Boolean getNotificar() { return notificar; }

    public void setClimatizacaoAutomatica(Boolean climatizacaoAutomatica) { this.climatizacaoAutomatica = climatizacaoAutomatica; }
    public void setDesembacarParabrisa(Boolean desembacarParabrisa) { this.desembacarParabrisa = desembacarParabrisa; }
    public void setBancoAquecido(Boolean bancoAquecido) { this.bancoAquecido = bancoAquecido; }
    public void setNotificar(Boolean notificar) { this.notificar = notificar; }
}
