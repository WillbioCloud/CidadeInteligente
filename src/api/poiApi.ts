// src/api/poiApi.ts (VERSÃO FINAL E CORRIGIDA)

import { supabase } from '../lib/supabase';

// Interface simplificada para os Pontos de Interesse de infraestrutura

import { supabase } from '../lib/supabase';

// Define a estrutura de um Ponto de Interesseexport interface PointOfInterest {
  id: string;
  loteamento_id: string;
  name: string;
  category: string;
  // Latitude e Longitude são opcionais, pois podemos não ter no cadastro inicial
  latitude?: number;
  longitude?: number;

  phone: string;
  operating_hours: string;
  latitude: number;
  longitude: number;}

// Busca os Pontos de Interesse para um loteamento específico
export const fetchPoisForLoteamento = async (loteamentoId: string): Promise<PointOfInterest[]> => {
  // Retorna um array vazio se o ID do loteamento não for fornecido
  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest') // Busca da nova tabela 'points_of_interest'

  if (!loteamentoId) return [];

  const { data, error } = await supabase
    .from('points_of_interest')    .select('*')
    .eq('loteamento_id', loteamentoId);

  if (error) {
    console.error("Erro ao buscar Pontos de Interesse:", error);
    return []; // Retorna um array vazio em caso de erro
  }

  return data as PointOfInterest[];
};

    return [];
  }

  return data as PointOfInterest[];
};