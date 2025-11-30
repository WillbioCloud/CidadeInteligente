import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Instagram, ExternalLink } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/designSystem';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.4; // Cards ocupam 40% da largura
const INSTAGRAM_URL = 'https://www.instagram.com/cidadeinteligente'; // Atualize com o seu URL real

interface InstagramPost {
  id: string;
  media_url: string;
  caption?: string;
  permalink: string;
}

export const InstagramSection = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Tenta buscar da Edge Function 'get-instagram-posts'
      const { data, error } = await supabase.functions.invoke('get-instagram-posts');
      
      if (error || !data) {
        throw new Error('Falha ao carregar posts');
      }
      
      setPosts(data.slice(0, 5)); // Pega apenas os 5 primeiros
    } catch (error) {
      console.log('Modo offline ou erro na API do Instagram, usando placeholders.');
      // Fallback silencioso para não mostrar erro ao usuário
      setPosts([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInstagram = () => {
    Linking.openURL(INSTAGRAM_URL).catch(() => {
      // Se falhar (ex: app não instalada), tenta abrir no navegador
      Linking.openURL(INSTAGRAM_URL);
    });
  };

  // Se não houver posts carregados, mostramos um banner de convite simples
  if (!loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Redes Sociais</Text>
          <TouchableOpacity onPress={handleOpenInstagram} style={styles.followButton}>
            <Text style={styles.followText}>Seguir</Text>
            <ExternalLink size={14} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.fallbackCard} onPress={handleOpenInstagram}>
          <Instagram size={48} color="#E1306C" />
          <Text style={styles.fallbackTitle}>Siga-nos no Instagram</Text>
          <Text style={styles.fallbackSubtitle}>
            Fique por dentro das novidades e acompanhe o progresso das obras.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Instagram size={24} color="#E1306C" />
          <Text style={styles.title}>Últimas Novidades</Text>
        </View>
        <TouchableOpacity onPress={handleOpenInstagram}>
          <Text style={styles.seeAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_SIZE + 12} // Card + margem
      >
        {loading ? (
          // Skeleton Loading simples
          [1, 2, 3].map((i) => (
            <View key={i} style={[styles.card, styles.loadingCard]} />
          ))
        ) : (
          posts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.card}
              onPress={() => Linking.openURL(post.permalink)}
            >
              <Image 
                source={{ uri: post.media_url }} 
                style={styles.image} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primaryBg,
    borderRadius: 20,
  },
  followText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceHighlight,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingCard: {
    backgroundColor: '#E5E7EB', // Cinza para loading
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // Estilos do Fallback (quando não há posts)
  fallbackCard: {
    marginHorizontal: 16,
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderStyle: 'dashed',
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});