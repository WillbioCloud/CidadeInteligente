// Local: src/api/healthApi.ts (VERSÃO COM EXERCÍCIOS DESATIVADOS)

import { supabase } from '../lib/supabase'; //

// --- INTERFACES (Tipos de Dados) ---
export interface HealthInfo {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: 'Alerta Local' | 'Saúde na Cidade' | 'Alimentação' | 'Exercícios' | 'Saúde Mental';
  readTime: string;
  imageKey: string;
  source: string;
  tips?: string[];
  address?: string;
  phone?: string;
  created_at: string; // <-- ADICIONE ESTA LINHA
}

export interface NutritionInfo {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

// Define a estrutura de um Alerta de Saúde (NOVO)
export interface HealthAlert { //
  id: string; //
  title: string; //
  message: string; //
  severity: 'info' | 'warning' | 'critical'; //
  source: string; //
}

// --- INTERFACE DE EXERCÍCIOS DESATIVADA TEMPORARIAMENTE ---
/*
export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}
*/


// --- FUNÇÕES DE BUSCA DE DADOS ---

/**
 * Busca a lista principal de dicas de saúde da tabela 'health_info'.
 */
export const fetchHealthData = async (): Promise<HealthInfo[]> => { //
  const { data, error } = await supabase //
    .from('health_info') //
    .select('*') //
    .order('created_at', { ascending: false }); //

  if (error) { //
    console.error('Erro ao buscar dados de saúde:', error); //
    return []; //
  }

  const formattedData = data.map(item => ({ //
    ...item, //
    readTime: item.read_time, //
    imageKey: item.image_key, //
  })); //

  return formattedData as HealthInfo[]; //
};

/**
 * (NOVO) Busca a lista de alertas importantes da tabela 'health_alerts'.
 */
export const fetchHealthAlerts = async (): Promise<HealthAlert[]> => { //
  const { data, error } = await supabase //
    .from('health_alerts') //
    .select('*') //
    .order('created_at', { ascending: false }); //

  if (error) { //
    console.error('Erro ao buscar alertas de saúde:', error); //
    return []; //
  }
  return data as HealthAlert[]; //
};

// --- FUNÇÕES DE BUSCA DE DADOS ---
// ... (suas outras funções fetchHealthData, fetchHealthAlerts continuam aqui) ...


/**
 * (NOVO) CHAMA A EDGE FUNCTION para buscar dados nutricionais na API-Ninjas.
 * @param query - O alimento a ser pesquisado (ex: '2 bananas').
 */
export const fetchNutritionInfo = async (query: string): Promise<NutritionInfo[]> => {
  // Invoca a Edge Function 'get-nutrition-info' que criamos no Supabase
  const { data, error } = await supabase.functions.invoke('get-nutrition-info', {
    body: { query },
  });

  if (error) {
    console.error("Erro ao chamar a função de nutrição:", error);
    return [];
  }
  return data as NutritionInfo[];
};


// --- FUNÇÃO DE EXERCÍCIOS DESATIVADA TEMPORARIAMENTE ---
/*
export const fetchExercisesByMuscle = async (muscle: string): Promise<Exercise[]> => {
  const { data, error } = await supabase.functions.invoke('get-exercises', {
    body: { muscle },
  });

  if (error) {
    console.error("Erro ao chamar a função de exercícios:", error);
    return [];
  }
  return data as Exercise[];
};
*/