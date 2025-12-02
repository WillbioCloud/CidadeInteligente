import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WeatherCard from '../home/WeatherCard'; 
import LotsAvailableCard from '../home/LotsAvailableCard';

export default function InformativeCards() {
  // Mock para garantir renderização
  const mockWeather = { temp: 28, feelsLike: 30, description: 'Ensolarado', city: 'Cidade Inteligente', icon: '01d', humidity: 45, windSpeed: 12 };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
      style={{ marginTop: 32 }}
    >
      <View style={{ width: 280, marginRight: 16 }}>
        <WeatherCard weatherData={mockWeather} />
      </View>
      <View style={{ width: 280 }}>
        <LotsAvailableCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
});