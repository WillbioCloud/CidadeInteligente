import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Instagram, ShoppingBag, Clock, Plus } from 'lucide-react-native';
import { theme } from '../../../styles/designSystem';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
}

interface ProductLayoutProps {
  commerce: any;
  navigation: any;
}

export default function ProductLayout({ commerce, navigation }: ProductLayoutProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Garante que a lista de produtos é um array
  const products: Product[] = commerce.product_list || [];

  // Extrai categorias únicas
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtra produtos
  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleOpenWhatsapp = () => {
    if (!commerce.contact?.whatsapp) return;
    const cleanNumber = commerce.contact.whatsapp.replace(/\D/g, '');
    const message = "Olá! Gostaria de fazer um pedido.";
    Linking.openURL(`https://wa.me/55${cleanNumber}?text=${encodeURIComponent(message)}`);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image 
        source={item.image_url ? { uri: item.image_url } : { uri: 'https://via.placeholder.com/100' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.productPrice}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleOpenWhatsapp}>
        <Plus size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Compacto */}
      <View style={styles.header}>
        <Image 
          source={commerce.coverImage ? { uri: commerce.coverImage } : { uri: 'https://via.placeholder.com/800x400' }} 
          style={styles.headerImage} 
        />
        <View style={styles.headerOverlay}>
          <SafeAreaView edges={['top']}>
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {commerce.rating}</Text>
              </View>
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{commerce.name}</Text>
              <Text style={styles.subtitle}>{commerce.category} • {commerce.city}</Text>
              <View style={styles.statusRow}>
                <Clock size={14} color="#FFF" />
                <Text style={styles.statusText}>{commerce.openingHours}</Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>

      {/* Categorias */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ShoppingBag size={48} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyText}>Nenhum produto disponível nesta categoria.</Text>
          </View>
        }
      />

      {/* Botão Flutuante de Pedido */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.orderButton} onPress={handleOpenWhatsapp}>
          <Text style={styles.orderButtonText}>Fazer Pedido no WhatsApp</Text>
          <Phone size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 220,
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  ratingBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  headerContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500',
  },
  categoriesWrapper: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Espaço para o botão flutuante
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 34, // Safe area para iPhone X+
  },
  orderButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});