import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/Feed/FeedScreen';
import PostDetailModal from '../screens/Feed/PostDetailModal';
import { FeedStackParamList } from './types';

const Stack = createStackNavigator<FeedStackParamList>();

export default function FeedStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FeedList"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F9FAFB' },
      }}
    >
      <Stack.Screen 
        name="FeedList" 
        component={FeedScreen} 
      />
      
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailModal} 
        options={{
          // No iOS, isto faz a tela subir de baixo para cima (modal nativo)
          // No Android, é uma transição padrão ou configurável
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}