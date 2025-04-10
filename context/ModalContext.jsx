"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

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

  // Track state changes to debounce multiple calls
  const isChangingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Prevent rapid state changes with debounced wrapper
  const setModalOpenDebounced = useCallback((value) => {
    if (isChangingRef.current) return;

    isChangingRef.current = true;
    setModalOpen(value);

    // Reset the lock after a short delay
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isChangingRef.current = false;
    }, 100);
  }, []);

  // Add a placeholder closeModal function that can be overridden by components
  const [closeModal, setCloseModalFunc] = useState(
    () =>
      (isBackAction = false) => {
        if (isBackAction && isNestedModal) {
          setNestedModal(false);
        } else {
          setModalOpenDebounced(false);
          setNestedModal(false);
        }
      }
  );

  // Allow components to register their own closeModal implementation
  const registerCloseModal = useCallback((closeModalFunc) => {
    setCloseModalFunc(() => closeModalFunc);
  }, []);

  // Clean up on unmount
  useCallback(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        setModalOpen: setModalOpenDebounced,
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
