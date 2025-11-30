// src/screens/Home/HomeTabScreen.tsx (VERSÃO FINAL UNIFICADA)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import * as VideoThumbnails from 'expo-video-thumbnails';

// Componentes e utilitários necessários que estavam em ContentFeed
import { Calendar, ChevronRight } from '../../components/Icons';
import { supabase } from '../../lib/supabase';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

// Seções da Home
import { CommerceHighlight } from '../../components/sections/CommerceHighlight';
import { ResidentFeatures } from '../../components/sections/ResidentFeatures';

// --- INÍCIO DA LÓGICA DO CONTENTFEED (AGORA DENTRO DA HOMETABSCREEN) ---

// Interface para o formato do post
interface FeedPost {
  id: number;
  title: string;
  image_url: string;
  video_url?: string;
  media_type?: 'IMAGE' | 'VIDEO';
  published_at: string;
}

// Componente interno para o card do post com thumbnail
const PostCard = ({ item }) => {
  const navigation = useNavigation();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(item.image_url);

  useEffect(() => {
    const generateThumbnail = async () => {
      if (item.media_type === 'VIDEO' && item.video_url) {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            item.video_url,
            { time: 1000 }
          );
          setThumbnailUrl(uri);
        } catch (e) {
          console.warn('Erro ao gerar thumbnail:', e);
          setThumbnailUrl(item.image_url);
        }
      }
    };
    generateThumbnail();
  }, [item]);

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Feed')}>
      <Image source={{ uri: thumbnailUrl || 'https://placehold.co/280x140' }} style={styles.cardImage} />
      <View style={styles.dateBadge}>
        <Calendar size={12} color="black" />
        <Text style={styles.dateText}>{formatTimeAgo(item.published_at)}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Componente da seção de Novidades (ContentFeed)
const ContentFeed = () => {
  const navigation = useNavigation();
      {!loading && (
        <FlatList
          data={posts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingLeft: 16 }}
          renderItem={({ item }) => <PostCard item={item} />}
        />
      )}
            >
              <Text style={styles.acquireButtonText}>{hasAvailableLots ? 'Adquirir' : 'Esgotado'}</Text>
            </TouchableOpacity>
        </View>
      </View>    </View>
  );
};

// --- FIM DA LÓGICA DO CONTENTFEED ---


// --- COMPONENTE PRINCIPAL DA TELA HOME ---
export default function HomeTabScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const route = useRoute();
  const { scrollToEnd } = route.params || {};

  useFocusEffect(
    React.useCallback(() => {
      if (scrollToEnd) {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    }, [scrollToEnd])
  );

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* As seções continuam sendo chamadas normalmente */}
      <CommerceHighlight />
      <ResidentFeatures />
      <ContentFeed />
    </ScrollView>
  );
}

// --- ESTILOS (UNIFICADOS) ---
const styles = StyleSheet.create({
  // Estilos da HomeTabScreen
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingVertical: 16,
    paddingTop: 16,
    paddingBottom: 84,
  },
  // Estilos do ContentFeed
  section: { 
    marginBottom: 24 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16, 
    paddingHorizontal: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  sectionSubtitle: { 
    color: 'gray' 
  },
  seeAllButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  seeAllText: { 
    color: '#339949ff', 
    fontWeight: '600', 
    marginRight: 4 
  },
  card: { 
    width: 280, 
    marginRight: 16, 
    backgroundColor: 'white', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  cardImage: { 
    width: '100%', 
    height: 140, 
    backgroundColor: '#e0e0e0' 
  },
  dateBadge: { 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.85)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  dateText: { 
    fontSize: 12, 
    marginLeft: 4, 
    fontWeight: '500' 
  },
  cardContent: { 
    padding: 12 
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },


export default function HomeTabScreen() {
  const navigation = useNavigation();
  const [loteamentos, setLoteamentos] = useState<LoteamentoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const fetchLoteamentosData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('loteamentos').select('*');
      if (error) throw error;
      if (data) {
        const formattedData = data.map(lote => ({ ...lote, features: lote.features || [] }));
        setLoteamentos(formattedData);
      }
    } catch (err) {
      console.error("Erro ao buscar loteamentos:", err);
      Alert.alert('Falha na Conexão', 'Não foi possível carregar os dados dos empreendimentos.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  const fetchWeatherData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        setWeatherData({ error: 'Permissão negada' }); // Informa o card que houve um erro
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`);
        const data = await response.json();
        if (response.ok) {
          setWeatherData({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6),
            icon: data.weather[0].icon,
            city: data.name,
          });
        } else {
            console.error("Erro da API de clima:", data.message);
            setWeatherData({ error: 'Falha na API' });
        }
      } catch (error) {
        console.error("Falha na requisição de clima:", error);
        setWeatherData({ error: 'Falha na rede' });
      }
  };

  useEffect(() => {
    fetchLoteamentosData();
    fetchWeatherData();
  }, [fetchLoteamentosData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Recarrega tanto os loteamentos quanto o clima
    Promise.all([fetchLoteamentosData(), fetchWeatherData()]).then(() => {
        setIsRefreshing(false);
    });
  }, [fetchLoteamentosData]);

  const ListHeader = () => (
    <>
      <WelcomeCard />
      <View style={styles.statsRow}>
        <WeatherCard weatherData={weatherData} />
        <View style={{ width: 16 }} />
        <LotsAvailableCard />
      </View>
      <Text style={styles.sectionTitle}>Nossos Empreendimentos</Text>
    </>
  );

  if (isLoading && loteamentos.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={loteamentos}
        renderItem={({ item }) => <LoteamentoCard item={item} navigation={navigation} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<InstagramSection />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#16A34A', '#3B82F6']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#1E293B',
  },
  loteamentoCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#94A3B8',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardImageContainer: {
    height: 150,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardImage: {
    width: '80%',
    height: '80%',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  cardDescription: { fontSize: 14, color: '#64748B', marginTop: 4, marginBottom: 12 },
  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  featureBadge: { backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6},
  featureText: { color: '#334155', fontSize: 12, fontWeight: '500' },
  buttonContainer: { flexDirection: 'row', gap: 12 },
  mediaButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  mediaButtonText: { color: '#334155', fontWeight: 'bold', marginLeft: 8 },
  acquireButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acquireButtonDisabled: { backgroundColor: '#9CA3AF' },
  acquireButtonText: { color: 'white', fontWeight: 'bold' },});