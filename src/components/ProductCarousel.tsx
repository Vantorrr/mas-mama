'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  priceCents: number;
  images: Array<{ url: string; isCover: boolean }>;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
  autoPlay?: boolean;
}

export default function ProductCarousel({ products, title, autoPlay = true }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({});

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Автопрокрутка
  useEffect(() => {
    if (!autoPlay || isHovered || products.length <= itemsPerView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoPlay, isHovered, maxIndex, products.length, itemsPerView]);

  // Автосмена фото товаров
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes(prev => {
        const newIndexes = { ...prev };
        products.forEach(product => {
          if (product.images.length > 1) {
            const currentImg = prev[product.id] || 0;
            newIndexes[product.id] = (currentImg + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [products]);

  const next = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-16 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#6b4e3d] mb-2">{title}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </div>
          
          {products.length > itemsPerView && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              >
                <ChevronLeft size={20} className="text-[#6b4e3d]" />
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
              >
                <ChevronRight size={20} className="text-[#6b4e3d]" />
              </button>
            </div>
          )}
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product, index) => {
              const currentImageIndex = imageIndexes[product.id] || 0;
              const currentImage = product.images[currentImageIndex] || product.images.find(img => img.isCover) || product.images[0];
              
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {currentImage && (
                      <Image
                        src={currentImage.url}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Градиентный оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Кнопки действий */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-110">
                        <Heart size={16} className="text-[#8b7355]" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-white hover:scale-110">
                        <ShoppingBag size={16} className="text-[#8b7355]" />
                      </button>
                    </div>

                    {/* Индикаторы фото */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 flex gap-1">
                        {product.images.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              imgIndex === currentImageIndex 
                                ? 'bg-white scale-125' 
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-[#6b4e3d] mb-2 group-hover:text-amber-600 transition-colors duration-200">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#6b4e3d]">
                        {(product.priceCents / 100).toLocaleString("ru-RU")} ₽
                      </span>
                      <a
                        href={`/product/${product.slug}`}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300"
                      >
                        Подробнее →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Прогресс бар */}
          {autoPlay && products.length > itemsPerView && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-8 h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-amber-500 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

