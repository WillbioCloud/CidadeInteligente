import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Platform, 
  Image, 
  FlatList, 
  Linking 
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, MapType, Region } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { 
  MapPin, 
  Navigation, 
  Store, 
  Plus, 
  Layers, 
  Satellite, 
  Combine, 
  Compass 
} from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Tipagem para os locais do mapa
interface MapLocation {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  type: 'commerce' | 'poi';
  image_url?: string;
  phone?: string;
}

// Card do BottomSheet
const LocationCard = ({ item, onGetDirections }: { item: MapLocation, onGetDirections: (loc: MapLocation) => void }) => (
  <View style={styles.carouselCard}>
    <Image 
      source={{ uri: item.image_url || 'https://via.placeholder.com/200x100' }} 
      style={styles.carouselImage} 
    />
    <View style={styles.carouselContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.cardCategory}>{item.category}</Text>
    </View>
    <TouchableOpacity style={styles.directionsButton} onPress={() => onGetDirections(item)}>
      <Navigation size={16} color="#FFF" />
      <Text style={styles.directionsButtonText}>Ir agora</Text>
    </TouchableOpacity>
  </View>
);

export default function MapTabScreen() {
  const { selectedLoteamentoId } = useUserStore(); // Se tiveres este estado na store
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [isCentering, setIsCentering] = useState(false);
  
  // Estados de UI
  const [isFabMenuOpen, setFabMenuOpen] = useState(false);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [isMapTypeExpanded, setMapTypeExpanded] = useState(false);
  const [activeSheetTab, setActiveSheetTab] = useState<'commerce' | 'poi'>('commerce');
  const [heading, setHeading] = useState(0);
  const [isCompassLocked, setIsCompassLocked] = useState(false);

  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Snap points para o Bottom Sheet (altura mínima e máxima)
  const snapPoints = useMemo(() => ['15%', '45%'], []);

  // Animações
  const fabAnimation = useSharedValue(0);
  const mapTypeAnimation = useSharedValue(0);
  
  const animatedCompassStyle = useAnimatedStyle(() => ({ 
    transform: [{ rotate: `${heading}deg` }] 
  }));
  
  const animatedFabStyle = useAnimatedStyle(() => ({ 
    transform: [{ translateY: withTiming((1 - fabAnimation.value) * 30) }], 
    opacity: withTiming(fabAnimation.value) 
  }));
  
  const animatedMapTypeStyle = useAnimatedStyle(() => ({ 
    transform: [{ translateY: withTiming((1 - mapTypeAnimation.value) * 30) }], 
    opacity: withTiming(mapTypeAnimation.value) 
  }));

  // Buscar dados
  useEffect(() => {
    const fetchAllLocations = async () => {
      setLoading(true);
      try {
        // Buscar comércios ativos
        const { data: commerceData } = await supabase
          .from('comercios')
          .select('id, nome, categoria, latitude, longitude, capa_url')
          .eq('status', 'approved'); // Exemplo de filtro

        // Buscar pontos de interesse (escolas, parques, etc)
        const { data: poiData } = await supabase
          .from('points_of_interest') // Certifica-te que esta tabela existe ou remove esta parte
          .select('id, name, category, latitude, longitude, image_url');

        // Formatar dados
        const formattedCommerces: MapLocation[] = (commerceData || [])
          .filter(loc => loc.latitude && loc.longitude)
          .map(loc => ({
            id: loc.id,
            name: loc.nome,
            category: loc.categoria,
            latitude: loc.latitude,
            longitude: loc.longitude,
            image_url: loc.capa_url,
            type: 'commerce'
          }));

        const formattedPois: MapLocation[] = (poiData || [])
          .filter(loc => loc.latitude && loc.longitude)
          .map(loc => ({ ...loc, type: 'poi' }));

        setLocations([...formattedCommerces, ...formattedPois]);
      } catch (error) {
        console.log('Erro ao carregar mapa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLocations();
  }, [selectedLoteamentoId]);

  // Bússola e Direção
  useEffect(() => {
    let headingSubscription: Location.LocationSubscription | undefined;
    
    const startWatchingHeading = async () => {
      if (showUserLocation) {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;
        
        headingSubscription = await Location.watchHeadingAsync(newHeading => {
          if (newHeading.trueHeading >= 0) {
            setHeading(newHeading.trueHeading);
            if (isCompassLocked) {
              mapRef.current?.animateCamera({ heading: newHeading.trueHeading }, { duration: 250 });
            }
          }
        });
      }
    };

    startWatchingHeading();
    return () => { headingSubscription?.remove(); };
  }, [showUserLocation, isCompassLocked]);

  const handleGetDirections = (location: MapLocation) => {
    const { latitude, longitude } = location;
    const url = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`
    });
    if(url) Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir o mapa."));
  };

  const toggleFabMenu = () => { 
    setFabMenuOpen(v => !v); 
    fabAnimation.value = withTiming(isFabMenuOpen ? 0 : 1); 
  };
  
  const toggleMapTypeMenu = () => { 
    setMapTypeExpanded(v => !v); 
    mapTypeAnimation.value = withTiming(isMapTypeExpanded ? 0 : 1); 
  };
  
  const selectMapType = (type: MapType) => { 
    setMapType(type); 
    toggleMapTypeMenu(); 
  };

  const handleMyLocationPress = async () => {
    if (showUserLocation) { 
      // Se já está mostrando, apenas centra
      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
      toggleFabMenu();
      return; 
    }

    setIsCentering(true);
    toggleFabMenu();
    
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { 
      Alert.alert('Permissão Negada', 'Precisamos de acesso à sua localização.'); 
      setIsCentering(false); 
      return; 
    }

    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setShowUserLocation(true);
      mapRef.current?.animateToRegion({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude, 
        latitudeDelta: 0.01, 
        longitudeDelta: 0.01 
      }, 1000);
    } catch (e) { 
      Alert.alert("Erro", "Não foi possível obter a localização."); 
    } finally { 
      setIsCentering(false); 
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} 
        style={StyleSheet.absoluteFill} 
        provider={PROVIDER_GOOGLE} 
        mapType={mapType} 
        initialRegion={{ 
          latitude: -15.946495, 
          longitude: -48.316314, // Coordenadas centrais padrão (ajuste para sua cidade)
          latitudeDelta: 0.05, 
          longitudeDelta: 0.05 
        }} 
        showsUserLocation={showUserLocation} 
        showsMyLocationButton={false} 
        showsCompass={false} // Usamos nossa própria bússola
      >
        {locations.map(loc => (
          <Marker 
            key={`${loc.type}-${loc.id}`} 
            coordinate={{ latitude: loc.latitude, longitude: loc.longitude }} 
            pinColor={loc.type === 'commerce' ? theme.colors.secondary : theme.colors.primary}
          >
            <Callout tooltip onPress={() => handleGetDirections(loc)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{loc.name}</Text>
                <Text style={styles.calloutSubtitle}>Toque para ir</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Botão da Bússola */}
      <TouchableOpacity 
        style={[styles.compassButton, isCompassLocked && styles.compassButtonLocked]} 
        onPress={() => {
            setIsCompassLocked(false);
            mapRef.current?.animateCamera({ heading: 0 }, { duration: 500 });
        }}
        onLongPress={() => setIsCompassLocked(v => !v)}
      >
        <Animated.View style={animatedCompassStyle}>
          <Compass size={28} color={isCompassLocked ? "white" : "#374151"} />
        </Animated.View>
      </TouchableOpacity>

      {/* Botões Flutuantes (Direita) - Menu Principal */}
      <View style={styles.fabContainerRight}>
        {isFabMenuOpen && ( 
          <Animated.View style={[styles.fabSubMenu, animatedFabStyle]}>
            <TouchableOpacity 
              style={styles.fabSubButton} 
              onPress={() => { bottomSheetRef.current?.expand(); toggleFabMenu(); }}
            >
              <Store size={24} color="#374151" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.fabSubButton, showUserLocation && { backgroundColor: '#DBEAFE' }]} 
              onPress={handleMyLocationPress} 
              disabled={isCentering}
            >
              {isCentering ? (
                <ActivityIndicator color={theme.colors.primary} /> 
              ) : (
                <Navigation size={24} color={showUserLocation ? theme.colors.primary : "#374151"} />
              )}
            </TouchableOpacity>
          </Animated.View> 
        )}
        <TouchableOpacity 
          style={[styles.fab, isFabMenuOpen && { transform: [{ rotate: '45deg' }] }]} 
          onPress={toggleFabMenu}
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Botões Flutuantes (Esquerda) - Tipo de Mapa */}
      <View style={styles.fabContainerLeft}>
        {isMapTypeExpanded && ( 
          <Animated.View style={[styles.fabSubMenu, animatedMapTypeStyle]}>
            <TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('hybrid')}>
              <Combine size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('satellite')}>
              <Satellite size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('standard')}>
              <MapPin size={24} color="#374151" />
            </TouchableOpacity>
          </Animated.View> 
        )}
        <TouchableOpacity 
          style={[styles.fab, {backgroundColor: theme.colors.primary}]} 
          onPress={toggleMapTypeMenu}
        >
          <Layers size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet com Locais */}
      <BottomSheet 
        ref={bottomSheetRef} 
        index={0} 
        snapPoints={snapPoints} 
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
      >
        <View style={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>Explorar Arredores</Text>
          <View style={styles.sheetTabs}>
            <TouchableOpacity 
              style={[styles.sheetTab, activeSheetTab === 'commerce' && styles.sheetTabActive]} 
              onPress={() => setActiveSheetTab('commerce')}
            >
              <Text style={[styles.sheetTabText, activeSheetTab === 'commerce' && styles.sheetTabTextActive]}>
                Comércios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sheetTab, activeSheetTab === 'poi' && styles.sheetTabActive]} 
              onPress={() => setActiveSheetTab('poi')}
            >
              <Text style={[styles.sheetTabText, activeSheetTab === 'poi' && styles.sheetTabTextActive]}>
                Pontos
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            data={locations.filter(l => l.type === activeSheetTab)} 
            keyExtractor={item => `${item.type}-${item.id}`} 
            renderItem={({ item }) => <LocationCard item={item} onGetDirections={handleGetDirections} />} 
            contentContainerStyle={{paddingVertical: 16}}
            ListEmptyComponent={
                <Text style={{marginLeft: 12, color: 'gray', marginTop: 20}}>
                    Nenhum local encontrado nesta categoria.
                </Text>
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9FB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Callout (Balão do Marcador)
  calloutContainer: { 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 8, 
    width: 150, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  calloutTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  calloutSubtitle: { fontSize: 12, color: theme.colors.primary },

  // Botão Bússola
  compassButton: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 40, 
    right: 20, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  compassButtonLocked: { backgroundColor: theme.colors.primary },

  // Botões Flutuantes (FAB)
  fabContainerRight: { position: 'absolute', bottom: '25%', right: 20, alignItems: 'center', zIndex: 10 },
  fabContainerLeft: { position: 'absolute', bottom: '25%', left: 20, alignItems: 'center', zIndex: 10 },
  
  fab: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: theme.colors.secondary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  fabSubMenu: { marginBottom: 16, gap: 12, alignItems: 'center' },
  fabSubButton: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4 
  },

  // Bottom Sheet
  bottomSheetBackground: { 
    backgroundColor: '#F8FAFC', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  sheetContainer: { flex: 1, paddingHorizontal: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  sheetTabs: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
  sheetTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  sheetTabActive: { backgroundColor: 'white', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  sheetTabText: { color: '#64748B', fontWeight: '600' },
  sheetTabTextActive: { color: theme.colors.primary },

  // Card Carrossel
  carouselCard: { 
    width: 220, 
    marginRight: 16, 
    backgroundColor: 'white', 
    borderRadius: 16, 
    overflow: 'hidden', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  carouselImage: { width: '100%', height: 100, backgroundColor: '#E2E8F0' },
  carouselContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  cardCategory: { fontSize: 12, color: '#64748B', marginTop: 2 },
  directionsButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: theme.colors.primary, 
    paddingVertical: 8, 
    marginHorizontal: 12, 
    marginBottom: 12, 
    borderRadius: 8, 
    gap: 6 
  },
  directionsButtonText: { color: 'white', fontWeight: '600', fontSize: 12 },
});