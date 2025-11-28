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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  );
}

const styles = StyleSheet.create({
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
});