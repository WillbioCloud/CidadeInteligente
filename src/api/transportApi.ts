// src/api/transportApi.ts (VERSÃO ATUALIZADA PARA A NOVA ESTRUTURA)

import { supabase } from '../lib/supabase';

// Interface que corresponde exatamente à sua nova tabela no Supabase
export interface BusSchedule {
  id: number;
  line_code: string;
  line_name: string;
  destination: string;
  point_a: string;
  point_b: string;
  status: 'em circulação' | 'manutenção' | 'interrompido';
  times_weekdays: string; // Ex: "05:00,06:15,07:30"
  times_saturday: string;
  times_sunday: string;
  ida: string;
  volta: string;
  created_at: string;
  updated_at: string;
}

// A função de busca foi atualizada para a nova tabela
export const fetchBusSchedules = async (): Promise<BusSchedule[]> => {
  const { data, error } = await supabase
    .from('bus_schedules')
    .select('*')
    .eq('status', 'em circulação') // Busca apenas as linhas que estão ativas
    .order('line_code', { ascending: true });

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

  // O Supabase já retorna os dados no formato correto

  // O Supabase já retorna os dados no formato correto, não precisamos de mapeamento  return data as BusSchedule[];
};
