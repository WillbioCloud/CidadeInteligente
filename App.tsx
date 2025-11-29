// App.tsx
import React from 'react';
import AppRouter from './src/navigation/AppRouter';
<<<<<<< HEAD
import { ModalProvider } from './src/context/ModalContext'; // Adicione a importação do ModalProvider
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importante para gestos

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalProvider>
            <AppRouter />
        </ModalProvider>
    </GestureHandlerRootView>
  );
}
=======
import { UserStoreProvider } from './src/hooks/useUserStore'; // Exemplo, se você usa Provider

export default function App() {
  return (
    // Seus providers (Zustand, etc.) devem envolver o AppRouter
    <AppRouter />
  );
}
>>>>>>> 6d26a00523b75e2536c4facee5dd0405dba08391
