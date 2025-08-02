// src/navigation/MainNavigator.tsx

import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// --- Importações de Telas e Navegadores ---

// Abas Principais
import HomeTabScreen from '../screens/Home/HomeTabScreen';
import ComerciosTabScreen from '../screens/Comercios/ComerciosTabScreen';
import GamificationTabScreen from '../screens/Gamification/GamificationTabScreen';
import MapTabScreen from '../screens/Map/MapTabScreen';

// Telas da Pilha "Conta"
import ProfileTabScreen from '../screens/Profile/ProfileTabScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

// Telas Adicionais
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

// Navegador da Tela "Mais"
import MoreStackNavigator from './MoreStackNavigator';

// Componentes e Configurações de Navegação
import { CustomTabBar } from './CustomTabBar';
import CustomHeader from '../components/layout/CustomHeader'; // Importa o header
import NotificationsModal from '../components/layout/NotificationsModal'; // Importa o modal

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Definição das Pilhas de Navegação (Stacks) ---

// As Stacks individuais (HomeStack, ComerciosStack, etc.) permanecem as mesmas
// que você já tem no seu arquivo. Vou mantê-las aqui para o contexto.

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeTab" component={HomeTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CourtScheduling" component={CourtSchedulingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CourtBookingDetail" component={CourtBookingDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CommerceDetail" component={CommerceDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Support" component={SupportScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Health" component={HealthTabScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Empreendimentos" component={EmpreendimentosScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoteamentoMedia" component={LoteamentoMediaScreen} options={{ headerShown: false }} />
    <Stack.Screen name="OperatingHours" component={OperatingHoursScreen} options={{ headerShown: false }} />
    <Stack.Screen name="More" component={MoreStackNavigator} options={{ headerShown: false }} />
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
        <Stack.Screen name="GamificacaoTab" component={GamificationTabScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
);

const MapaStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="MapTab" component={MapTabScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileTab" component={ProfileTabScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Achievements" component={AchievementsScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
  </Stack.Navigator>
);

// --- Navegador Principal (Abas) ---

export default function MainNavigator() {
  // 1. Trazemos o controle do modal para o navegador principal.
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const openNotifications = () => setNotificationsVisible(true);
  const closeNotifications = () => setNotificationsVisible(false);

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        // 2. Usamos a prop 'screenOptions' para definir um header customizado para TODAS as abas.
        screenOptions={{
          // A função 'header' recebe as props de navegação e retorna o nosso componente de cabeçalho.
          // Passamos a ele a função para abrir o modal.
          header: () => <CustomHeader onNotificationsPress={openNotifications} />,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        {/* As suas abas */}
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Comercios" component={ComerciosStack} />
        <Tab.Screen name="Gamificacao" component={GamificacaoStack} />
        {/* 3. Para a aba do Mapa, que não tem header, nós sobrescrevemos a opção */}
        <Tab.Screen
          name="Mapa"
          component={MapaStack}
          options={{ headerShown: false }} // Esconde o header apenas para esta aba
        />
        <Tab.Screen name="Conta" component={ProfileStack} />
      </Tab.Navigator>

      {/* 4. Renderizamos o modal aqui, no nível mais alto, para que ele possa
           aparecer por cima de qualquer tela. */}
      <NotificationsModal
        isVisible={notificationsVisible}
        onClose={closeNotifications}
      />
    </>
  );
};