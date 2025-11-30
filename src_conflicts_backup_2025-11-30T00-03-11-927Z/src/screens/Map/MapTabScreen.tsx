<<<<<<< HEAD
// src/screens/Map/MapTabScreen.tsx (Versão Final Polida)

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Platform, UIManager, Image, FlatList, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, MapType, Region } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { MapPin, Navigation, Store, Plus, Layers, Satellite, Combine, Compass, Navigation2 } from 'lucide-react-native';
import { LOTEAMENTOS_CONFIG, ALL_LOTEAMENTOS } from '../../data/loteamentos.data';
=======
// /src/screens/Map/MapTabScreen.tsx

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, FlatList, Dimensions, ImageBackground,
  UIManager, Platform, LayoutAnimation, TextInput
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchMapLocations, MapLocation, MAP_IMAGE_WIDTH, MAP_IMAGE_HEIGHT } from '../../api/mapApi';
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

<<<<<<< HEAD
// --- Funções e Interfaces auxiliares ---
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; const p1 = lat1 * Math.PI/180; const p2 = lat2 * Math.PI/180; const deltaP = (lat2-lat1) * Math.PI/180; const deltaL = (lon2-lon1) * Math.PI/180; const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(deltaL/2) * Math.sin(deltaL/2); const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return R * c;
}
interface MapLocation {
  id: string; name: string; category: string; latitude: number; longitude: number; type: 'commerce' | 'poi'; rating?: number; phone?: string; image_url: string;
}
const LocationCard = ({ item, onGetDirections }) => (
    <View style={styles.carouselCard}><Image source={{ uri: item.image_url || 'https://placehold.co/200x100' }} style={styles.carouselImage} /><View style={styles.carouselContent}><Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text><Text style={styles.cardCategory}>{item.category}</Text></View><TouchableOpacity style={styles.directionsButton} onPress={() => onGetDirections(item)}><Navigation size={18} color="#FFF" /><Text style={styles.directionsButtonText}>Como Chegar</Text></TouchableOpacity></View>
);


