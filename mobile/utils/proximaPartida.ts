import { AgendamentoVeiculo } from '../types';

const DIAS_PT = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'];

export function calcularProximaPartida(
  agendamentos: AgendamentoVeiculo[],
): { dia: string; hora: string } | null {
  const motor = agendamentos.find(
    (a) => a.tipo === 'motor' && a.ativo && a.hora && a.diasSemana,
  );
  if (!motor) return null;

  const diasAtivos = new Set(motor.diasSemana!.split(',').map(Number));
  const [hh, mm] = motor.hora!.split(':').map(Number);
  const agora = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const candidato = new Date(agora);
    candidato.setDate(agora.getDate() + offset);
    candidato.setHours(hh, mm, 0, 0);

    if (!diasAtivos.has(candidato.getDay())) continue;
    if (candidato > agora) {
      return { dia: DIAS_PT[candidato.getDay()], hora: motor.hora! };
    }
  }

  return null;
}
