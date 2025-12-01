import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Send, User, Calendar, Clock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { theme } from '../../styles/designSystem';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import { FeedStackParamList } from '../../navigation/types';

type PostDetailRouteProp = RouteProp<FeedStackParamList, 'PostDetail'>;

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function PostDetailModal() {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation();
  const { userProfile, session } = useUserStore();
  const { postId } = route.params;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, [postId]);

  const fetchPostDetails = async () => {
    try {
      // 1. Buscar o post
      const { data: postData, error: postError } = await supabase
        .from('news_feed')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // 2. Buscar comentários
      const { data: commentsData, error: commentsError } = await supabase
        .from('feed_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      Alert.alert('Erro', 'Não foi possível carregar a publicação.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !session?.user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('feed_comments')
        .insert({
          post_id: postId,
          user_id: session.user.id,
          content: newComment.trim(),
        });

      if (error) throw error;

      // Limpar input e recarregar comentários
      setNewComment('');
      
      // Atualização otimista ou recarregar
      // Vamos recarregar para garantir consistência
      const { data: updatedComments } = await supabase
        .from('feed_comments')
        .select(`
          id, content, created_at, user_id,
          profiles (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (updatedComments) setComments(updatedComments);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publicação</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Conteúdo do Post */}
          {post && (
            <View style={styles.postContainer}>
              <Text style={styles.title}>{post.title}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <User size={14} color={theme.colors.text.tertiary} />
                  <Text style={styles.metaText}>{post.author_name || 'Admin'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Calendar size={14} color={theme.colors.text.tertiary} />
                  <Text style={styles.metaText}>{formatTimeAgo(post.created_at)}</Text>
                </View>
              </View>

              {post.image_url && (
                <Image 
                  source={{ uri: post.image_url }} 
                  style={styles.image} 
                  resizeMode="cover" 
                />
              )}

              <Text style={styles.content}>{post.content}</Text>
            </View>
          )}

          {/* Lista de Comentários */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
            
            {comments.length === 0 ? (
              <Text style={styles.emptyComments}>Seja o primeiro a comentar!</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {comment.profiles?.full_name || 'Utilizador'}
                    </Text>
                    <Text style={styles.commentTime}>
                      {formatTimeAgo(comment.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Input de Comentário */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escreva um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={200}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]} 
            onPress={handleSendComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Send size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  postContainer: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F9FAFB',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  content: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 26,
  },
  commentsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  emptyComments: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
    marginTop: 20,
    fontStyle: 'italic',
  },
  commentCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 12,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});