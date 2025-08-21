import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import AnimatedButton from "@/components/AnimatedButton";
import AddToCartButton from "@/components/AddToCartButton";
import CategoryBlocks from "@/components/CategoryBlocks";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  // Получаем настройки обложек
  let homepageConfig;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/admin/homepage`);
    homepageConfig = await response.json();
  } catch (error) {
    homepageConfig = {
      heroImage: '/logo.jpg',
      blocks: {
        novinkiFoto: '/logo.jpg',
        kolyeFoto: '/logo.jpg',
        brasletyFoto: '/logo.jpg',
        medalonyFoto: '/logo.jpg'
      }
    };
  }
  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      <Header />

      {/* Большой логотип по центру */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Image 
            src="/logo.jpg" 
            width={200} 
            height={200} 
            alt="masterskaya_mama" 
            className="mx-auto rounded-full shadow-xl mb-6" 
          />
          <h1 className="text-4xl font-bold text-[#6b4e3d] mb-4">masterskaya_mama</h1>
          <p className="text-[#8b7355] text-lg">Авторские украшения ручной работы</p>
        </div>
      </section>

      {/* НОВИНКИ - горизонтальная прокрутка */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#6b4e3d] mb-4">Новинки</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3c2415] to-[#2d2d2d] rounded-full mx-auto"></div>
          </div>
          
          {/* Горизонтальная прокрутка товаров */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {/* ЗАГЛУШКИ пока база не работает */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 snap-start"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] flex items-center justify-center">
                      <span className="text-[#8b7355] font-bold">Браслет {index + 1}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#6b4e3d] mb-2">Браслет {index + 1}</h3>
                    <p className="text-lg font-bold text-[#6b4e3d] mb-3">3 500 ₽</p>
                    <div className="flex gap-2">
                      <button className="flex-1 text-center py-2 border border-[#3c2415] text-[#3c2415] rounded-lg text-sm hover:bg-[#3c2415] hover:text-white transition-all">
                        Подробнее
                      </button>
                      <button className="flex-1 py-2 bg-gradient-to-r from-[#3c2415] to-[#2d2d2d] text-white rounded-lg text-sm hover:from-[#4a2e1a] hover:to-[#3a3a3a] transition-all">
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 окна-заставки внизу */}
      <CategoryBlocks />

      {/* Преимущества с анимациями */}
      <section className="py-16 px-6 bg-white/50 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#6b4e3d] mb-4">Почему выбирают нас</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#3c2415] to-[#2d2d2d] rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#3c2415] to-[#2d2d2d] rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-[#3c2415] transition-colors">Ручная работа</h3>
              <p className="text-[#8b7355] leading-relaxed">Каждое украшение создается вручную с особым вниманием к деталям</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#3c2415] to-[#2d2d2d] rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
                <Star className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-[#3c2415] transition-colors">Premium качество</h3>
              <p className="text-[#8b7355] leading-relaxed">Используем только качественные материалы и проверенные техники</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#3c2415] to-[#2d2d2d] rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '1s'}}>
                <ShoppingBag className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-[#3c2415] transition-colors">Быстрая доставка</h3>
              <p className="text-[#8b7355] leading-relaxed">Доставляем по всей России в красивой подарочной упаковке</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