export default function MapTabScreen() {
  const { selectedLoteamentoId } = useUserStore();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const initialLoteamentoName = LOTEAMENTOS_CONFIG[selectedLoteamentoId!]?.name || 'Localização';
  const [viewedLoteamentoName, setViewedLoteamentoName] = useState(initialLoteamentoName);
  
  const [isCentering, setIsCentering] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isFabMenuOpen, setFabMenuOpen] = useState(false);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [isMapTypeExpanded, setMapTypeExpanded] = useState(false);
  const [activeSheetTab, setActiveSheetTab] = useState<'commerce' | 'poi'>('commerce');
  const [heading, setHeading] = useState(0);
  const [isCompassLocked, setIsCompassLocked] = useState(false);

  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const fabAnimation = useSharedValue(0);
  const mapTypeAnimation = useSharedValue(0);
  const animatedCompassStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${heading}deg` }] }));
  const animatedFabStyle = useAnimatedStyle(() => ({ transform: [{ translateY: withTiming((1 - fabAnimation.value) * 30) }], opacity: withTiming(fabAnimation.value) }));
  const animatedMapTypeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: withTiming((1 - mapTypeAnimation.value) * 30) }], opacity: withTiming(mapTypeAnimation.value) }));
  
  useEffect(() => {
    const fetchAllLocations = async () => {
        setLoading(true);
        const { data: commerceData } = await supabase.from('comercios').select('id, name:nome, category:categoria, latitude, longitude, image_url:capa_url').eq('status', 'approved').is('ativo', true);
        const { data: poiData } = await supabase.from('points_of_interest').select('id, name, category, latitude, longitude, image_url').eq('loteamento_id', selectedLoteamentoId);
        const { data: mapLocationData } = await supabase.from('map_locations').select('id, name, category, latitude:y_coord, longitude:x_coord, rating, phone, image_url');
        const formattedCommerces: MapLocation[] = (commerceData || []).filter(loc => loc.latitude && loc.longitude).map(loc => ({ ...loc, type: 'commerce' }));
        const formattedPois: MapLocation[] = (poiData || []).filter(loc => loc.latitude && loc.longitude).map(loc => ({ ...loc, type: 'poi' }));
        const formattedMapLocations: MapLocation[] = (mapLocationData || []).filter(loc => loc.latitude && loc.longitude).map(loc => ({ ...loc, type: 'commerce' }));
        const allLocationsMap = new Map<string, MapLocation>();
        formattedMapLocations.forEach(loc => allLocationsMap.set(loc.id, loc));
        formattedPois.forEach(loc => allLocationsMap.set(loc.id, loc));
        formattedCommerces.forEach(loc => allLocationsMap.set(loc.id, loc));
        setLocations(Array.from(allLocationsMap.values()));
        setLoading(false);
    };
    fetchAllLocations();
  }, [selectedLoteamentoId]);
  
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
    const { latitude, longitude, name } = location;
    const url = Platform.select({
      ios: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`
    });
    if(url) Linking.openURL(url).catch(() => Alert.alert("Erro", "Não foi possível abrir o app de mapas."));
  };

  const handleCardPress = useCallback((location: MapLocation) => {
    const markerId = `${location.type}-${location.id}`;
    setSelectedLocationId(markerId);
    mapRef.current?.animateToRegion({ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 500);
    setTimeout(() => { markerRefs.current[markerId]?.showCallout(); }, 600);
  }, []);

  const toggleFabMenu = () => { setFabMenuOpen(v => !v); fabAnimation.value = withTiming(isFabMenuOpen ? 0 : 1); };
  const toggleMapTypeMenu = () => { setMapTypeExpanded(v => !v); mapTypeAnimation.value = withTiming(isMapTypeExpanded ? 0 : 1); };
  const selectMapType = (type: MapType) => { setMapType(type); toggleMapTypeMenu(); };

  const handleMyLocationPress = async () => {
    if (showUserLocation) { setShowUserLocation(false); toggleFabMenu(); return; }
    setIsCentering(true);
    toggleFabMenu();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permissão Negada'); setIsCentering(false); return; }
    try {
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setShowUserLocation(true);
      mapRef.current?.animateToRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 1000);
    } catch (e) { Alert.alert("Erro", "Não foi possível obter a localização."); } 
    finally { setIsCentering(false); }
  };
  
  const handleRegionChange = useCallback((region: Region) => {
    let closestName = 'Explorando a região'; let minDistance = 2000;
    for (const loteamento of ALL_LOTEAMENTOS) {
        if (loteamento.center) {
            const distance = getDistance(region.latitude, region.longitude, loteamento.center.lat, loteamento.center.lon);
            if (distance < minDistance) { minDistance = distance; closestName = loteamento.name; }
        }
    }
    setViewedLoteamentoName(closestName);
  }, []);

  if (loading) return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" /></SafeAreaView>;

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={StyleSheet.absoluteFill} provider={PROVIDER_GOOGLE} mapType={mapType} initialRegion={{ latitude: -15.946495, longitude: -48.316314, latitudeDelta: 0.02, longitudeDelta: 0.02 }} showsUserLocation={showUserLocation} showsMyLocationButton={false} onRegionChangeComplete={handleRegionChange} onPress={() => { setSelectedLocationId(null); if(isMapTypeExpanded) toggleMapTypeMenu(); if(isFabMenuOpen) toggleFabMenu(); }}>
        {locations.map(loc => {
          const markerId = `${loc.type}-${loc.id}`;
          return (
            <Marker key={markerId} ref={ref => markerRefs.current[markerId] = ref} coordinate={{ latitude: loc.latitude, longitude: loc.longitude }} pinColor={selectedLocationId === markerId ? '#FF5722' : (loc.type === 'commerce' ? '#3B82F6' : '#16A34A')} onPress={() => handleCardPress(loc)}>
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Image source={{ uri: loc.image_url || 'https://placehold.co/200x100' }} style={styles.calloutImage} />
                  <View style={styles.calloutTextContainer}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>{loc.name}</Text>
                  </View>
                  <TouchableOpacity style={styles.calloutButton} onPress={() => handleGetDirections(loc)}>
                    <Navigation size={18} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      
      <View style={styles.locationPopup}><MapPin size={16} color="white" /><Text style={styles.popupText}>Visualizando: {viewedLoteamentoName}</Text></View>

      <TouchableOpacity style={[styles.compassButton, isCompassLocked && styles.compassButtonLocked]} onPress={() => mapRef.current?.animateCamera({ heading: isCompassLocked ? 0 : heading }, { duration: 500 })} onLongPress={() => setIsCompassLocked(prevState => !prevState)}>
        <Animated.View style={animatedCompassStyle}><Compass size={28} color={isCompassLocked ? "white" : "#374151"} /></Animated.View>
      </TouchableOpacity>

      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} backgroundStyle={styles.bottomSheetBackground} handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }} enablePanDownToClose={true}>
        <View style={styles.sheetContainer}><View style={styles.sheetTabs}><TouchableOpacity style={[styles.sheetTab, activeSheetTab === 'commerce' && styles.sheetTabActive]} onPress={() => setActiveSheetTab('commerce')}><Text style={[styles.sheetTabText, activeSheetTab === 'commerce' && styles.sheetTabTextActive]}>Comércios ({locations.filter(l=>l.type==='commerce').length})</Text></TouchableOpacity><TouchableOpacity style={[styles.sheetTab, activeSheetTab === 'poi' && styles.sheetTabActive]} onPress={() => setActiveSheetTab('poi')}><Text style={[styles.sheetTabText, activeSheetTab === 'poi' && styles.sheetTabTextActive]}>Pontos de Interesse ({locations.filter(l=>l.type==='poi').length})</Text></TouchableOpacity></View>
          {activeSheetTab === 'commerce' ? ( <FlatList horizontal showsHorizontalScrollIndicator={false} data={locations.filter(l=>l.type==='commerce')} keyExtractor={item => `${item.type}-${item.id}`} renderItem={({ item }) => <LocationCard item={item} onGetDirections={handleGetDirections} />} contentContainerStyle={{paddingVertical: 16}} /> ) : ( <FlatList horizontal showsHorizontalScrollIndicator={false} data={locations.filter(l=>l.type==='poi')} keyExtractor={item => `${item.type}-${item.id}`} renderItem={({ item }) => <LocationCard item={item} onGetDirections={handleGetDirections} />} contentContainerStyle={{paddingVertical: 16}} /> )}
        </View>
      </BottomSheet>
      
      <View style={styles.fabContainerRight}>{isFabMenuOpen && ( <Animated.View style={[styles.fabSubMenu, animatedFabStyle]}><TouchableOpacity style={styles.fabSubButton} onPress={() => { bottomSheetRef.current?.expand(); toggleFabMenu(); }}><Store size={24} color="#374151" /></TouchableOpacity><TouchableOpacity style={[styles.fabSubButton, showUserLocation && { backgroundColor: '#DBEAFE' }]} onPress={handleMyLocationPress} disabled={isCentering}>{isCentering ? <ActivityIndicator color="#3B82F6" /> : <Navigation size={24} color={showUserLocation ? "#3B82F6" : "#374151"} />}</TouchableOpacity></Animated.View> )}
        <TouchableOpacity style={[styles.fab, isFabMenuOpen && { transform: [{ rotate: '45deg' }] }]} onPress={toggleFabMenu}><Plus size={32} color="white" /></TouchableOpacity>
      </View>
      
      <View style={styles.fabContainerLeft}>{isMapTypeExpanded && ( <Animated.View style={[styles.fabSubMenu, animatedMapTypeStyle]}><TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('hybrid')}><Combine size={24} color="#374151" /></TouchableOpacity><TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('satellite')}><Satellite size={24} color="#374151" /></TouchableOpacity><TouchableOpacity style={styles.fabSubButton} onPress={() => selectMapType('standard')}><MapPin size={24} color="#374151" /></TouchableOpacity></Animated.View> )}
        <TouchableOpacity style={[styles.fab, {backgroundColor: '#10B981'}]} onPress={toggleMapTypeMenu}><Layers size={28} color="white" /></TouchableOpacity>
      </View>
    </View>
