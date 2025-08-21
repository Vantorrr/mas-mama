import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Search, Filter, Grid, List, Heart, Star } from "lucide-react";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CatalogPage() {
  // Заглушки для сборки
  const products: any[] = [];

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      <Header />
      {/* Хедер каталога */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-[#e8dcc6] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#6b4e3d] mb-2">Каталог украшений</h1>
              <p className="text-[#8b7355]">Найдено {products.length} уникальных изделий</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Поиск */}
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
                <input 
                  placeholder="Поиск по каталогу..." 
                  className="w-64 pl-10 pr-4 py-2.5 bg-[#f8f3ed] border border-[#e8dcc6] rounded-full text-sm 
                           placeholder:text-[#a69584] focus:outline-none focus:ring-2 focus:ring-amber-400/50 
                           focus:border-amber-400 transition-all"
                />
              </div>
              
              {/* Фильтры и вид */}
              <div className="flex items-center gap-2">
                <button className="p-2.5 bg-[#f8f3ed] hover:bg-[#f0e6d2] rounded-lg transition-colors">
                  <Filter size={18} className="text-[#6b4e3d]" />
                </button>
                <button className="p-2.5 bg-amber-400 text-white rounded-lg">
                  <Grid size={18} />
                </button>
                <button className="p-2.5 bg-[#f8f3ed] hover:bg-[#f0e6d2] rounded-lg transition-colors">
                  <List size={18} className="text-[#6b4e3d]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Каталог товаров */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => {
              const cover = p.images.find((i) => i.isCover) ?? p.images[0];
              return (
                <a 
                  key={p.id} 
                  href={`/product/${p.slug}`} 
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl card-hover overflow-hidden"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] overflow-hidden">
                    {cover && (
                      <Image 
                        src={cover.url} 
                        alt={p.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Кнопки действий */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <button className="p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-white">
                        <Heart size={16} className="text-[#8b7355]" />
                      </button>
                    </div>
                    
                    {/* Быстрый просмотр */}
                    <button className="absolute inset-x-4 bottom-4 py-2 bg-white/95 text-[#6b4e3d] rounded-lg font-medium 
                                     opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 
                                     transition-all hover:bg-white text-sm">
                      Быстрый просмотр
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-[#6b4e3d] mb-1 line-clamp-1">{p.name}</h3>
                    <p className="text-sm text-[#8b7355] mb-3">Артикул: {p.sku}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#6b4e3d]">
                        {(p.priceCents / 100).toLocaleString("ru-RU")} ₽
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-[#8b7355]">5.0</span>
                      </div>
                    </div>
                    
                    {/* Статус наличия */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className={`text-xs ${p.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {p.inStock ? 'В наличии' : 'Под заказ'}
                      </span>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-2">
                      <a
                        href={`/product/${p.slug}`}
                        className="flex-1 text-center py-2 border border-amber-400 text-amber-600 rounded-lg font-medium text-sm
                                 hover:bg-amber-400 hover:text-white transform hover:scale-105 transition-all duration-200"
                      >
                        Подробнее
                      </a>
                      <AddToCartButton 
                        productId={p.id}
                        productName={p.name}
                        productPrice={p.priceCents / 100}
                        productImage={cover?.url || '/logo.jpg'}
                        className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-medium text-sm
                                 hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                      />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          
          {/* Загрузить ещё */}
          {products.length >= 24 && (
            <div className="text-center mt-12">
              <button className="btn-primary">
                Загрузить ещё
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


