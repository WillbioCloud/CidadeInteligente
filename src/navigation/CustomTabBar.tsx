import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../hooks/useUserStore';
import * as Icons from '../components/Icons'; // Importando do nosso arquivo central

const icons = {
  Home: Icons.Home,
  Transporte: Icons.Bus,
  Saude: Icons.Heart,
  Gamificacao: Icons.Star,
  Mais: Icons.MoreHorizontal,
};

export function CustomTabBar({ state, descriptors, navigation }) {
  const { isClient } = useUserStore();

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const Icon = icons[label];
        const isGamificationDisabled = label === 'Gamificacao' && !isClient;

        const onPress = () => {
          if (isGamificationDisabled) {
            alert('Esta área é exclusiva para clientes.');
            return;
          }
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity key={index} style={styles.tabItem} onPress={onPress}>
            {Icon && (
              <View style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}>
                <Icon color={isFocused ? '#FFFFFF' : isGamificationDisabled ? '#D1D5DB' : '#4A90E2'} size={24} />
              </View>
            )}
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused, isGamificationDisabled && styles.tabLabelDisabled]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
// Estilos continuam os mesmos
const styles = StyleSheet.create({
  tabBarContainer: { position: 'absolute', bottom: 25, left: 20, right: 20, flexDirection: 'row', backgroundColor: 'white', borderRadius: 35, height: 70, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, justifyContent: 'space-around', alignItems: 'center' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  iconContainerFocused: { backgroundColor: '#4A90E2', transform: [{ translateY: -25 }], elevation: 5, shadowColor: '#4A90E2', shadowOpacity: 0.5, shadowRadius: 5 },
  tabLabel: { fontSize: 12, color: '#888' },
  tabLabelFocused: { color: '#4A90E2', fontWeight: 'bold' },
  tabLabelDisabled: { opacity: 0.5 },
});