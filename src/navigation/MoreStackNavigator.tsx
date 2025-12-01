import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreTabScreen from '../screens/More/MoreTabScreen';
import PlaceholderScreen from '../screens/More/PlaceholderScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import { MoreStackParamList } from './types';

const Stack = createStackNavigator<MoreStackParamList>();

export default function MoreStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      {/* Tela Principal do Menu */}
      <Stack.Screen name="Menu" component={MoreTabScreen} />

      {/* Tela de Conquistas (Acessível pelo menu Mais) */}
      <Stack.Screen name="Achievements" component={AchievementsScreen} />

      {/* --- Telas de Destino (usando o Placeholder por enquanto) --- */}
      
      {/* O erro estava provavelmente aqui. Comentários JSX devem estar entre chaves. */}
      
      <Stack.Screen 
        name="CommunityEvents" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Eventos da Comunidade' }} 
      />
      
      <Stack.Screen 
        name="MonitoringCameras" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Câmeras de Monitoramento' }} 
      />
      
      <Stack.Screen 
        name="RegionNews" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Notícias da Região' }} 
      />
      
      <Stack.Screen 
        name="Courses" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Cursos e Formações' }} 
      />
      
      <Stack.Screen 
        name="Support" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Contato Pós-venda' }} 
      />

      {/* Rota genérica para outros casos */}
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
      
    </Stack.Navigator>
  );
}