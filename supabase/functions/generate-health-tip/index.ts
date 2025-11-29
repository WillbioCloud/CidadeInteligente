<<<<<<< HEAD
// supabase/functions/generate-health-tip/index.ts (VERSÃO COM CONTEÚDO ESTRUTURADO)
=======
// Local: supabase/functions/generate-health-tip/index.ts (VERSÃO COM NORMALIZAÇÃO)
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

<<<<<<< HEAD
// Lista de tópicos expandida para incluir mais receitas
const topics = ["hidratação", "sono de qualidade", "receita de salada detox", "exercícios de respiração para ansiedade", "receita de suco verde", "dica de postura no home office", "como montar uma horta em apartamento", "receita de lanche pré-treino"];

const systemPrompt = `
Você é uma assistente de saúde multidisciplinar altamente qualificada, atuando como nutricionista, personal trainer, psicóloga, médica, fisioterapeuta e cozinheira funcional. Suas respostas devem ser sempre práticas, acolhedoras e didáticas.
`;

const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)];
const normalizeKey = (str: string) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '_').replace(/s$/, '') || 'default';

serve(async (_req) => {
  try {
    const supabaseAdmin = createClient( Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' );
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const topic = getRandomTopic();
    
    // --- PROMPT DINÂMICO ---
    // Agora, o prompt muda dependendo do tópico escolhido
    let userPrompt = '';
    if (topic.includes('receita')) {
        // Se o tópico for uma receita, pedimos ingredientes e modo de preparo
        userPrompt = `Crie uma receita prática sobre "${topic}". Retorne APENAS o JSON com a seguinte estrutura: {"title": "Nome da Receita", "excerpt": "Uma frase curta e atrativa sobre a receita.", "category": "Receitas Saudáveis", "content": "Uma breve introdução sobre os benefícios da receita.", "ingredients": ["lista de ingredientes como array de strings"], "instructions": ["passo a passo do modo de preparo como array de strings"], "image_query": "sugestão de 3 a 4 palavras para buscar uma foto desta receita em um banco de imagens"}`;
    } else {
        // Se for uma dica, pedimos um passo a passo
        userPrompt = `Crie uma dica de saúde prática sobre "${topic}". Retorne APENAS o JSON com a seguinte estrutura: {"title": "Um título criativo", "excerpt": "Um resumo curto da dica.", "category": "Escolha uma categoria adequada", "content": "O texto principal da dica com 2 parágrafos.", "steps": ["passo a passo da dica como array de strings, se aplicável"], "image_query": "sugestão de 3 a 4 palavras para buscar uma foto desta dica em um banco de imagens"}`;
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }] 
        }) 
      }
    );
    
    if (!geminiResponse.ok) throw new Error(`Erro na API do Gemini: ${await geminiResponse.text()}`);

    const geminiData = await geminiResponse.json();
    const tipJsonString = geminiData.candidates[0].content.parts[0].text;
    const jsonMatch = tipJsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON inválido da IA.");
    const tip = JSON.parse(jsonMatch[0]);

    // --- SALVANDO OS DADOS ESTRUTURADOS ---
    // Agora salvamos os novos campos (ingredients, instructions, steps) no banco
    const { error: insertError } = await supabaseAdmin.from('health_info').insert({
      title: tip.title, 
      excerpt: tip.excerpt, 
      content: tip.content,
      category: tip.category,
      // Novos campos sendo salvos:
      ingredients: tip.ingredients, // Será salvo como JSONB
      instructions: tip.instructions, // Será salvo como JSONB
      steps: tip.steps, // Será salvo como JSONB
      image_query: tip.image_query, // A sugestão de imagem
      // Campos antigos
      read_time: '3 min', 
      image_key: normalizeKey(tip.category),
      source: 'Gerado por IA (Gemini)'
=======
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
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
    });

    if (insertError) throw insertError;

<<<<<<< HEAD
    return new Response(JSON.stringify({ message: "Nova dica estruturada gerada com sucesso!" }), {
=======
    return new Response(JSON.stringify({ message: "Nova dica de saúde gerada e salva com sucesso!" }), {
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
<<<<<<< HEAD
    console.error('Erro na função generate-health-tip:', error);
=======
    console.error('--- ERRO NA EXECUÇÃO DA FUNÇÃO ---', error);
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
})