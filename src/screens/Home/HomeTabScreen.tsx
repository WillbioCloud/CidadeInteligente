import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { Play } from 'lucide-react-native';

// Libs e Dados
import { supabase } from '../../lib/supabase';
import { HomeStackParamList } from '../../navigation/types';

// Componentes da Home
import { WelcomeCard } from '../../components/home/WelcomeCard';
import { WeatherCard } from '../../components/home/WeatherCard';
import { LotsAvailableCard } from '../../components/home/LotsAvailableCard';
import { InstagramSection } from '../../components/home/InstagramSection';

// --- SUA CHAVE DA API DE CLIMA ---
// Nota: Em produção, mova isto para um ficheiro .env
const OPENWEATHER_API_KEY = '9dcbe1de1529889077d991d90092e603';

// --- HELPER PARA CARREGAR AS LOGOS DOS ASSETS ---
// Garante que o nome do ficheiro corresponde exatamente ao que está no banco de dados (coluna 'logo')
const loteamentoLogos: Record<string, any> = {
  'LOGO-CIDADE-INTELIGENTE.webp': require('../../assets/logos/LOGO-CIDADE-INTELIGENTE.webp'),
  'LOGO-CIDADE-UNIVERSITARIA.webp': require('../../assets/logos/LOGO-CIDADE-UNIVERSITARIA.webp'),
  'LOGO-CIDADE-VERDE.webp': require('../../assets/logos/LOGO-CIDADE-VERDE.webp'),
  'LOGO-CIDADE-DAS-FLORES.webp': require('../../assets/logos/LOGO-CIDADE-DAS-FLORES.webp'),
  'LOGO-LAGO-SUL.webp': require('../../assets/logos/LOGO-LAGO-SUL.webp'),
  'LOGO-MORADA-NOBRE.webp': require('../../assets/logos/LOGO-MORADA-NOBRE.webp'),
  'LOGO-CAMINHO-DO-LAGO.webp': require('../../assets/logos/LOGO-CAMINHO-DO-LAGO.webp'),
  'LOGO-PARQUE-FLAMBOYANT.webp': require('../../assets/logos/LOGO-PARQUE-FLAMBOYANT.webp'),
  'LOGO-FLAMBOYANT.webp': require('../../assets/logos/LOGO-FLAMBOYANT.webp'),
};

// Tipagem para os dados
interface LoteamentoData {
  id: string;
  name: string;
  description: string;
  available_lots: number;
  logo: string;
  image_url?: string;
  features: string[];
  // Adicione outros campos se existirem na sua tabela
}

type HomeTabNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeTab'>;

// Card de cada Empreendimento
const LoteamentoCard = ({ item, navigation }: { item: LoteamentoData, navigation: any }) => {
  const hasAvailableLots = item.available_lots > 0;

  const handleAcquirePress = () => {
    if (!hasAvailableLots) {
      Alert.alert("Lotes Esgotados", "No momento, não há lotes disponíveis para este empreendimento.");
    } else {
      // Aqui você pode redirecionar para um formulário de interesse ou WhatsApp
      Alert.alert("Adquirir Lote", `Entrando em contato sobre o ${item.name}.`);
    }
  };

  // Tenta carregar a logo local, se falhar tenta a URL remota, se falhar usa um placeholder
  const imageSource = loteamentoLogos[item.logo] 
    ? loteamentoLogos[item.logo] 
    : (item.image_url ? { uri: item.image_url } : null);

  return (
    <View style={styles.loteamentoCard}>
      <View style={styles.cardImageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.cardImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }]}>
             <Text style={{color: '#94A3B8'}}>Sem Imagem</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.featuresContainer}>
            {(item.features || []).slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.featureBadge}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
        </View>
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => navigation.navigate('LoteamentoMedia', { loteamento: item })}
            >
              <Play size={16} color="#334155" />
              <Text style={styles.mediaButtonText}>Mídias</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.acquireButton, !hasAvailableLots && styles.acquireButtonDisabled]}
              onPress={handleAcquirePress}
              disabled={!hasAvailableLots}
            >
              <Text style={styles.acquireButtonText}>{hasAvailableLots ? 'Adquirir' : 'Esgotado'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- COMPONENTE PRINCIPAL DA TELA HOME ---
export default function HomeTabScreen() {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const [loteamentos, setLoteamentos] = useState<LoteamentoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);

  const fetchLoteamentosData = useCallback(async () => {
    try {
      // Busca dados da tabela 'loteamentos'
      const { data, error } = await supabase
        .from('loteamentos')
        .select('*')
        .order('name'); // Ordenar alfabeticamente

      if (error) throw error;

      if (data) {
        // Formata os dados garantindo que features seja um array
        const formattedData = data.map(lote => ({ 
            ...lote, 
            features: lote.features || [] 
        }));
        setLoteamentos(formattedData);
      }
    } catch (err) {
      console.error("Erro ao buscar loteamentos:", err);
      // Não mostramos alert no loading inicial para não ser intrusivo, apenas no refresh manual se necessário
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  const fetchWeatherData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permissão de localização negada');
          setWeatherData({ error: 'Permissão negada' });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`);
        const data = await response.json();
        
        if (response.ok) {
          setWeatherData({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s para km/h
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
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={loteamentos}
        renderItem={({ item }) => <LoteamentoCard item={item} navigation={navigation} />}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={<InstagramSection />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#059669', '#3B82F6']}
            tintColor="#059669" // iOS
          />
        }
        // Empty component caso não haja dados
        ListEmptyComponent={
            !isLoading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum empreendimento encontrado.</Text>
                </View>
            ) : null
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
  contentContainer: {
    paddingBottom: 100,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  cardTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1E293B' 
  },
  cardDescription: { 
    fontSize: 14, 
    color: '#64748B', 
    marginTop: 4, 
    marginBottom: 12 
  },
  featuresContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 16, 
    gap: 8 
  },
  featureBadge: { 
    backgroundColor: '#F1F5F9', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 6
  },
  featureText: { 
    color: '#334155', 
    fontSize: 12, 
    fontWeight: '500' 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    gap: 12 
  },
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
  mediaButtonText: { 
    color: '#334155', 
    fontWeight: 'bold', 
    marginLeft: 8 
  },
  acquireButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#059669', // Verde do Design System
    alignItems: 'center',
    justifyContent: 'center',
  },
  acquireButtonDisabled: { 
    backgroundColor: '#9CA3AF' 
  },
  acquireButtonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 16,
  },
});