=======
const categories = [
  { id: 'all', name: 'Todos', icon: 'grid-outline' },
  { id: 'Comércio', name: 'Comércio', icon: 'cart-outline' },
  { id: 'Saúde', name: 'Saúde', icon: 'medkit-outline' },
  { id: 'Lazer', name: 'Lazer', icon: 'leaf-outline' },
  { id: 'Serviços', name: 'Serviços', icon: 'briefcase-outline' },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Saúde': return '#EF4444';
    case 'Comércio': return '#3B82F6';
    case 'Lazer': return '#10B981';
    case 'Serviços': return '#6366F1';
    default: return '#6B7280';
  }
};

const LocationCard = memo(({ item, isFocused, onSelect, onCopy }) => (
  <TouchableOpacity 
    style={[styles.cardWrapper, isFocused && styles.selectedCard]}
    activeOpacity={0.9}
    onPress={() => onSelect(item)}
  >
    <View style={styles.locationCard}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.locationName} numberOfLines={1}>{item.name}</Text>
          {item.hasPromo && <View style={styles.promoTag}><Text style={styles.promoText}>Promoção</Text></View>}
        </View>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#757575" />
            <Text style={styles.detailText}>{item.hours}</Text>
          </View>
          {item.phone !== 'N/A' && (
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color="#4CAF50" />
              <Text style={[styles.detailText, { color: '#388E3C' }]}>{item.phone}</Text>
              <TouchableOpacity style={{ marginLeft: 10, padding: 5 }} onPress={() => onCopy(item.phone)}>
                <Ionicons name="copy-outline" size={20} color="#757575" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.cardSideInfo}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));

