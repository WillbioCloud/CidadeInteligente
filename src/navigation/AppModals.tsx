import React from 'react';
import { useModals } from '../context/ModalContext';
import { useUserStore } from '../hooks/useUserStore';
import { supabase } from '../lib/supabase';

// Importe seus componentes de modal
import ProfileModal from '../components/layout/ProfileModal';
import NotificationsModal from '../components/layout/NotificationsModal';

/**
 * Este componente renderiza todos os modais globais do aplicativo.
 */
export default function AppModals() {
  const { isProfileVisible, hideProfile, isNotificationsVisible, hideNotifications } = useModals();
  
  const handleLogout = async () => {
    hideProfile();
    await supabase.auth.signOut();
  };

  return (
    <>
      <ProfileModal 
        isVisible={isProfileVisible} 
        onClose={hideProfile} 
        onLogout={handleLogout} 
      />
      <NotificationsModal 
        isVisible={isNotificationsVisible} 
        onClose={hideNotifications} 
      />
    </>
  );
}