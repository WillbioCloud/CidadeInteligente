<<<<<<< HEAD
// src/api/poiApi.ts (VERSÃO FINAL E CORRIGIDA)

import { supabase } from '../lib/supabase';

// Interface simplificada para os Pontos de Interesse de infraestrutura
=======
import { supabase } from '../lib/supabase';

// Define a estrutura de um Ponto de Interesse
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
export interface PointOfInterest {
  id: string;
  loteamento_id: string;
  name: string;
  category: string;
<<<<<<< HEAD
  // Latitude e Longitude são opcionais, pois podemos não ter no cadastro inicial
  latitude?: number;
  longitude?: number;
=======
  phone: string;
  operating_hours: string;
  latitude: number;
  longitude: number;
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
}

// Busca os Pontos de Interesse para um loteamento específico
export const fetchPoisForLoteamento = async (loteamentoId: string): Promise<PointOfInterest[]> => {
<<<<<<< HEAD
  // Retorna um array vazio se o ID do loteamento não for fornecido
  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest') // Busca da nova tabela 'points_of_interest'
=======
  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest')
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
    .select('*')
    .eq('loteamento_id', loteamentoId);

  if (error) {
    console.error("Erro ao buscar Pontos de Interesse:", error);
<<<<<<< HEAD
    return []; // Retorna um array vazio em caso de erro
  }

  return data as PointOfInterest[];
};
=======
    return [];
  }

  return data as PointOfInterest[];
};
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
