import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking, 
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  ArrowLeft, 
  Star, 
  Share2 
} from 'lucide-react-native';
import { theme } from '../../../styles/designSystem';

const { width } = Dimensions.get('window');

interface ModernLayoutProps {
  commerce: any;
  navigation: any;
}

export default function ModernLayout({ commerce, navigation }: ModernLayoutProps) {
  
  const handleOpenWhatsapp = () => {
    if (!commerce.contact?.whatsapp) return;
    const cleanNumber = commerce.contact.whatsapp.replace(/\D/g, '');
    const message = "Olá! Vi seu comércio no App Cidade Inteligente.";
    Linking.openURL(`https://wa.me/55${cleanNumber}?text=${encodeURIComponent(message)}`);
  };

  const handleOpenInstagram = () => {
    if (!commerce.contact?.instagram) return;
    // Remove o @ se o utilizador tiver colocado
    const username = commerce.contact.instagram.replace('@', '');
    Linking.openURL(`https://instagram.com/${username}`);
  };

  const handleShare = () => {
    // Lógica futura de partilha
    alert('Funcionalidade de partilhar em breve!');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header com Imagem e Gradiente */}
        <View style={styles.imageContainer}>
          <Image 
            source={commerce.coverImage ? { uri: commerce.coverImage } : { uri: 'https://via.placeholder.com/800x600' }} 
            style={styles.coverImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageGradient}
          />
          
          {/* Botões de Navegação no Header */}
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <ArrowLeft color="#FFF" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Share2 color="#FFF" size={24} />
            </TouchableOpacity>
          </View>

          {/* Informações Sobrepostas na Imagem */}
          <View style={styles.headerInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{commerce.category}</Text>
            </View>
            <Text style={styles.title}>{commerce.name}</Text>
            <View style={styles.ratingRow}>
              <Star fill="#FBBF24" color="#FBBF24" size={16} />
              <Text style={styles.ratingText}>{commerce.rating} (Excelente)</Text>
            </View>
          </View>
        </View>

        {/* Conteúdo Principal */}
        <View style={styles.content}>
          {/* Status e Horário */}
          <View style={styles.statusCard}>
            <Clock color={theme.colors.primary} size={20} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.statusTitle}>Horário de Funcionamento</Text>
              <Text style={styles.statusText}>{commerce.openingHours}</Text>
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.description}>{commerce.description || "Sem descrição disponível."}</Text>
          </View>

          {/* Localização */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <View style={styles.locationRow}>
              <MapPin color={theme.colors.text.secondary} size={18} />
              <Text style={styles.locationText}>{commerce.city}</Text>
            </View>
          </View>

          {/* Galeria (Exemplo Simples) */}
          {commerce.images && commerce.images.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Galeria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {commerce.images.map((img: string, index: number) => (
                  <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Barra de Ações Fixa no Rodapé */}
      <View style={styles.footer}>
        {commerce.contact?.instagram && (
          <TouchableOpacity style={[styles.actionButton, styles.instaButton]} onPress={handleOpenInstagram}>
            <Instagram color={theme.colors.primary} size={24} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={handleOpenWhatsapp}>
          <Phone color="#FFF" size={20} />
          <Text style={styles.whatsappText}>Entrar em Contato</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#FBBF24',
    fontWeight: '600',
  },
  content: {
    padding: 20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20, // Sobrepõe ligeiramente a imagem
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceHighlight,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instaButton: {
    width: 56,
    backgroundColor: theme.colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#25D366', // Cor oficial WhatsApp
  },
  whatsappText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});