import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define o formato dos dados que o contexto vai guardar
interface ModalContextData {
  isVisible: boolean;
  modalContent: ReactNode | null;
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

// Cria o contexto com valores iniciais vazios
const ModalContext = createContext<ModalContextData>({
  isVisible: false,
  modalContent: null,
  showModal: () => {},
  hideModal: () => {},
});

// Hook personalizado para facilitar o uso do contexto
export const useModal = () => useContext(ModalContext);

// O Provider que vai envolver a aplicação no App.tsx
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ isVisible, modalContent, showModal, hideModal }}>
      {children}
      {/* Aqui poderíamos renderizar o modal global se houver conteúdo */}
      {isVisible && modalContent} 
    </ModalContext.Provider>
  );
};