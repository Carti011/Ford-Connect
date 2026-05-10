import { AgendamentoVeiculo } from '../types';

const DIAS_PT = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];

function eDiaValido(diaSemana: number, padrao: string): boolean {
  if (padrao === 'DIARIAMENTE') return true;
  if (padrao === 'DIAS_UTEIS') return diaSemana >= 1 && diaSemana <= 5;
  if (padrao === 'FINS_DE_SEMANA') return diaSemana === 0 || diaSemana === 6;
  return false;
}

export function calcularProximaPartida(
  agendamentos: AgendamentoVeiculo[],
): { dia: string; hora: string } | null {
  const motor = agendamentos.find(
    (a) => a.tipo === 'motor' && a.ativo && a.hora && a.diasSemana,
  );
  if (!motor) return null;

  const [hh, mm] = motor.hora!.split(':').map(Number);
  const agora = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const candidato = new Date(agora);
    candidato.setDate(agora.getDate() + offset);
    candidato.setHours(hh, mm, 0, 0);

    if (!eDiaValido(candidato.getDay(), motor.diasSemana!)) continue;
    if (candidato > agora) {
      return { dia: DIAS_PT[candidato.getDay()], hora: motor.hora! };
    }
  }

  return null;
}
