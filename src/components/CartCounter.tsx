'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from './CartStore';
import CartModal from './CartModal';

export default function CartCounter() {
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative p-2.5 rounded-full bg-gradient-to-br from-[#3c2415] to-[#2d2d2d] 
                         hover:from-[#4a2e1a] hover:to-[#3a3a3a] shadow-lg hover:shadow-xl 
                         transform hover:scale-105 transition-all group"
      >
        <ShoppingBag size={18} className="text-white" />
        {mounted && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs 
                         text-white flex items-center justify-center font-medium animate-pulse">
            {totalItems}
          </span>
        )}
      </button>
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}