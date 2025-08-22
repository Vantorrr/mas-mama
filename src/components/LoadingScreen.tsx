'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Симуляция загрузки
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Скрываем загрузчик через небольшую задержку
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#fffbf7] flex flex-col items-center justify-center transition-opacity duration-500 ${
      progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {/* Логотип с анимацией */}
      <div className="relative mb-8">
        <div className="w-32 h-32 relative">
          <Image
            src="/logo.jpg"
            alt="masterskaya_mama"
            fill
            className="rounded-full shadow-2xl"
          />
          {/* Пульсирующее кольцо */}
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/50 animate-pulse"></div>
        </div>
      </div>

      {/* Название бренда */}
      <h1 className="text-3xl font-bold text-[#6b4e3d] mb-2 tracking-wide">
        masterskaya_mama
      </h1>
      <p className="text-[#8b7355] mb-8 text-center">
        Авторские украшения ручной работы
      </p>

      {/* Прогресс бар */}
      <div className="w-64 h-1 bg-[#f8f3ed] rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Процент загрузки */}
      <div className="text-sm text-[#8b7355] font-medium">
        {Math.round(progress)}%
      </div>

      {/* Анимированные точки */}
      <div className="flex gap-2 mt-6">
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-amber-200/20 rounded-full animate-float blur-sm"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-200/20 rounded-full animate-float blur-sm" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-orange-200/20 rounded-full animate-float blur-sm" style={{animationDelay: '2s'}}></div>
    </div>
  );
}
