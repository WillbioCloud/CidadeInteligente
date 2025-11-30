import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUserStore } from '../hooks/useUserStore';
import * as Icons from '../components/Icons';
import { designSystem } from '../styles/designSystem';
import { LOTEAMENTOS_CONFIG } from '../data/loteamentos.data';

// Map tab labels to icon components

const icons = {
  Home: Icons.Home,
  Comercios: Icons.Store,
  Gamificacao: Icons.Trophy || Icons.Star,
  Feed: Icons.Newspaper,
  Conta: Icons.User,
  Transporte: Icons.Bus,
  Saude: Icons.Heart,
  Mais: Icons.MoreHorizontal,
};

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const selectedLoteamentoId = useUserStore((s) => s.selectedLoteamentoId);
  const _hasHydrated = useUserStore((s) => s._hasHydrated);
  const isClient = useUserStore((s) => s.isClient);

  if (!_hasHydrated) return null;

  // Theme color logic
  const defaultTheme = designSystem.THEME_COLORS['green'] || { primary: '#22C55E' };
  let theme = defaultTheme;
  const colorName = LOTEAMENTOS_CONFIG[selectedLoteamentoId]?.color;
  if (colorName && designSystem.THEME_COLORS[colorName]) {
    theme = designSystem.THEME_COLORS[colorName];
  }

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const rawLabel = options.tabBarLabel ?? options.title ?? route.name;
        const label = typeof rawLabel === 'string' ? rawLabel : route.name;
        if (typeof label !== 'string') return null;
        const isFocused = state.index === index;
        const Icon = (icons as any)[label] || Icons.MoreHorizontal;
        const isGamificationDisabled = label === 'Gamificacao' && !isClient;
        const focusedColor = label === 'Gamificacao' ? theme.primary : designSystem.COLORS.green;

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
          <TouchableOpacity key={index} style={styles.tabItem} onPress={onPress} disabled={isGamificationDisabled}>
            {Icon && (
              <View style={[styles.iconContainer, isFocused && [styles.iconContainerFocused, { backgroundColor: focusedColor }]]}>
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

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 35,
    height: 70,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: '#4A90E2',
    transform: [{ translateY: -8 }],
    elevation: 5,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
  },
  tabLabelFocused: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  tabLabelDisabled: {
    opacity: 0.5,
  },
});