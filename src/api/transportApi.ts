import { supabase } from '../lib/supabase';

// Interface atualizada para incluir os novos campos do design
export interface BusSchedule {
  id: number;
  loteamento_id: string; // Campo para filtrar por loteamento
  line_name: string;
  destination: string;
  itinerary: string; // Novo campo para o trajeto (ex: Rodoviária -> Cidade)
  status: 'Funcionando' | 'Manutenção' | 'Interrompido'; // Novo
  interval: string; // Novo (ex: "1h 30min")
  phone: string; // Novo
  times_weekday: string[];
  times_weekend: string[];
}

// A função agora aceita um loteamentoId para filtrar os resultados
export const fetchBusSchedules = async (loteamentoId: string): Promise<BusSchedule[]> => {
  const { data, error } = await supabase
    .from('bus_schedules')
    .select('*')
    .eq('loteamento_id', loteamentoId) // Filtra pelo loteamento selecionado
    .order('id', { ascending: true });

  if (error) {
    console.error("Erro ao buscar horários de ônibus:", error);
    return [];
  }

  // O Supabase já retorna os dados no formato correto, não precisamos de mapeamento
  return data as BusSchedule[];
};
