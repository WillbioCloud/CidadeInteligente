// src/navigation/MainNavigator.tsx (VERSÃO FINAL COM TELA DE CONQUISTAS)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Importe o Header e a TabBar
import CustomHeader from '../components/layout/CustomHeader';
import { CustomTabBar } from './CustomTabBar';

// Importe as telas
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import LoteamentoMediaScreen from '../screens/Home/LoteamentoMediaScreen';
import TransportTabScreen from '../screens/Transport/TransportTabScreen';
import HealthTabScreen from '../screens/Health/HealthTabScreen';
import MoreTabScreen from '../screens/More/MoreTabScreen';
import GamificationTabScreen from '../screens/Gamification/GamificationTabScreen';
import ExploreMapScreen from '../screens/Map/ExploreMapScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen'; // <-- 1. IMPORTE A NOVA TELA
import PlaceholderScreen from '../screens/More/PlaceholderScreen'; // <-- 2. IMPORTE A TELA DE PLACEHOLDER

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Opções do header que serão usadas em todas as pilhas
const screenOptionsWithHeader = {
  header: () => <CustomHeader />,
};

// --- Pilhas de cada aba ---

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptionsWithHeader}>
    <Stack.Screen name="HomeTab" component={HomeTabScreen} />
    <Stack.Screen name="LoteamentoMedia" component={LoteamentoMediaScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const TransporteStack = () => (
  <Stack.Navigator screenOptions={screenOptionsWithHeader}>
    <Stack.Screen name="TransporteTab" component={TransportTabScreen} />
    <Stack.Screen name="ExploreMap" component={ExploreMapScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const HealthStack = () => (
  <Stack.Navigator screenOptions={screenOptionsWithHeader}>
    <Stack.Screen name="SaudeTab" component={HealthTabScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const MoreStack = () => (
  <Stack.Navigator screenOptions={screenOptionsWithHeader}>
    <Stack.Screen name="MoreTab" component={MoreTabScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const GamificationStack = () => (
  <Stack.Navigator screenOptions={screenOptionsWithHeader}>
    <Stack.Screen name="GamificacaoTab" component={GamificationTabScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default function MainNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }} 
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Transporte" component={TransporteStack} options={{ tabBarLabel: 'Transporte' }}/>
      <Tab.Screen name="Saude" component={HealthStack} options={{ tabBarLabel: 'Saude' }}/>
      <Tab.Screen name="Gamificacao" component={GamificationStack} options={{ tabBarLabel: 'Gamificacao' }}/>
      <Tab.Screen name="Mais" component={MoreStack} options={{ tabBarLabel: 'Mais' }}/>
    </Tab.Navigator>
  );
};