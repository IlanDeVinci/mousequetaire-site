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

  // Add a lock to prevent setting modal state more than once in quick succession
  const isChangingRef = useRef(false);

  // Simple function to prevent multiple rapid calls
  const setModalOpenSafe = useCallback((value) => {
    // Only allow state changes if we're not already changing
    if (isChangingRef.current) return;

    isChangingRef.current = true;
    setModalOpen(value);

    // Reset after a delay
    setTimeout(() => {
      isChangingRef.current = false;
    }, 500); // Long enough to prevent double triggers
  }, []);

  // Enhanced setNestedModal with safety checks
  const setNestedModalSafe = useCallback(
    (value) => {
      // Only allow nested modal changes when the main modal is open
      if (value && !isModalOpen) {
        console.warn("Cannot set nested modal when main modal is closed");
        return;
      }
      setNestedModal(value);
    },
    [isModalOpen]
  );

  // Simple closeModal implementation with improved nested modal handling
  const [closeModal, setCloseModalFunc] = useState(
    () =>
      (isBackAction = false) => {
        if (isBackAction && isNestedModal) {
          // When going back from nested modal, keep main modal open
          setNestedModal(false);
        } else {
          // When closing completely, close both
          setModalOpenSafe(false);
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
        setModalOpen: setModalOpenSafe,
        isNestedModal,
        setNestedModal: setNestedModalSafe, // Use the safe version
        closeModal,
        registerCloseModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