export default function MapTabScreen() {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height - insets.top - insets.bottom;

  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<MapLocation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState<MapLocation | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const zoomRef = useRef<ImageZoom>(null);
  const lastTouchTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchMapLocations().then(data => {
      setLocations(data);
      setFilteredLocations(data);
    });
  }, []);

  useEffect(() => {
    let results = locations;
    if (selectedCategory !== 'all') {
      results = results.filter(loc => loc.category === selectedCategory);
    }
    if (searchTerm) {
      results = results.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredLocations(results);
    setFocusedLocation(null);
  }, [selectedCategory, searchTerm, locations]);

  const copyToClipboard = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({ type: 'success', text1: 'Copiado!' });
  }, []);

  const handleSelectLocation = useCallback((location: MapLocation | null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (location && location.id === focusedLocation?.id) {
      setFocusedLocation(null);
      return;
    }
    setFocusedLocation(location);
    if (location) {
      setTimeout(() => {
        zoomRef.current?.centerOn({ x: location.x, y: location.y, scale: 1.8, duration: 600 });
      }, 200);

      const index = filteredLocations.findIndex(loc => loc.id === location.id);
      if (index > -1) {
        try {
          flatListRef.current?.scrollToIndex({ animated: true, index, viewPosition: 0.5 });
        } catch (e) {
          console.warn('scrollToIndex error', e);
        }
      }
    }
  }, [filteredLocations, focusedLocation]);

  const handleMapMove = () => {
    const now = Date.now();
    if (now - lastTouchTimeRef.current > 1000) {
      setFocusedLocation(null);
    }
  };

  const toggleMapExpansion = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMapExpanded(prev => !prev);
  }, []);

  const renderLocationItem = useCallback(({ item }) => (
    <LocationCard 
      item={item}
      isFocused={focusedLocation?.id === item.id}
      onSelect={handleSelectLocation}
      onCopy={copyToClipboard}
    />
  ), [focusedLocation, handleSelectLocation, copyToClipboard]);

  return (
    <SafeAreaView style={styles.container}>
      {!isMapExpanded && (
        <View style={styles.header}>
          <Text style={styles.title}>Mapa & Comércios</Text>
          <Text style={styles.subtitle}>Descubra estabelecimentos próximos</Text>
        </View>
      )}

      <View style={[styles.mapWrapper, isMapExpanded && styles.mapWrapperExpanded]}>
        <ImageZoom
          ref={zoomRef}
          cropWidth={Dimensions.get('window').width}
          cropHeight={isMapExpanded ? screenHeight : 200}
          imageWidth={MAP_IMAGE_WIDTH}
          imageHeight={MAP_IMAGE_HEIGHT}
          minScale={0.2}
          maxScale={2.5}
          onMove={handleMapMove}
        >
          <ImageBackground
            source={require('../../assets/compressed_mapa_ficticio.webp')}
            style={{ width: MAP_IMAGE_WIDTH, height: MAP_IMAGE_HEIGHT }}
            resizeMode="contain"
          >
            {locations.map(location => (
              <TouchableOpacity
                key={location.id}
                style={[styles.markerContainer, { left: location.x, top: location.y }]}
                onPress={() => handleSelectLocation(location)}
              >
                <Ionicons
                  name="location"
                  size={40}
                  color={focusedLocation?.id === location.id ? '#FF5722' : getCategoryColor(location.category)}
                />
              </TouchableOpacity>
            ))}
          </ImageBackground>
        </ImageZoom>

        <TouchableOpacity style={styles.expandButton} onPress={toggleMapExpansion}>
          <Ionicons name={isMapExpanded ? 'contract-outline' : 'expand-outline'} size={22} color="#FFF" />
        </TouchableOpacity>

        {isMapExpanded && focusedLocation && (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>{focusedLocation.name}</Text>
            <Text style={styles.infoBoxAddress}>{focusedLocation.address}</Text>
            <TouchableOpacity style={styles.infoBoxCloseButton} onPress={() => handleSelectLocation(null)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isMapExpanded && (
        <View style={styles.listSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9E9E9E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estabelecimentos..."
              placeholderTextColor="#9E9E9E"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <View style={styles.filtersContainer}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.categoryButton, selectedCategory === cat.id && styles.categoryButtonActive]}
              >
                <Ionicons name={cat.icon} size={20} color={selectedCategory === cat.id ? '#FFF' : '#424242'} />
                <Text style={[styles.categoryText, selectedCategory === cat.id && { color: '#FFF' }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            ref={flatListRef}
            data={filteredLocations}
            keyExtractor={item => item.id}
            renderItem={renderLocationItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <Text style={styles.listTitle}>Estabelecimentos ({filteredLocations.length})</Text>
            )}
          />
        </View>
      )}
    </SafeAreaView>
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSheetBackground: { backgroundColor: '#F8FAFC', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetContainer: { flex: 1, paddingHorizontal: 12, marginBottom: 90 },
  sheetTabs: { flexDirection: 'row', backgroundColor: '#E5E7EB', borderRadius: 12, padding: 4, marginTop: 8 },
  sheetTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  sheetTabActive: { backgroundColor: 'white' },
  sheetTabText: { color: '#4B5563', fontWeight: '600' },
  sheetTabTextActive: { color: '#3B82F6' },
  carouselCard: { width: 260, marginRight: 12, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1,  },
  carouselImage: { width: '100%', height: 120 },
  carouselContent: { padding: 4, flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardCategory: { color: '#6B7280', fontSize: 11, marginTop: -1, backgroundColor: '#F3F4F6', alignSelf: 'flex-start', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 10 },
  directionsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B82F6', paddingVertical: 10, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, gap: 8 },
  directionsButtonText: { color: 'white', fontWeight: 'bold' },
  locationPopup: { position: 'absolute', top: 15, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, zIndex: 10 },
  popupText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  // AJUSTE DE POSIÇÃO DOS BOTÕES
  fabContainerRight: { position: 'absolute', bottom: 125, right: 20, alignItems: 'center', zIndex: 10 },
  fabContainerLeft: { position: 'absolute', bottom: 125, left: 20, alignItems: 'center', zIndex: 10 },
  compassButton: { position: 'absolute', top: 120, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
  compassButtonLocked: { backgroundColor: '#3B82F6' },
  
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabSubMenu: { marginBottom: 16, gap: 12, alignItems: 'center' },
  fabSubButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 6 },

  // ESTILOS DO NOVO CALLOUT
  calloutContainer: { width: 220, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', elevation: 5 },
  calloutImage: { width: '100%', height: 100 },
  calloutTextContainer: { paddingHorizontal: 12, paddingVertical: 10, flex: 1 },
  calloutTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  calloutButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20 },
=======
    container: { flex: 1, backgroundColor: '#F9F9FB' },
    header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 0 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#121212' },
    subtitle: { fontSize: 16, color: '#616161', marginTop: 4 },
    listSection: { flex: 1 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', height: 50 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 10, color: '#121212' },
    mapWrapper: { height: 200, marginHorizontal: 20, marginTop: 15, borderRadius: 16, overflow: 'hidden', backgroundColor: '#E0E0E0' },
    mapWrapperExpanded: { height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, borderRadius: 0, margin: 0 },
    expandButton: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20, zIndex: 20 },
    markerContainer: { position: 'absolute', transform: [{translateX: -20}, {translateY: -40}] },
    filtersContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginVertical: 15 },
    categoryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F0F0F0' },
    categoryButtonActive: { backgroundColor: '#2196F3' },
    categoryText: { fontWeight: '600', marginLeft: 8, color: '#424242' },
    listTitle: { fontSize: 18, fontWeight: 'bold', color: '#121212', paddingBottom: 10 },
    listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    cardWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    locationCard: { padding: 15, flexDirection: 'row', alignItems: 'center' },
    selectedCard: { borderColor: '#2196F3' },
    cardContent: { flex: 1, marginRight: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    locationName: { fontSize: 17, fontWeight: 'bold', color: '#212121', flexShrink: 1 },
    promoTag: { backgroundColor: '#FF5252', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
    promoText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    locationAddress: { fontSize: 14, color: '#757575', marginTop: 4, marginBottom: 10 },
    cardSideInfo: { alignItems: 'flex-end', justifyContent: 'center' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontWeight: 'bold', fontSize: 16, color: '#212121', marginLeft: 4 },
    cardDetails: { paddingTop: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailText: { marginLeft: 10, fontSize: 14, color: '#616161' },
    infoBox: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
    },
    infoBoxTitle: { fontSize: 18, fontWeight: 'bold', color: '#121212' },
    infoBoxAddress: { fontSize: 14, color: '#616161', marginTop: 4 },
    infoBoxCloseButton: { position: 'absolute', top: 10, right: 10, padding: 5 },
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
});