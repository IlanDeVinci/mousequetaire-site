"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ModalContext = createContext({
  isModalOpen: false,
  setModalOpen: () => {},
  isNestedModal: false,
  setNestedModal: () => {},
  closeModal: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNestedModal, setNestedModal] = useState(false);
  // Add a placeholder closeModal function that can be overridden by components
  const [closeModal, setCloseModalFunc] = useState(
    () =>
      (isBackAction = false) => {
        if (isBackAction && isNestedModal) {
          setNestedModal(false);
        } else {
          setModalOpen(false);
          setNestedModal(false);
        }
      }
  );

  // Allow components to register their own closeModal implementation
  const registerCloseModal = useCallback((closeModalFunc) => {
    setCloseModalFunc(() => closeModalFunc);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        setModalOpen,
        isNestedModal,
        setNestedModal,
        closeModal,
        registerCloseModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
