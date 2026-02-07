'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface StylistContextType {
  isStylistOpen: boolean;
  setIsStylistOpen: (open: boolean) => void;
}

const StylistContext = createContext<StylistContextType>({
  isStylistOpen: false,
  setIsStylistOpen: () => {},
});

export function StylistProvider({ children }: { children: ReactNode }) {
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  return (
    <StylistContext.Provider value={{ isStylistOpen, setIsStylistOpen }}>
      {children}
    </StylistContext.Provider>
  );
}

export function useStylist() {
  return useContext(StylistContext);
}
