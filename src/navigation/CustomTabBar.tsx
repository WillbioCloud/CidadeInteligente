import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Store, Activity, Trophy, User } from 'lucide-react-native';

export function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, color: string, size: number) => {
    switch (routeName) {
      case 'Home':
        return <Home size={size} color={color} />;
      case 'Comercios':
        return <Store size={size} color={color} />;
      case 'Feed':
        return <Activity size={size} color={color} />;
      case 'Gamificacao':
        return <Trophy size={size} color={color} />;
      case 'Conta':
        return <User size={size} color={color} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home': return 'Início';
      case 'Comercios': return 'Serviços'; // ou Comércios
      case 'Feed': return 'Feed';
      case 'Gamificacao': return 'Missões';
      case 'Conta': return 'Perfil';
      default: return routeName;
    }
  };

  return (
    <View style={[
      styles.container, 
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 } // Ajuste para iPhone X+
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const color = isFocused ? '#059669' : '#9CA3AF'; // Verde Primário vs Cinza

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
              {getIcon(route.name, isFocused ? '#059669' : '#6B7280', 24)}
            </View>
            <Text style={[
              styles.label, 
              { color: isFocused ? '#059669' : '#6B7280', fontWeight: isFocused ? '600' : '500' }
            ]}>
              {getLabel(route.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    elevation: 8, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconContainer: {
    padding: 6,
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: '#ECFDF5', // Fundo verde claro quando ativo
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});