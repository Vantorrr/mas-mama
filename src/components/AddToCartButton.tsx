'use client';

import { useState } from 'react';
import { ShoppingBag } from "lucide-react";
import { useCartStore } from './CartStore';
import Toast from './Toast';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  className?: string;
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  productPrice, 
  productImage, 
  className = "" 
}: AddToCartButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage
    });
    
    setShowToast(true);
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        className={className}
      >
        <ShoppingBag size={18} />
        В корзину
      </button>
      
      {showToast && (
        <Toast
          message={`"${productName}" добавлен в корзину!`}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
