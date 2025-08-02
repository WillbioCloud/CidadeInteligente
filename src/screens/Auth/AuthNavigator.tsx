// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importe as telas de autenticação que você já criou
import LoginScreen from '../../screens/Auth/LoginScreen';
import RegisterScreen from '../../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../../screens/Auth/ForgotPasswordScreen';

const AuthStack = createStackNavigator();

/**
 * Este navegador gerencia o fluxo de telas para usuários NÃO autenticados.
 */
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* A tela inicial do fluxo é o Login */}
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
      
      {/* Telas que podem ser acessadas a partir do Login */}
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen} 
      />
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
      />

    </AuthStack.Navigator>
  );
}