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

  // Improved state locking system
  const isChangingRef = useRef(false);
  const lockStateDuration = 300; // ms to lock state changes

  // Lock state changes for a specified duration
  const lockState = useCallback(() => {
    isChangingRef.current = true;
    setTimeout(() => {
      isChangingRef.current = false;
    }, lockStateDuration);
  }, []);

  // Improved modal open function with better locking
  const setModalOpenSafe = useCallback(
    (value) => {
      if (isChangingRef.current) {
        console.log("State change blocked: too many rapid changes");
        return;
      }

      // Set state and lock changes
      lockState();
      console.log(`Setting modal open: ${value}`);
      setModalOpen(value);
    },
    [lockState]
  );

  // Completely rewritten nested modal handling
  const setNestedModalSafe = useCallback(
    (value) => {
      // Validate constraints
      if (value && !isModalOpen) {
        console.warn("Cannot set nested modal when main modal is closed");
        return;
      }

      // Prevent excessive state changes
      if (value === isNestedModal) {
        return;
      }

      console.log(`Setting nested modal: ${isNestedModal} → ${value}`);

      // Update state immediately
      setNestedModal(value);
    },
    [isModalOpen, isNestedModal]
  );

  // Completely rewritten closeModal with better animation coordination
  const [closeModal, setCloseModalFunc] = useState(
    () =>
      (isBackAction = false) => {
        console.log(
          `Close modal called: isBackAction=${isBackAction}, isNested=${isNestedModal}`
        );

        // Handle back action from nested modal
        if (isBackAction && isNestedModal) {
          console.log("Going back from nested modal to main modal");

          // Update nested state immediately
          setNestedModal(false);
          return;
        }

        // Handle complete modal closing
        console.log("Closing modal completely");

        if (isNestedModal) {
          // First close nested modal
          setNestedModal(false);

          // Then close main modal after a delay
          setTimeout(() => {
            setModalOpenSafe(false);
          }, 500); // Increased delay for smoother animation
        } else {
          // Just close the main modal with a short delay
          // This delay allows the arrow animation to start
          setTimeout(() => {
            setModalOpenSafe(false);
          }, 200);
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
