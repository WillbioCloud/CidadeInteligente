<<<<<<< HEAD
// src/components/home/InstagramSection.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Instagram } from 'lucide-react-native';

// Interface para definir o formato de um post do Instagram
interface InstagramPost {
  id: string;
  media_url: string;
  thumbnail_url?: string; // Para vídeos
  caption: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO';
}

export const InstagramSection = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        // Chama a Edge Function que você criou
        const { data, error: functionError } = await supabase.functions.invoke('get-instagram-posts');
        
        if (functionError) {
          throw functionError;
        }
        
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar posts do Instagram:", err);
        setError("Não foi possível carregar as novidades.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  const openPostInInstagram = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Não foi possível abrir o link:", err));
  };

  const renderPost = ({ item }: { item: InstagramPost }) => (
    <TouchableOpacity style={styles.card} onPress={() => openPostInInstagram(item.permalink)}>
      <Image 
        source={{ uri: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Instagram size={24} color="#C13584" />
        <Text style={styles.title}>Últimas do Instagram</Text>
      </View>
      
      {loading && <ActivityIndicator size="large" color="#C13584" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {!loading && !error && (
        <FlatList
          data={posts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    paddingRight: 16,
  },
  card: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#E5E7EB',
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardCaption: {
    color: 'white',
    fontSize: 13,
  },
  errorText: {
    textAlign: 'center',
    color: '#EF4444',
    margin: 20,
  }
=======
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator, Modal, SafeAreaView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { ArrowRight, Heart, MessageCircle, X } from 'lucide-react-native';

// --- Modal para Visualização Expandida ---
const PostDetailModal = ({ post, isVisible, onClose }) => {
  if (!post) return null;

  return (
    <Modal animationType="slide" transparent={false} visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalUsername}>{post.username}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: post.media_url }} style={styles.modalImage} />
        <View style={styles.modalContent}>
          <Text style={styles.modalCaption}>{post.caption}</Text>
          <View style={styles.postStats}>
            <View style={styles.statItem}><Heart size={16} color="#6B7280" /><Text style={styles.statText}>{post.like_count || 0}</Text></View>
            <View style={styles.statItem}><MessageCircle size={16} color="#6B7280" /><Text style={styles.statText}>{post.comments_count || 0}</Text></View>
          </View>
          <TouchableOpacity style={styles.viewOnInstaButton} onPress={() => Linking.openURL(post.permalink)}>
            <Text style={styles.viewOnInstaButtonText}>Ver no Instagram</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const InstagramPostCard = ({ post, onPostPress }) => (
  <TouchableOpacity style={styles.postCard} onPress={() => onPostPress(post)} activeOpacity={0.8}>
    <Image source={{ uri: post.media_url }} style={styles.postImage} />
    <View style={styles.postContent}>
      <Text style={styles.postCaption} numberOfLines={2}>{post.caption}</Text>
    </View>
  </TouchableOpacity>
);

export const InstagramSection = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error: funcError } = await supabase.functions.invoke('get-instagram-posts');
        
        if (funcError) throw funcError;
        setPosts(data);

      } catch (e) {
        setError("Não foi possível carregar os posts.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostPress = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const renderContent = () => {
    if (isLoading) return <ActivityIndicator color="#16A34A" style={{ marginVertical: 40 }} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => <InstagramPostCard post={item} onPostPress={handlePostPress} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Últimas do Instagram</Text>
        <TouchableOpacity style={styles.viewMoreButton} onPress={() => Linking.openURL('https://www.instagram.com/fbzempreendimentos/')}>
          <Text style={styles.viewMoreText}>Ver no Instagram</Text>
          <ArrowRight size={16} color="#16A34A" />
        </TouchableOpacity>
      </View>
      {renderContent()}
      <PostDetailModal post={selectedPost} isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

// ESTILOS (adicionados estilos para o Modal)
const styles = StyleSheet.create({
  // ... (seus estilos de container, header, card, etc. continuam aqui)
  container: { marginTop: 24, backgroundColor: '#F8FAFC', paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  viewMoreButton: { flexDirection: 'row', alignItems: 'center' },
  viewMoreText: { color: '#16A34A', fontWeight: '600', marginRight: 4 },
  errorText: { textAlign: 'center', color: 'red', marginVertical: 40 },
  postCard: { width: 250, backgroundColor: 'white', borderRadius: 16, marginRight: 16, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  postImage: { width: '100%', height: 150 },
  postContent: { padding: 12, justifyContent: 'space-between', flex: 1 },
  postCaption: { fontSize: 14, color: '#334155' },
  postStats: { flexDirection: 'row', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  statText: { marginLeft: 6, fontSize: 13, color: '#64748B', fontWeight: '500' },
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalUsername: { fontSize: 16, fontWeight: 'bold' },
  closeButton: { padding: 4 },
  modalImage: { width: '100%', height: 400, resizeMode: 'cover' },
  modalContent: { padding: 16 },
  modalCaption: { fontSize: 16, lineHeight: 24 },
  viewOnInstaButton: { backgroundColor: '#16A34A', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  viewOnInstaButtonText: { color: 'white', fontWeight: 'bold' }
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
});