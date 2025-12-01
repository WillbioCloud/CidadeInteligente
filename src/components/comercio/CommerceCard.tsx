import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapPin, Star } from 'lucide-react-native';
import { ComerciosStackParamList } from '../../navigation/types';
import { theme } from '../../styles/designSystem';

// Define o tipo da navegação para este componente
type CommerceCardNavigationProp = StackNavigationProp<ComerciosStackParamList>;

// Interface para as propriedades que o card recebe
interface CommerceCardProps {
  commerce: {
    id: string;
    name: string;
    category: string;
    coverImage?: string;
    city?: string;
    rating?: number;
    // Podes adicionar mais campos se necessário
  };
}

const CommerceCard = ({ commerce }: CommerceCardProps) => {
  const navigation = useNavigation<CommerceCardNavigationProp>();

  const handlePress = () => {
    navigation.navigate('CommerceDetail', { 
      commerceId: commerce.id,
      commerceName: commerce.name 
    });
  };

  // Imagem de fallback caso a URL não exista ou falhe
  const imageSource = commerce.coverImage 
    ? { uri: commerce.coverImage } 
    : { uri: 'https://via.placeholder.com/400x200?text=Sem+Imagem' }; // Podes substituir por um asset local

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={imageSource} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{commerce.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{commerce.name}</Text>
          {commerce.rating && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>{commerce.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <MapPin size={14} color={theme.colors.text.tertiary} />
          <Text style={styles.cityText} numberOfLines={1}>
            {commerce.city || 'Localização não informada'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB', // Fundo amarelo claro
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#B45309', // Texto amarelo escuro
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityText: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
});

export default CommerceCard;