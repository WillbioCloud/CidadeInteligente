// src/components/sections/ContentFeed.tsx (VERSÃO FINAL INTEGRADA)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Calendar, Heart, MessageCircle, Share2 } from '../Icons';
import { supabase } from '../../lib/supabase';
import { formatTimeAgo } from '../../utils/formatTimeAgo'; // Supondo que temos um util de formatação de data

// Interface para definir a estrutura de um post de novidade
interface FeedPost {
  id: number;
  title: string;
  description: string;
  image_url: string;
  published_at: string;
  likes: number;
  comments: number;
}

export const ContentFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        // Busca os 4 posts mais recentes da tabela 'news_feed'
        const { data, error: dbError } = await supabase
          .from('news_feed')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(4);

        if (dbError) throw dbError;

        setPosts(data || []);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar novidades:", err);
        setError("Não foi possível carregar as novidades.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Novidades do Loteamento</Text>
        <Text style={styles.subtitle}>Fique por dentro de tudo que acontece</Text>
      </View>

      {loading && <ActivityIndicator size="large" color="#339949ff" style={{ marginVertical: 40 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {!loading && !error && (
        <FlatList
          data={posts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingLeft: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Image 
                source={{ uri: item.image_url }} 
                alt={item.title}
                style={styles.cardImage}
              />
              <View style={styles.dateBadge}>
                <Calendar size={12} color="black" />
                <Text style={styles.dateText}>{formatTimeAgo(item.published_at)}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={3}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <View style={styles.stats}>
                    <View style={styles.statItem}><Heart size={16} color="gray" /><Text style={styles.statText}>{item.likes}</Text></View>
                    <View style={styles.statItem}><MessageCircle size={16} color="gray" /><Text style={styles.statText}>{item.comments}</Text></View>
                  </View>
                  <Share2 size={16} color="gray" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// Estilos adaptados para a nova estrutura
const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  header: { marginBottom: 16, paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'gray' },
  card: { width: 280, marginRight: 16, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardImage: { width: '100%', height: 140 },
  dateBadge: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  dateText: { fontSize: 12, marginLeft: 4, fontWeight: '500' },
  cardContent: { padding: 12, justifyContent: 'space-between', flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDescription: { color: 'gray', fontSize: 13, lineHeight: 18, flexGrow: 1, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 8 },
  stats: { flexDirection: 'row' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { color: 'gray', marginLeft: 4, fontSize: 12 },
  errorText: { textAlign: 'center', color: '#EF4444', margin: 20 },
});