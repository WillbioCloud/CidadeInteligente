import { supabase } from '../lib/supabase';

// Define a estrutura de um Ponto de Interesse
export interface PointOfInterest {
  id: string;
  loteamento_id: string;
  name: string;
  category: string;
  phone: string;
  operating_hours: string;
  latitude: number;
  longitude: number;
}

// Busca os Pontos de Interesse para um loteamento específico
export const fetchPoisForLoteamento = async (loteamentoId: string): Promise<PointOfInterest[]> => {
  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest')
    .select('*')
    .eq('loteamento_id', loteamentoId);

  if (error) {
    console.error("Erro ao buscar Pontos de Interesse:", error);
    return [];
  }

  return data as PointOfInterest[];
};
