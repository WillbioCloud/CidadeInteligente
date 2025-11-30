// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import SplashScreen from '../screens/Auth/SplashScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        // Adiciona a animação de slide horizontal para todas as telas
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* A tela inicial agora é o SplashScreen */}
      <AuthStack.Screen name="Splash" component={SplashScreen} />

      {/* A segunda tela é a de Boas-vindas */}
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />

      {/* As telas restantes mantêm o mesmo fluxo */}
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen as any} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}