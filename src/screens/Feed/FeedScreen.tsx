import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Share
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heart, MessageCircle, Share2, Calendar, Clock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { theme } from '../../styles/designSystem';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { FeedStackParamList } from '../../navigation/types';

// Tipagem da navegação
type FeedScreenNavigationProp = StackNavigationProp<FeedStackParamList, 'FeedList'>;

interface FeedPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author_name?: string;
  category?: string;
}

export default function FeedScreen() {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      // Busca posts da tabela 'news_feed'
      const { data, error } = await supabase
        .from('news_feed')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Erro ao buscar feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleShare = async (post: FeedPost) => {
    try {
      await Share.share({
        message: `${post.title}\n\nVeja mais no App Cidade Inteligente!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: { item: FeedPost }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {(item.author_name || 'Admin').substring(0, 1)}
            </Text>
          </View>
          <View>
            <Text style={styles.authorName}>{item.author_name || 'Administração'}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(item.created_at)}</Text>
          </View>
        </View>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.preview} numberOfLines={3}>
        {item.content}
      </Text>

      {item.image_url && (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      )}

      <View style={styles.footer}>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statButton}>
            <Heart size={20} color={theme.colors.text.tertiary} />
            <Text style={styles.statText}>{item.likes_count || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statButton}>
            <MessageCircle size={20} color={theme.colors.text.tertiary} />
            <Text style={styles.statText}>{item.comments_count || 0}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => handleShare(item)}>
          <Share2 size={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed de Notícias</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Calendar size={48} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>Sem novidades por enquanto</Text>
              <Text style={styles.emptySubtitle}>
                Volte mais tarde para ver as atualizações do condomínio.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // Ajuste para status bar
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espaço para não ficar atrás da tab bar
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});