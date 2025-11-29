<<<<<<< HEAD
// src/navigation/MainNavigator.tsx (VERSÃO CORRIGIDA COM HEADER E SWIPE)

import React, { useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// --- Importações de Telas e Navegadores ---
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import ComerciosTabScreen from '../screens/Comercios/ComerciosTabScreen';
import GamificationTabScreen from '../screens/Gamification/GamificationTabScreen';
import MapTabScreen from '../screens/Map/MapTabScreen';
import ProfileTabScreen from '../screens/Profile/ProfileTabScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import CommerceDetailScreen from '../screens/Comercios/CommerceDetailScreen';
import CourtSchedulingScreen from '../screens/scheduling/CourtSchedulingScreen';
import CourtBookingDetailScreen from '../screens/scheduling/CourtBookingDetailScreen';
import MyBookingsScreen from '../screens/scheduling/MyBookingsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import PlaceholderScreen from '../screens/More/PlaceholderScreen';
import HealthTabScreen from '../screens/Health/HealthTabScreen';
import EmpreendimentosScreen from '../screens/Home/EmpreendimentosScreen';
import LoteamentoMediaScreen from '../screens/Home/LoteamentoMediaScreen';
import OperatingHoursScreen from '../screens/info/OperatingHoursScreen';
import FeedStackNavigator from './FeedStackNavigator';
import MoreStackNavigator from './MoreStackNavigator';
import { CustomTabBar } from './CustomTabBar';
import CustomHeader from '../components/layout/CustomHeader';
import NotificationsModal from '../components/layout/NotificationsModal';
import TransportTabScreen from '../screens/Transport/TransportTabScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// --- Stacks de Navegação ---
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeTab" component={HomeTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CourtScheduling" component={CourtSchedulingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CourtBookingDetail" component={CourtBookingDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CommerceDetail" component={CommerceDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Health" component={HealthTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Empreendimentos" component={EmpreendimentosScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoteamentoMedia" component={LoteamentoMediaScreen} options={{ headerShown: false }} />
    <Stack.Screen name="OperatingHours" component={OperatingHoursScreen} options={{ headerShown: false }} />
    <Stack.Screen name="More" component={MoreStackNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Mapa" component={MapTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Transport" component={TransportTabScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ComerciosStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ComerciosTab" component={ComerciosTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CommerceDetail" component={CommerceDetailScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const GamificacaoStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="GamificacaoTab" component={GamificationTabScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileTab" component={ProfileTabScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    
    {/* NOVA TELA ADICIONADA AQUI */}
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

    <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
  </Stack.Navigator>
);

// --- Componente que contém as abas com swipe ---
const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarPosition="bottom"
    screenOptions={{
      swipeEnabled: true,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Comercios" component={ComerciosStack} />
    <Tab.Screen name="Feed" component={FeedStackNavigator} />
    <Tab.Screen name="Gamificacao" component={GamificacaoStack} />
    <Tab.Screen name="Conta" component={ProfileStack} />
  </Tab.Navigator>
);

const AppContent = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openNotifications = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{
            header: () => <CustomHeader onNotificationsPress={openNotifications} />
          }}
        />
      </Stack.Navigator>
      <NotificationsModal ref={bottomSheetModalRef} />
    </>
  );
}

export default function MainNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AppContent />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
=======
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
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
