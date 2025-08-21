'use client';

import { useState } from 'react';
import { Package, Loader2 } from 'lucide-react';

export default function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        if (result.message && result.message.includes('уже добавлены')) {
          alert('Демо-товары уже добавлены ранее! ✅');
        } else {
          alert(`Демо-товары успешно добавлены! 🎉\nСоздано: ${result.products} товаров`);
          window.location.reload();
        }
      } else {
        alert(`Ошибка: ${result.error || 'Не удалось добавить демо-товары'}`);
      }
    } catch {
      alert('Ошибка при добавлении демо-товаров');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={isLoading}
      className="flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all w-full disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Package size={18} />
      )}
      {isLoading ? 'Добавление...' : 'Добавить демо-товары'}
    </button>
  );
}
