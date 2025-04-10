"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext({
  isModalOpen: false,
  setModalOpen: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
