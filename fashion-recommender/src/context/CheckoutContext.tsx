'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CheckoutContextType {
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType>({
  isCheckoutOpen: false,
  setIsCheckoutOpen: () => {},
});

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <CheckoutContext.Provider value={{ isCheckoutOpen, setIsCheckoutOpen }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
