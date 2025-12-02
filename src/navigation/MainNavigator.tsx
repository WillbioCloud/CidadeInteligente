import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// --- Telas Principais (Abas) ---
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import ComerciosTabScreen from '../screens/Comercios/ComerciosTabScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import GamificationTabScreen from '../screens/Gamification/GamificationTabScreen';
import ProfileTabScreen from '../screens/Profile/ProfileTabScreen';

// --- Telas Secundárias (Acessíveis pelos Cards da Home) ---
import TransportTabScreen from '../screens/Transport/TransportTabScreen';
import HealthTabScreen from '../screens/Health/HealthTabScreen';
import MapTabScreen from '../screens/Map/MapTabScreen';
import CourtSchedulingScreen from '../screens/scheduling/CourtSchedulingScreen';
import CourtBookingDetailScreen from '../screens/scheduling/CourtBookingDetailScreen';
import MyBookingsScreen from '../screens/scheduling/MyBookingsScreen';
import CommerceDetailScreen from '../screens/Comercios/CommerceDetailScreen';
import PostDetailModal from '../screens/Feed/PostDetailModal';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import SupportScreen from '../screens/support/SupportScreen';
import MoreTabScreen from '../screens/More/MoreTabScreen';
import PlaceholderScreen from '../screens/More/PlaceholderScreen';
import LoteamentoMediaScreen from '../screens/Home/LoteamentoMediaScreen';
import NutritionCalculatorScreen from '../screens/Health/NutritionCalculatorScreen';
import ExerciseFinderScreen from '../screens/Health/ExerciseFinderScreen';
import ExploreMapScreen from '../screens/Map/ExploreMapScreen';

// --- Componentes de UI ---
import { CustomTabBar } from './CustomTabBar';
import CustomHeader from '../components/layout/CustomHeader';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// --- Stack da Home (Centraliza o Super App) ---
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* A Home é a base */}
    <Stack.Screen name="HomeTab" component={HomeTabScreen} />
    
    {/* Serviços (Cards) */}
    <Stack.Screen name="Transport" component={TransportTabScreen} />
    <Stack.Screen name="Health" component={HealthTabScreen} />
    <Stack.Screen name="Mapa" component={MapTabScreen} />
    <Stack.Screen name="ExploreMap" component={ExploreMapScreen} />
    <Stack.Screen name="More" component={MoreTabScreen} />
    
    {/* Agendamentos */}
    <Stack.Screen name="CourtScheduling" component={CourtSchedulingScreen} />
    <Stack.Screen name="CourtBookingDetail" component={CourtBookingDetailScreen} />
    <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
    
    {/* Funcionalidades de Saúde */}
    <Stack.Screen name="NutritionCalculator" component={NutritionCalculatorScreen} />
    <Stack.Screen name="ExerciseFinder" component={ExerciseFinderScreen} />

    {/* Detalhes */}
    <Stack.Screen name="LoteamentoMedia" component={LoteamentoMediaScreen} />
    <Stack.Screen name="CommerceDetail" component={CommerceDetailScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailModal} />
    
    {/* Outros */}
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    <Stack.Screen name="CommunityEvents" component={PlaceholderScreen} initialParams={{ title: 'Eventos' }} />
    <Stack.Screen name="MonitoringCameras" component={PlaceholderScreen} initialParams={{ title: 'Câmeras' }} />
  </Stack.Navigator>
);

const ComerciosStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ComerciosTab" component={ComerciosTabScreen} />
    <Stack.Screen name="CommerceDetail" component={CommerceDetailScreen} />
  </Stack.Navigator>
);

const FeedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FeedList" component={FeedScreen} />
    <Stack.Screen name="PostDetail" component={PostDetailModal} />
  </Stack.Navigator>
);

const GamificacaoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamificacaoTab" component={GamificationTabScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileTab" component={ProfileTabScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
    <Stack.Screen name="PrivacyPolicy" component={PlaceholderScreen} initialParams={{ title: 'Política de Privacidade' }} />
  </Stack.Navigator>
);

// --- Navegador de Abas (Bottom Tabs com Swipe) ---
const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarPosition="bottom"
    screenOptions={{ swipeEnabled: true }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Comercios" component={ComerciosStack} />
    <Tab.Screen name="Feed" component={FeedStack} />
    <Tab.Screen name="Gamificacao" component={GamificacaoStack} />
    <Tab.Screen name="Conta" component={ProfileStack} />
  </Tab.Navigator>
);

export default function MainNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{
              header: () => <CustomHeader />
            }}
          />
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}