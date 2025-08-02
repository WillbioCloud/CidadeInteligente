// src/screens/Comercios/ComerciosTabScreen.tsx (VERSÃO FINAL COM MAPEAMENTO COMPLETO)

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import CommerceCard from '../../components/comercio/CommerceCard';
import { Search } from '../../components/Icons';

export default function ComerciosTabScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [allCommerces, setAllCommerces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommerces = async () => {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('comercios')
        .select('*')
        .eq('ativo', true);

      if (dbError) {
        console.error('Erro ao buscar comércios:', dbError);
        setError('Não foi possível carregar a lista de comércios.');
      } else {
        // --- MAPEAMENTO COMPLETO E CORRIGIDO ---
        const formattedData = data.map(c => ({
          id: c.id,
          name: c.nome,
          category: c.categoria,
          description: c.descricao,
          coverImage: c.capa_url,
          images: c.galeria_urls || [], // Garante que seja sempre um array
          services: c.servicos || [],   // Garante que seja sempre um array
          openingHours: c.horario_func?.display_text || 'Não informado',
          contact: { whatsapp: c.whatsapp, instagram: c.instagram },
          // Adicionando valores padrão para campos que o Card/Detail podem precisar
          loteamento_id: c.loteamento_id || 'Cidade_Inteligente', // Provisório
          city: c.city || 'S. A. do Descoberto - GO', // Provisório
          rating: c.rating || 4.5,
          featured: c.featured || false,
          layout_template: c.layout_template || 'moderno',
          logo: c.logo_url,
        }));
        setAllCommerces(formattedData);
      }
      setLoading(false);
    };

    fetchCommerces();
  }, []);

  const categories = useMemo(() => {
    if (allCommerces.length === 0) return ['Todos'];
    const allCategories = allCommerces.map(c => c.category);
    return ['Todos', ...Array.from(new Set(allCategories))];
  }, [allCommerces]);

  const filteredCommerces = useMemo(() => {
    return allCommerces.filter(commerce => {
      const categoryMatch = selectedCategory === 'Todos' || commerce.category === selectedCategory;
      const searchMatch = commerce.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchTerm, allCommerces]);

  if (loading) {
    return <ActivityIndicator size="large" color="#3B82F6" style={{ flex: 1, justifyContent: 'center' }} />;
  }
  
  if (error) {
    return <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCommerces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CommerceCard commerce={item} />}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
         <>
            <View style={styles.header}>
              <Text style={styles.title}>Comércios Locais</Text>
              <Text style={styles.subtitle}>Descubra os melhores estabelecimentos da região</Text>
            </View>

            <View style={styles.searchContainer}>
              <Search color="#9CA3AF" size={20} />
              <TextInput
                placeholder="Buscar comércios..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryChip, selectedCategory === category && styles.categoryChipSelected]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center'},
    errorText: { color: 'red' },
    listContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
    header: { marginBottom: 16, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 18, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16, paddingHorizontal: 12 },
    searchInput: { flex: 1, height: 48, marginLeft: 8 },
    categoryContainer: { paddingBottom: 16 },
    categoryChip: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginRight: 8 },
    categoryChipSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    categoryText: { color: '#374151', fontWeight: '500' },
    categoryTextSelected: { color: 'white' },
});