'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import AnimatedButton from './AnimatedButton';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  priceCents: number;
  shortDescription?: string;
  inStock: boolean;
  images: Array<{ url: string; isCover: boolean }>;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && product) {
      setIsLoading(true);
      setCurrentImageIndex(0);
      // Имитация загрузки
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

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

  if (!isOpen || !product) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors hover:scale-110 transform duration-200"
        >
          <X size={20} className="text-[#6b4e3d]" />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-amber-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Галерея изображений */}
            <div className="relative bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] p-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={product.images[currentImageIndex]?.url || '/logo.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                
                {/* Навигация по изображениям */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200"
                    >
                      <ChevronLeft size={20} className="text-[#6b4e3d]" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200"
                    >
                      <ChevronRight size={20} className="text-[#6b4e3d]" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Миниатюры */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-amber-500 scale-110' 
                          : 'border-white/50 hover:border-amber-300'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Информация о товаре */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-[#6b4e3d] mb-2">{product.name}</h2>
                  <p className="text-sm text-[#8b7355]">Артикул: {product.sku}</p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-sm text-[#8b7355] ml-2">5.0 (12 отзывов)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-[#6b4e3d]">
                      {(product.priceCents / 100).toLocaleString("ru-RU")} ₽
                    </span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                      {product.inStock ? 'В наличии' : 'Под заказ'}
                    </div>
                  </div>
                  
                  <p className="text-[#8b7355] leading-relaxed">
                    {product.shortDescription || "Эксклюзивное украшение ручной работы из премиальных материалов."}
                  </p>
                </div>
              </div>

              {/* Действия */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <AnimatedButton
                    variant="primary"
                    icon={<ShoppingBag size={18} />}
                    className="flex-1"
                  >
                    Добавить в корзину
                  </AnimatedButton>
                  <AnimatedButton
                    variant="ghost"
                    icon={<Heart size={18} />}
                    className="p-3"
                  >
                    ♡
                  </AnimatedButton>
                </div>
                
                <AnimatedButton
                  variant="secondary"
                  href={`/product/${product.slug}`}
                  className="w-full"
                >
                  Подробнее о товаре
                </AnimatedButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
