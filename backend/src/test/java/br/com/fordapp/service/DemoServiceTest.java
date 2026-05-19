package br.com.fordapp.service;

import br.com.fordapp.repository.AgendamentoServicoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class DemoServiceTest {

    @Mock
    private AgendamentoServicoRepository agendamentoServicoRepository;

    @InjectMocks
    private DemoService demoService;

    @Test
    void resetarDeveApagarTodosOsAgendamentosDeServico() {
        demoService.resetar();

        verify(agendamentoServicoRepository).deleteAll();
    }
}
