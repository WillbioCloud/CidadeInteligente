import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Instagram, MapPin, Clock, Info } from 'lucide-react-native';
import ImageView from "react-native-image-viewing";
import { theme } from '../../../styles/designSystem';

interface ClassicLayoutProps {
  commerce: any;
  navigation: any;
}

const InfoRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <View style={styles.infoRow}>
    <Icon size={18} color={theme.colors.text.secondary} />
    <Text style={styles.infoText}>{text || 'Não informado'}</Text>
  </View>
);

export default function ClassicLayout({ commerce, navigation }: ClassicLayoutProps) {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const logoUrl = commerce.logo 
    ? { uri: commerce.logo } 
    : { uri: 'https://via.placeholder.com/200x200?text=Logo' };

  // Garante que é um array para não quebrar o visualizador
  const galleryImages = (commerce.images || []).map((url: string) => ({ uri: url }));

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryVisible(true);
  };

  const handleOpenWhatsapp = () => {
    if (!commerce.contact?.whatsapp) return;
    const cleanNumber = commerce.contact.whatsapp.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/55${cleanNumber}`);
  };

  const handleOpenInstagram = () => {
    if (!commerce.contact?.instagram) return;
    const username = commerce.contact.instagram.replace('@', '');
    Linking.openURL(`https://instagram.com/${username}`);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cabeçalho do Perfil */}
          <View style={styles.profileHeader}>
            <Image source={logoUrl} style={styles.logo} />
            <Text style={styles.name}>{commerce.name}</Text>
            <Text style={styles.category}>{commerce.category}</Text>
          </View>

          {/* Botões de Ação */}
          <View style={styles.actionsContainer}>
             <TouchableOpacity style={styles.actionButton} onPress={handleOpenWhatsapp}>
              <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                <Phone size={20} color="#3B82F6" />
              </View>
              <Text style={styles.buttonText}>Ligar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenInstagram}>
              <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
                <Instagram size={20} color="#DB2777" />
              </View>
              <Text style={styles.buttonText}>Instagram</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
              <View style={styles.card}>
                  <InfoRow icon={Info} text={commerce.description} />
                  <InfoRow icon={MapPin} text={`${(commerce.loteamento_id || '').replace('_', ' ')}, ${commerce.city}`} />
                  <InfoRow icon={Clock} text={commerce.openingHours} />
              </View>

              {commerce.services && commerce.services.length > 0 && (
                  <View style={styles.card}>
                      <Text style={styles.sectionTitle}>Principais Serviços</Text>
                      {commerce.services.map((service: string, index: number) => (
                          <Text key={index} style={styles.serviceItem}>• {service}</Text>
                      ))}
                  </View>
              )}

              {commerce.images && commerce.images.length > 0 && (
                  <View style={styles.card}>
                      <Text style={styles.sectionTitle}>Galeria</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {commerce.images.map((img: string, index: number) => (
                            <TouchableOpacity key={index} onPress={() => openGallery(index)}>
                                <Image source={{uri: img}} style={styles.galleryImage} />
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                  </View>
              )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ImageView
        images={galleryImages}
        imageIndex={currentImageIndex}
        visible={isGalleryVisible}
        onRequestClose={() => setIsGalleryVisible(false)}
        FooterComponent={({ imageIndex }) => (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{`${imageIndex + 1} / ${galleryImages.length}`}</Text>
            </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginTop: 4,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 24,
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
    flexShrink: 1,
    lineHeight: 20,
  },
  serviceItem: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 6,
    paddingLeft: 8,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  footer: {
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});