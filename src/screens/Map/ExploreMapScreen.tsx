import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, X, Home, ShoppingBag, Heart, Coffee } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Dimensões da imagem original do mapa (Ajuste conforme o seu arquivo real)
const MAP_WIDTH = 2000;
const MAP_HEIGHT = 1500;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Categorias para filtro
const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: MapPin },
  { id: 'Lazer', label: 'Lazer', icon: Coffee },
  { id: 'Comércio', label: 'Comércio', icon: ShoppingBag },
  { id: 'Saúde', label: 'Saúde', icon: Heart },
  { id: 'Residencial', label: 'Lotes', icon: Home },
];

// Dados Mockados dos pontos no mapa artístico (Coordenadas X/Y relativas à imagem)
const MAP_POINTS = [
  { id: '1', name: 'Praça Central', category: 'Lazer', x: 850, y: 600 },
  { id: '2', name: 'Hospital Regional', category: 'Saúde', x: 1200, y: 400 },
  { id: '3', name: 'Shopping Center', category: 'Comércio', x: 500, y: 900 },
  { id: '4', name: 'Lote Modelo', category: 'Residencial', x: 1500, y: 800 },
  { id: '5', name: 'Parque Linear', category: 'Lazer', x: 900, y: 1100 },
];

export default function ExploreMapScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  
  // Filtra os pontos
  const filteredPoints = MAP_POINTS.filter(point => {
    const matchesCategory = selectedCategory === 'all' || point.category === selectedCategory;
    const matchesSearch = point.name.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lazer': return '#F59E0B'; // Amarelo
      case 'Comércio': return '#3B82F6'; // Azul
      case 'Saúde': return '#EF4444'; // Vermelho
      case 'Residencial': return '#10B981'; // Verde
      default: return theme.colors.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Barra de Pesquisa e Filtros */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.text.tertiary} />
          <TextInput
            style={styles.input}
            placeholder="Buscar no mapa..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <X size={18} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterContainer}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                  isSelected && { backgroundColor: getCategoryColor(cat.label) }
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Icon size={14} color={isSelected ? '#FFF' : theme.colors.text.secondary} />
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Área do Mapa com Zoom */}
      <View style={styles.mapArea}>
        <ImageZoom
          cropWidth={SCREEN_WIDTH}
          cropHeight={SCREEN_HEIGHT - 180} // Desconta o header
          imageWidth={MAP_WIDTH}
          imageHeight={MAP_HEIGHT}
          minScale={0.3} // Ajuste para ver o mapa todo
          maxScale={3.0}
          enableCenterFocus={false}
          useNativeDriver={true}
          onClick={() => setSelectedPoint(null)}
        >
          <View>
            <Image
              // Certifique-se que esta imagem existe em src/assets/
              source={require('../../assets/compressed_mapa_ficticio.webp')}
              style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
              resizeMode="contain"
            />
            
            {/* Renderização dos Marcadores */}
            {filteredPoints.map((point) => (
              <TouchableOpacity
                key={point.id}
                style={[
                  styles.marker,
                  { left: point.x, top: point.y, backgroundColor: getCategoryColor(point.category) }
                ]}
                onPress={() => setSelectedPoint(point)}
              >
                <MapPin size={24} color="#FFF" fill="#FFF" />
              </TouchableOpacity>
            ))}
          </View>
        </ImageZoom>

        {/* Card de Informação do Ponto Selecionado (Overlay) */}
        {selectedPoint && (
          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, { backgroundColor: getCategoryColor(selectedPoint.category) }]}>
              <MapPin size={24} color="#FFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{selectedPoint.name}</Text>
              <Text style={styles.infoCategory}>{selectedPoint.category}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedPoint(null)} style={styles.closeButton}>
              <X size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    paddingBottom: 4,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
    marginRight: 8,
  },
  filterChipSelected: {
    borderWidth: 0,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Ajuste para o pino ficar centrado na coordenada (ponta em baixo)
    marginTop: -40, 
    marginLeft: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  infoCategory: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  closeButton: {
    padding: 8,
  },
});