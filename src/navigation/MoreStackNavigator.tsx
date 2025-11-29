<<<<<<< HEAD
// Local: src/navigation/MoreStackNavigator.tsx (VERSÃO COM CASING CORRIGIDO)
=======
// Local: src/navigation/MoreStackNavigator.tsx
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Telas da aba Mais
import MoreTabScreen from '../screens/More/MoreTabScreen';
import PlaceholderScreen from '../screens/More/PlaceholderScreen';

<<<<<<< HEAD
// --- AQUI ESTÁ A CORREÇÃO ---
// Garante que a importação usa o nome exato do arquivo: 'CourtSchedulingScreen'
import CourtSchedulingScreen from '../screens/scheduling/CourtSchedulingScreen';

=======
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
const Stack = createStackNavigator();

export default function MoreStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tela Principal */}
      <Stack.Screen name="MoreTabHome" component={MoreTabScreen} />

<<<<<<< HEAD
      {/* --- ROTA ATUALIZADA --- */}
      <Stack.Screen name="CourtScheduling" component={CourtSchedulingScreen} />

      {/* As outras rotas continuam usando o Placeholder */}
=======
      {/* Telas de Destino (usando o Placeholder) */}
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
      <Stack.Screen name="CommunityEvents" component={PlaceholderScreen} initialParams={{ screenName: 'Eventos da Comunidade' }} />
      <Stack.Screen name="MonitoringCameras" component={PlaceholderScreen} initialParams={{ screenName: 'Câmeras de Monitoramento' }} />
      <Stack.Screen name="RegionNews" component={PlaceholderScreen} initialParams={{ screenName: 'Notícias da Região' }} />
      <Stack.Screen name="Courses" component={PlaceholderScreen} initialParams={{ screenName: 'Cursos e Formações' }} />
      <Stack.Screen name="Support" component={PlaceholderScreen} initialParams={{ screenName: 'Contato Pós-venda' }} />
<<<<<<< HEAD
=======
      <Stack.Screen name="CourtScheduling" component={PlaceholderScreen} initialParams={{ screenName: 'Agendamento de Quadras' }} />
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
      <Stack.Screen name="SustainableTips" component={PlaceholderScreen} initialParams={{ screenName: 'Dicas Sustentáveis' }} />
      <Stack.Screen name="GarbageSeparation" component={PlaceholderScreen} initialParams={{ screenName: 'Separação de Lixo' }} />
      <Stack.Screen name="WeatherForecast" component={PlaceholderScreen} initialParams={{ screenName: 'Previsão do Tempo' }} />
      <Stack.Screen name="Emergency" component={PlaceholderScreen} initialParams={{ screenName: 'Emergência' }} />
      <Stack.Screen name="FBZSpace" component={PlaceholderScreen} initialParams={{ screenName: 'Espaço FBZ' }} />
      <Stack.Screen name="SpaceCapacity" component={PlaceholderScreen} initialParams={{ screenName: 'Lotação dos Espaços' }} />
      <Stack.Screen name="IPTU" component={PlaceholderScreen} initialParams={{ screenName: 'IPTU' }} />
      <Stack.Screen name="Feedback" component={PlaceholderScreen} initialParams={{ screenName: 'Enviar Feedback' }} />
    </Stack.Navigator>
  );
}