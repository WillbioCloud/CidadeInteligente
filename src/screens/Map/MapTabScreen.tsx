// src/screens/Map/MapTabScreen.tsx (Versão Turbinada)

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Platform, UIManager, Image, FlatList } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../hooks/useUserStore';
import { Star, Phone, MapPin, Navigation, Store, Plus, Building } from 'lucide-react-native';
import { LOTEAMENTOS_CONFIG } from '../../data/loteamentos.data';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MapLocation {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  type: 'commerce' | 'poi';
  rating?: number;
  phone?: string;
  image_url: string;
}

export default function MapTabScreen() {
  const { selectedLoteamentoId } = useUserStore();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [isCentering, setIsCentering] = useState(false);
  const [isFabMenuOpen, setFabMenuOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['47%'], []);
  const loteamentoName = LOTEAMENTOS_CONFIG[selectedLoteamentoId!]?.name || 'Localização';
  const fabAnimation = useSharedValue(0);

  const animatedFabStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - fabAnimation.value) * 30 }],
    opacity: fabAnimation.value
  }));

  useEffect(() => {
    const fetchAllLocations = async () => {
      setLoading(true);
      const { data: commerceData } = await supabase.from('map_locations').select('id, name, category, latitude:y_coord, longitude:x_coord, rating, phone, image_url');
      const { data: poiData } = await supabase.from('points_of_interest').select('id, name, category, latitude, longitude, image_url').eq('loteamento_id', selectedLoteamentoId);
      const formattedCommerces: MapLocation[] = (commerceData || []).filter(loc => loc.latitude && loc.longitude).map(loc => ({ ...loc, type: 'commerce' }));
      const formattedPois: MapLocation[] = (poiData || []).filter(loc => loc.latitude && loc.longitude).map(loc => ({ ...loc, type: 'poi' }));
      setLocations([...formattedCommerces, ...formattedPois]);
      setLoading(false);
    };
    fetchAllLocations();
  }, [selectedLoteamentoId]);

  const handleCardPress = useCallback((location: MapLocation) => {
    const markerId = `${location.type}-${location.id}`;
    setSelectedLocationId(markerId);
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    }, 500);
    setTimeout(() => {
      markerRefs.current[markerId]?.showCallout();
    }, 600);
  }, []);

  const toggleFabMenu = () => {
    const newValue = !isFabMenuOpen;
    fabAnimation.value = withTiming(newValue ? 1 : 0, { duration: 200 });
    setFabMenuOpen(newValue);
  };

  const handleMyLocationPress = async () => {
    if (showUserLocation) {
      setShowUserLocation(false);
      toggleFabMenu();
      return;
    }
    setIsCentering(true);
    toggleFabMenu();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada');
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
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" /></SafeAreaView>;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{ latitude: -15.946495, longitude: -48.316314, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        onPress={() => setSelectedLocationId(null)}
      >
        {locations.map(loc => {
          const markerId = `${loc.type}-${loc.id}`;
          return (
            <Marker
              key={markerId}
              ref={ref => markerRefs.current[markerId] = ref}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              pinColor={selectedLocationId === markerId ? '#FF5722' : (loc.type === 'commerce' ? '#3B82F6' : '#16A34A')}
              onPress={() => handleCardPress(loc)}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Image source={{ uri: loc.image_url || 'https://placehold.co/200x100' }} style={styles.calloutImage} />
                  <View style={styles.calloutTextContainer}>
                    <Text style={styles.calloutTitle}>{loc.name}</Text>
                    <Text style={styles.calloutCategory}>{loc.category}</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.locationPopup}>
        <MapPin size={16} color="white" />
        <Text style={styles.popupText}>Visualizando: {loteamentoName}</Text>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
        enablePanDownToClose={true}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.listTitle}>Estabelecimentos Próximos</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={locations}
            keyExtractor={item => `${item.type}-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.carouselCard} onPress={() => handleCardPress(item)}>
                <Image source={{ uri: item.image_url || 'https://placehold.co/200x100' }} style={styles.carouselImage} />
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
                {item.phone && <Text style={styles.cardPhoneText}>{item.phone}</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheet>

      <View style={styles.fabContainer}>
        {isFabMenuOpen && (
          <Animated.View style={[styles.fabSubMenu, animatedFabStyle]}>
            <TouchableOpacity style={styles.fabSubButton} onPress={() => { bottomSheetRef.current?.expand(); toggleFabMenu(); }}>
              <Store size={24} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.fabSubButton, showUserLocation && { backgroundColor: '#DBEAFE' }]} onPress={handleMyLocationPress} disabled={isCentering}>
              {isCentering ? <ActivityIndicator color="#3B82F6" /> : <Navigation size={24} color={showUserLocation ? "#3B82F6" : "#374151"} />}
            </TouchableOpacity>
          </Animated.View>
        )}
        <TouchableOpacity style={[styles.fab, isFabMenuOpen && { transform: [{ rotate: '45deg' }] }]} onPress={toggleFabMenu}>
          <Plus size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomSheetBackground: { backgroundColor: '#F8FAFC', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  carouselCard: { width: 240, marginRight: 12, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 4, paddingBottom: 12 },
  carouselImage: { width: '100%', height: 120 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 12, marginTop: 8 },
  cardCategory: { marginHorizontal: 12, color: '#6B7280' },
  cardPhoneText: { marginHorizontal: 12, marginTop: 4, color: '#4B5563' },
  locationPopup: { position: 'absolute', top: 60, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, zIndex: 10 },
  popupText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  fabContainer: { position: 'absolute', bottom: 110, right: 20, alignItems: 'center', zIndex: 10 },
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabSubMenu: { marginBottom: 16, gap: 12, alignItems: 'center' },
  fabSubButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  calloutContainer: { width: 220, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', elevation: 5 },
  calloutImage: { width: '100%', height: 100 },
  calloutTextContainer: { padding: 12 },
  calloutTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  calloutCategory: { fontSize: 12, color: '#64748B', marginTop: 4 }
});
