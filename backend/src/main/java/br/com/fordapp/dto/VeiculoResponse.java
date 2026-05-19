package br.com.fordapp.dto;

import br.com.fordapp.model.Veiculo;
import java.time.LocalDate;
import java.util.UUID;

public class VeiculoResponse {

    private UUID id;
    private String nomeProprietario;
    private String marca;
    private String modelo;
    private String versao;
    private Integer ano;
    private String placa;
    private Integer quilometragem;
    private String statusVeiculo;
    private Integer nivelCombustivel;
    private Integer autonomiaKm;
    private Boolean climatizacaoAutomatica;
    private Boolean desembacarParabrisa;
    private Boolean bancoAquecido;
    private Boolean notificar;
    private Integer scoreSaude;
    private LocalDate garantiaDataLimite;
    private Integer garantiaKmLimite;

    public VeiculoResponse() {}

    public static VeiculoResponse de(Veiculo veiculo) {
        VeiculoResponse dto = new VeiculoResponse();
        dto.id = veiculo.getId();
        dto.nomeProprietario = veiculo.getNomeProprietario();
        dto.marca = veiculo.getMarca();
        dto.modelo = veiculo.getModelo();
        dto.versao = veiculo.getVersao();
        dto.ano = veiculo.getAno();
        dto.placa = veiculo.getPlaca();
        dto.quilometragem = veiculo.getQuilometragem();
        dto.statusVeiculo = veiculo.getStatusVeiculo();
        dto.nivelCombustivel = veiculo.getNivelCombustivel();
        dto.autonomiaKm = veiculo.getAutonomiaKm();
        dto.climatizacaoAutomatica = veiculo.getClimatizacaoAutomatica();
        dto.desembacarParabrisa = veiculo.getDesembacarParabrisa();
        dto.bancoAquecido = veiculo.getBancoAquecido();
        dto.notificar = veiculo.getNotificar();
        dto.scoreSaude = veiculo.getScoreSaude();
        dto.garantiaDataLimite = veiculo.getGarantiaDataLimite();
        dto.garantiaKmLimite = veiculo.getGarantiaKmLimite();
        return dto;
    }

    public UUID getId() { return id; }
    public String getNomeProprietario() { return nomeProprietario; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public String getVersao() { return versao; }
    public Integer getAno() { return ano; }
    public String getPlaca() { return placa; }
    public Integer getQuilometragem() { return quilometragem; }
    public String getStatusVeiculo() { return statusVeiculo; }
    public Integer getNivelCombustivel() { return nivelCombustivel; }
    public Integer getAutonomiaKm() { return autonomiaKm; }
    public Boolean getClimatizacaoAutomatica() { return climatizacaoAutomatica; }
    public Boolean getDesembacarParabrisa() { return desembacarParabrisa; }
    public Boolean getBancoAquecido() { return bancoAquecido; }
    public Boolean getNotificar() { return notificar; }
    public Integer getScoreSaude() { return scoreSaude; }
    public LocalDate getGarantiaDataLimite() { return garantiaDataLimite; }
    public Integer getGarantiaKmLimite() { return garantiaKmLimite; }

    public void setId(UUID id) { this.id = id; }
    public void setNomeProprietario(String nomeProprietario) { this.nomeProprietario = nomeProprietario; }
    public void setMarca(String marca) { this.marca = marca; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    public void setVersao(String versao) { this.versao = versao; }
    public void setAno(Integer ano) { this.ano = ano; }
    public void setPlaca(String placa) { this.placa = placa; }
    public void setQuilometragem(Integer quilometragem) { this.quilometragem = quilometragem; }
    public void setStatusVeiculo(String statusVeiculo) { this.statusVeiculo = statusVeiculo; }
    public void setNivelCombustivel(Integer nivelCombustivel) { this.nivelCombustivel = nivelCombustivel; }
    public void setAutonomiaKm(Integer autonomiaKm) { this.autonomiaKm = autonomiaKm; }
    public void setClimatizacaoAutomatica(Boolean climatizacaoAutomatica) { this.climatizacaoAutomatica = climatizacaoAutomatica; }
    public void setDesembacarParabrisa(Boolean desembacarParabrisa) { this.desembacarParabrisa = desembacarParabrisa; }
    public void setBancoAquecido(Boolean bancoAquecido) { this.bancoAquecido = bancoAquecido; }
    public void setNotificar(Boolean notificar) { this.notificar = notificar; }
    public void setScoreSaude(Integer scoreSaude) { this.scoreSaude = scoreSaude; }
    public void setGarantiaDataLimite(LocalDate garantiaDataLimite) { this.garantiaDataLimite = garantiaDataLimite; }
    public void setGarantiaKmLimite(Integer garantiaKmLimite) { this.garantiaKmLimite = garantiaKmLimite; }
}
