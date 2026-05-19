package br.com.fordapp.service;

import br.com.fordapp.repository.AgendamentoServicoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoService {

    private final AgendamentoServicoRepository agendamentoServicoRepository;

    public DemoService(AgendamentoServicoRepository agendamentoServicoRepository) {
        this.agendamentoServicoRepository = agendamentoServicoRepository;
    }

    @Transactional
    public void resetar() {
        agendamentoServicoRepository.deleteAll();
    }
}
