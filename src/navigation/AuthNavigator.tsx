<<<<<<< HEAD
// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

// Importe as novas telas que você adicionou
import SplashScreen from '../screens/Auth/SplashScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';

// Importe as telas existentes
=======
// Local: src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

<<<<<<< HEAD
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
      <AuthStack.Screen
        name="Splash"
        component={SplashScreen}
      />
      {/* A segunda tela é a de Boas-vindas */}
      <AuthStack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      {/* As telas restantes mantêm o mesmo fluxo */}
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
      />
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
=======
const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
