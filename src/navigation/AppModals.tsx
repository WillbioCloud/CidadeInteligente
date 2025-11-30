import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AppModals() {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* O Toast ficará sobreposto a qualquer tela */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Ocupa a tela toda
    zIndex: 9999, // Garante prioridade máxima de visualização
    elevation: 9999, // Para Android
    pointerEvents: 'box-none', // Permite que toques passem para as camadas inferiores
    backgroundColor: 'transparent',
  },
});