'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from './CartStore';
import SimpleCheckout from './SimpleCheckout';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-96 max-h-[80vh] overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e8dcc6]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#6b4e3d]" />
            <h2 className="text-xl font-semibold text-[#6b4e3d]">Корзина</h2>
            {items.length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                {items.length} товар{items.length > 1 ? 'а' : ''}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f8f3ed] rounded-full transition-colors"
          >
            <X size={20} className="text-[#8b7355]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag size={48} className="mx-auto text-[#8b7355] mb-4 opacity-50" />
              <p className="text-[#8b7355] mb-2">Корзина пуста</p>
              <p className="text-sm text-[#a69584]">Добавьте товары для оформления заказа</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-[#f8f3ed] rounded-xl">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-[#6b4e3d] text-sm">{item.name}</h3>
                    <p className="text-[#8b7355] text-sm">{item.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Minus size={14} className="text-[#8b7355]" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-[#6b4e3d]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Plus size={14} className="text-[#8b7355]" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors ml-2"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8dcc6] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-[#6b4e3d]">Итого:</span>
              <span className="text-xl font-bold text-[#6b4e3d]">
                {getTotalPrice().toLocaleString('ru-RU')} ₽
              </span>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-gradient-to-r from-[#3c2415] to-[#2d2d2d] text-white rounded-lg font-medium 
                         hover:from-[#4a2e1a] hover:to-[#3a3a3a] transition-all"
              >
                Оформить заказ
              </button>
              <button
                onClick={clearCart}
                className="w-full py-2 text-[#8b7355] hover:text-red-500 transition-colors text-sm"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        )}
      </div>

      <SimpleCheckout 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
    </div>
  );
}