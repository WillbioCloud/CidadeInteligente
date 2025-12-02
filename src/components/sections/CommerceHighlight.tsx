import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/designSystem';

export const CommerceHighlight = () => {
  const navigation = useNavigation<any>();
  const [commerces, setCommerces] = useState([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const { data } = await supabase
          .from('comercios')
          .select('id, nome, categoria, capa_url, rating')
          .eq('status', 'approved')
          .limit(5);
        
        if (data) setCommerces(data as any);
      } catch (error) {
        console.log('Erro ao carregar destaques:', error);
      }
    };
    fetchHighlights();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('CommerceDetail', { commerceId: item.id, commerceName: item.nome })}
    >
      <Image 
        source={item.capa_url ? { uri: item.capa_url } : { uri: 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.category}>{item.categoria}</Text>
        <View style={styles.rating}>
          <Star size={12} color="#FBBF24" fill="#FBBF24" />
          <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Destaques do Bairro</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Comercios')}>
          <Text style={styles.seeAll}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={commerces}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
             <Text style={styles.emptyText}>Nenhum destaque disponível.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary },
  seeAll: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, gap: 16 },
  card: { width: 160, backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  image: { width: '100%', height: 100, backgroundColor: '#F1F5F9' },
  info: { padding: 12 },
  name: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 4 },
  category: { fontSize: 12, color: theme.colors.text.tertiary, marginBottom: 6 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: '#FBBF24', fontWeight: 'bold' },
  emptyContainer: { width: 300, paddingLeft: 20 },
  emptyText: { color: theme.colors.text.tertiary, fontStyle: 'italic' }
});