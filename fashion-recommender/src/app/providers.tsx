'use client';

import dynamic from 'next/dynamic';
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { StylistProvider } from "@/context/StylistContext";
import { CheckoutProvider } from "@/context/CheckoutContext";

// Lazy load heavy modal components - they are only needed when opened
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const WishlistDrawer = dynamic(() => import("@/components/WishlistDrawer"), { ssr: false });
const StylistModal = dynamic(() => import("@/components/StylistModal"), { ssr: false });
const CheckoutModal = dynamic(() => import("@/components/CheckoutModal"), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <StylistProvider>
            <CheckoutProvider>
              {children}
              <CartDrawer />
              <WishlistDrawer />
              <StylistModal />
              <CheckoutModal />
            </CheckoutProvider>
          </StylistProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
