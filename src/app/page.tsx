import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import AnimatedButton from "@/components/AnimatedButton";
import AddToCartButton from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      <Header />

      {/* Hero секция с параллаксом */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0 gradient-animated opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-yellow-50/30"></div>
        
        {/* Плавающие элементы */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/30 rounded-full animate-float blur-sm"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-200/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-200/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 animate-fade-in-up">
            <Image 
              src="/logo.jpg" 
              width={120} 
              height={120} 
              alt="masterskaya_mama" 
              className="mx-auto rounded-full shadow-2xl ring-4 ring-white/50 animate-pulse-glow" 
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#6b4e3d] mb-6 leading-tight animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Новая коллекция
            <span className="block text-3xl md:text-4xl font-light text-[#8b7355] mt-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              &ldquo;Золотая осень&rdquo;
            </span>
          </h1>
          <p className="text-lg text-[#8b7355] mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            Эксклюзивные украшения ручной работы в тёплых бежевых тонах. 
            Каждое изделие создано с любовью и вниманием к деталям.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <AnimatedButton href="/catalog" variant="primary" icon={<Heart size={18} />}>
              Смотреть коллекцию
            </AnimatedButton>
            <AnimatedButton variant="secondary">
              О бренде
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Новинки - 4 карточки в ряд */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#6b4e3d] mb-4">Новинки</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mx-auto"></div>
            <p className="text-[#8b7355] max-w-2xl mx-auto mt-4">
              Свежие поступления нашей мастерской — уникальные украшения ручной работы
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => {
              const coverImage = product.images.find(img => img.isCover) || product.images[0];
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
                    {coverImage && (
                      <Image
                        src={coverImage.url}
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
                    </div>

                    {/* Быстрый просмотр */}
                    <button className="absolute inset-x-4 bottom-4 py-2 bg-white/95 text-[#6b4e3d] rounded-lg font-medium 
                                     opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 
                                     transition-all duration-300 hover:bg-white text-sm backdrop-blur-sm">
                      Быстрый просмотр
                    </button>
                    
                    {/* Статус "Новинка" */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Новинка
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-[#6b4e3d] mb-1 group-hover:text-amber-600 transition-colors duration-200 text-lg">
                        {product.name}
                      </h3>
                      <p className="text-sm text-[#8b7355]">Артикул: {product.sku}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-[#6b4e3d]">
                        {(product.priceCents / 100).toLocaleString("ru-RU")} ₽
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-[#8b7355] font-medium">5.0</span>
                      </div>
                    </div>

                    {/* Статус наличия */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                      <span className={`text-xs font-medium ${product.inStock ? 'text-green-600' : 'text-orange-600'}`}>
                        {product.inStock ? 'В наличии' : 'Под заказ'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={`/product/${product.slug}`}
                        className="flex-1 text-center py-2 border-2 border-amber-400 text-amber-600 rounded-lg font-medium 
                                 hover:bg-amber-400 hover:text-white transform hover:scale-105 transition-all duration-200"
                      >
                        Подробнее
                      </a>
                      <AddToCartButton 
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.priceCents / 100}
                        productImage={coverImage?.url || '/logo.jpg'}
                        className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-medium 
                                 hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Кнопка "Все товары" */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <a 
              href="/catalog" 
              className="inline-block px-8 py-3 border-2 border-[#8b7355] text-[#8b7355] rounded-xl font-medium 
                         hover:bg-[#8b7355] hover:text-white transform hover:scale-105 transition-all duration-200"
            >
              Все украшения
            </a>
          </div>
        </div>
      </section>

      {/* Преимущества с анимациями */}
      <section className="py-16 px-6 bg-white/50 relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-[#6b4e3d] mb-4">Почему выбирают нас</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-amber-600 transition-colors">Ручная работа</h3>
              <p className="text-[#8b7355] leading-relaxed">Каждое украшение создается вручную с особым вниманием к деталям</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
                <Star className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-amber-600 transition-colors">Premium качество</h3>
              <p className="text-[#8b7355] leading-relaxed">Используем только качественные материалы и проверенные техники</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 
                            transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow" style={{animationDelay: '1s'}}>
                <ShoppingBag className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-3 group-hover:text-amber-600 transition-colors">Быстрая доставка</h3>
              <p className="text-[#8b7355] leading-relaxed">Доставляем по всей России в красивой подарочной упаковке</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
