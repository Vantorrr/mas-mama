'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, User, Phone, CheckCircle } from 'lucide-react';
import { useCartStore } from './CartStore';

interface SimpleCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleCheckout({ isOpen, onClose }: SimpleCheckoutProps) {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone'|'whatsapp'|'telegram'|'email'>('phone');
  const [contactValue, setContactValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [successNumber, setSuccessNumber] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!accepted) {
      alert('Пожалуйста, подтвердите согласие на обработку персональных данных');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      customer: { name, phone: contactMethod === 'phone' ? contactValue : '' },
      preferredContact: {
        method: contactMethod,
        value: contactValue,
      },
      items: items,
      totalPrice: getTotalPrice(),
      orderNumber: `MM-${Date.now().toString().slice(-6)}`
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setSuccessNumber(orderData.orderNumber);
        clearCart();
        setName('');
        setContactValue('');
        setAccepted(false);
        // Авто-закрытие через 3 секунды
        setTimeout(() => {
          setSuccessNumber(null);
          onClose();
        }, 3000);
      } else {
        alert('Ошибка при оформлении заказа');
      }
    } catch (error) {
      alert('Ошибка сети');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border-4 border-amber-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Успешное оформление */}
        {successNumber ? (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-pulse-glow">
              <CheckCircle size={36} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2f855a] mb-1">Заказ оформлен!</h3>
            <p className="text-sm text-[#6b4e3d] mb-2">Номер заказа: <span className="font-semibold">{successNumber}</span></p>
            <p className="text-[#8b7355]">Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
        <>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-[#6b4e3d]">Оформить заказ</h2>
          <p className="text-[#8b7355]">Итого: {getTotalPrice().toLocaleString('ru-RU')} ₽</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#6b4e3d] mb-2">Ваше имя</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#e8dcc6] rounded-lg focus:border-amber-400 focus:outline-none"
                placeholder="Анна Иванова"
              />
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-[#6b4e3d] mb-2">Удобный способ связи</legend>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { key: 'phone', label: 'Телефон' },
                { key: 'whatsapp', label: 'WhatsApp' },
                { key: 'telegram', label: 'Telegram' },
                { key: 'email', label: 'Email' },
              ].map(opt => (
                <label key={opt.key} className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 cursor-pointer ${contactMethod===opt.key ? 'border-amber-400' : 'border-[#e8dcc6]'}`}>
                  <input
                    type="radio"
                    name="contactMethod"
                    className="accent-amber-500"
                    checked={contactMethod === (opt.key as any)}
                    onChange={() => setContactMethod(opt.key as any)}
                  />
                  <span className="text-sm text-[#6b4e3d]">{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
              <input
                type={contactMethod === 'email' ? 'email' : 'text'}
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#e8dcc6] rounded-lg focus:border-amber-400 focus:outline-none"
                placeholder={
                  contactMethod === 'email'
                    ? 'example@mail.com'
                    : contactMethod === 'telegram'
                    ? '@username'
                    : contactMethod === 'whatsapp'
                    ? '+7 999 123-45-67 (WhatsApp)'
                    : '+7 999 123-45-67'
                }
              />
            </div>
          </fieldset>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 accent-amber-500" checked={accepted} onChange={(e)=>setAccepted(e.target.checked)} />
            <span className="text-[#8b7355]">
              Я согласен(на) на обработку персональных данных и с политикой конфиденциальности
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-bold text-lg
                     hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Отправляем...' : `Заказать за ${getTotalPrice().toLocaleString('ru-RU')} ₽`}
          </button>
        </form>
        </>
        )}
      </div>
    </div>,
    document.body
  );
}
