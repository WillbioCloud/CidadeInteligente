// src/components/sections/CommerceHighlight.tsx (VERSÃO FINAL E COMPLETA)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '../../hooks/useUserStore';
import { ChevronRight } from '../Icons';
import { supabase } from '../../lib/supabase';

const CARD_WIDTH = 280;
const CARD_MARGIN = 16;
const { width: screenWidth } = Dimensions.get('window');
const SLIDE_INTERVAL = 4000;

export const CommerceHighlight = () => {
  const { userProfile } = useUserStore();
  const navigation = useNavigation();
  
  const [featuredCommerces, setFeaturedCommerces] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('ativo', true)
        .limit(5);

      console.log('Comercios do Supabase:', data, error); // <-- Adicione isso

      if (!error && data.length > 0) {
        // --- MAPEAMENTO COMPLETO E CORRIGIDO ---
        const formattedData = data.map(c => ({
          id: c.id,
          name: c.nome,
          category: c.categoria,
          description: c.descricao,
          coverImage: c.capa_url,
          logo: c.logo_url,
          images: c.galeria_urls || [],
          services: c.servicos || [],
          openingHours: c.horario_func?.display_text || 'Não informado',
          contact: { whatsapp: c.whatsapp, instagram: c.instagram },
          loteamento_id: c.loteamento_id || 'Cidade_Inteligente',
          city: c.city || 'S. A. do Descoberto - GO',
          rating: c.rating || 4.5,
          featured: c.featured || false,
          layout_template: c.layout_template || 'moderno',
        }));
        setFeaturedCommerces([...formattedData, ...formattedData]);
      } else if(error) {
        console.error("Erro ao buscar destaques:", error)
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const originalLength = featuredCommerces.length / 2;
      if (originalLength > 0 && !loading) {
        const interval = setInterval(() => {
          const nextIndex = ((activeIndex + 1) % originalLength) || 0;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }, SLIDE_INTERVAL);
        return () => clearInterval(interval);
      }
    }, [activeIndex, featuredCommerces.length, loading])
  );
  
  const handleScroll = useCallback(({ nativeEvent }) => {
    const originalLength = featuredCommerces.length / 2;
    if (originalLength === 0) return;
    const newIndex = Math.round(nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
    if (isNaN(newIndex) || newIndex < 0) return;
    if (newIndex >= originalLength) {
      const equivalentIndex = newIndex % originalLength;
      flatListRef.current?.scrollToIndex({
        index: equivalentIndex,
        animated: false,
      });
      setActiveIndex(equivalentIndex);
    } else {
      setActiveIndex(newIndex);
    }
  }, [featuredCommerces.length]);

  const title = userProfile?.isClient ? `Comércios do seu Loteamento` : "Comércios em Destaque";
  const subtitle = userProfile?.isClient ? `O melhor da sua região` : "Conheça nossos parceiros";
  const sidePadding = (screenWidth - CARD_WIDTH) / 2;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Comercios')}>
          <Text style={styles.seeAllText}>Ver todos</Text>
          <ChevronRight size={16} color="#339949ff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator style={{ height: 200 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={featuredCommerces}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          ListEmptyComponent={<Text style={{ paddingHorizontal: 16 }}>Nenhum destaque no momento.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CommerceDetail', { commerce: item })}
            >
              <Image source={{ uri: item.coverImage }} style={styles.cardImage} />
              <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'gray' },
  seeAllButton: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { color: '#339949ff', fontWeight: '600', marginRight: 4 },
  card: { 
    width: CARD_WIDTH, 
    marginHorizontal: CARD_MARGIN / 2,
    backgroundColor: 'white', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  cardImage: { width: '100%', height: 150, backgroundColor: '#f0f0f0' },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  cardContent: { padding: 12, height: 100, justifyContent: 'center'},
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDescription: { fontSize: 14, color: 'gray', marginTop: 4 },
});