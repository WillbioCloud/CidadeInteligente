import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Lightbulb, X } from 'lucide-react-native';
import { theme } from '../../styles/designSystem';

// Habilita animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* Ícone de lâmpada preenchido com a cor primária */}
        <Lightbulb size={24} color={theme.colors.primary} fill={theme.colors.primary} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Dica do Dia</Text>
        <Text style={styles.text}>
          Complete todas as missões diárias para ganhar um bônus especial de 50 XP!
        </Text>
      </View>

      <TouchableOpacity 
        onPress={handleClose} 
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={20} color={theme.colors.text.tertiary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5', // Verde muito claro (Primary Bg)
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#D1FAE5', // Borda verde suave
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -4, // Ajuste fino para alinhar com o topo
  },
});