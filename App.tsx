// App.tsx
import React from 'react';
import AppRouter from './src/navigation/AppRouter';
import { UserStoreProvider } from './src/hooks/useUserStore'; // Exemplo, se você usa Provider

export default function App() {
  return (
    // Seus providers (Zustand, etc.) devem envolver o AppRouter
    <AppRouter />
  );
}