// Local: supabase/functions/generate-health-tip/index.ts (VERSÃO COM NORMALIZAÇÃO)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const topics = ["hidratação", "sono de qualidade", "alimentação balanceada", "exercícios leves", "saúde mental", "postura corporal", "higiene", "prevenção de doenças comuns", "benefícios de frutas", "controle de estresse"];
const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)];

// --- NOVA FUNÇÃO AUXILIAR PARA LIMPAR O TEXTO ---
const normalizeKey = (str: string) => {
  if (!str) return 'default';
  return str
    .normalize("NFD") // Separa acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toLowerCase()
    .replace(/\s+/g, '_') // Substitui espaços por underscores
    .replace(/s$/, ''); // Remove 's' do final para tratar plurais simples (ex: exercicios -> exercicio)
};

serve(async (_req) => {
  try {
    // ... (o início da função com a chamada para o Gemini continua o mesmo)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const topic = getRandomTopic();
    const prompt = `Aja como um especialista em saúde e bem-estar. Crie uma dica de saúde curta e prática sobre o tema "${topic}". A dica deve ser em português do Brasil, fácil de entender e acionável. Retorne sua resposta estritamente no seguinte formato JSON, sem nenhum texto adicional antes ou depois: {"title": "Um título criativo para a dica", "content": "O texto da dica com 2 ou 3 parágrafos.", "excerpt": "Um resumo curto da dica em uma frase.", "category": "Escolha uma destas: Alimentação, Exercícios, Saúde Mental"}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    
    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      throw new Error(`Erro na API do Gemini: ${geminiResponse.status} - ${JSON.stringify(geminiData)}`);
    }

    const tipJsonString = geminiData.candidates[0].content.parts[0].text;
    const jsonMatch = tipJsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Não foi possível encontrar um objeto JSON válido na resposta da IA.");
    }
    const cleanedJsonString = jsonMatch[0];
    const tip = JSON.parse(cleanedJsonString);

    if (!tip.title || !tip.content || !tip.category) {
        throw new Error("A resposta da IA, mesmo sendo um JSON, não veio com os campos esperados.");
    }

    // --- MUDANÇA PRINCIPAL AQUI ---
    const imageKey = normalizeKey(tip.category);
    console.log(`Categoria recebida da IA: "${tip.category}", Chave normalizada para o ícone: "${imageKey}"`);

    // Inserir a nova dica no nosso banco de dados
    const { error: insertError } = await supabaseAdmin.from('health_info').insert({
      title: tip.title, 
      excerpt: tip.excerpt, 
      content: tip.content, 
      category: tip.category, 
      read_time: '2 min', 
      image_key: imageKey, // <-- Usando a chave limpa e normalizada
      source: 'Dica gerada por IA (Gemini)'
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: "Nova dica de saúde gerada e salva com sucesso!" }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('--- ERRO NA EXECUÇÃO DA FUNÇÃO ---', error);
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
})