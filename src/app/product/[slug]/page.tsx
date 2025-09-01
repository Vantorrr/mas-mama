import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, Share2, Star, Shield, Truck, RotateCcw } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

// Отключаем статическую генерацию для Railway
// export async function generateStaticParams() {
//   return [];
// }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await (async () => {
    try {
      if (!prisma || !(prisma as any).product) return null as any;
      return await prisma.product.findFirst({
        where: { OR: [{ slug }, { sku: slug }] },
        include: { images: { orderBy: { sortOrder: "asc" } }, category: true, subcategory: true },
      });
    } catch {
      return null as any;
    }
  })();
  if (!product) return notFound();

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      {/* Навигация */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-[#e8dcc6]">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/catalog" className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Назад к каталогу</span>
            </a>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full bg-[#f8f3ed] hover:bg-[#f0e6d2] transition-colors">
                <Heart size={18} className="text-[#8b7355]" />
              </button>
              <button className="p-2 rounded-full bg-[#f8f3ed] hover:bg-[#f0e6d2] transition-colors">
                <Share2 size={18} className="text-[#8b7355]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Галерея изображений */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] shadow-lg">
                {product.images[0] && (
                  <Image 
                    src={product.images[0].url} 
                    alt={product.name} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-500" 
                  />
                )}
                
                {/* Значки качества */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#6b4e3d]">
                    Ручная работа
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#6b4e3d]">
                    Эксклюзив
                  </div>
                </div>
              </div>
              
              {/* Миниатюры */}
              <div className="grid grid-cols-5 gap-3">
                {product.images.slice(0, 5).map((img, index) => (
                  <button 
                    key={img.id} 
                    className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] 
                             hover:ring-2 hover:ring-amber-400 transition-all"
                  >
                    <Image src={img.url} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-[#8b7355]">{product.category.name}</span>
                  {product.subcategory && (
                    <>
                      <span className="text-[#8b7355]">•</span>
                      <span className="text-sm text-[#8b7355]">{product.subcategory.name}</span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-[#6b4e3d] mb-3">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-sm text-[#8b7355] ml-2">5.0 (24 отзыва)</span>
                  </div>
                </div>
                <p className="text-sm text-[#8b7355] mb-4">Артикул: {product.sku}</p>
              </div>

              {/* Цена */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
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
                
                <p className="text-[#8b7355] mb-6 leading-relaxed">
                  {product.shortDescription || "Эксклюзивное украшение ручной работы из премиальных материалов. Каждое изделие уникально и создано с особым вниманием к деталям."}
                </p>

                {/* Кнопки действий */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <AddToCartButton 
                      productId={product.id}
                      productName={product.name}
                      productPrice={product.priceCents / 100}
                      productImage={product.images[0]?.url || '/logo.jpg'}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    />
                    <button className="px-4 py-3 border-2 border-[#8b7355] text-[#8b7355] rounded-lg font-medium 
                                     hover:bg-[#8b7355] hover:text-white transition-all duration-200">
                      ♡
                    </button>
                  </div>
                  <button className="w-full px-6 py-3 bg-amber-100 text-[#6b4e3d] rounded-lg font-medium 
                                   hover:bg-amber-200 transition-all duration-200">
                    Заказать сейчас
                  </button>
                  <button className="w-full px-6 py-3 border border-[#e8dcc6] text-[#8b7355] rounded-lg font-medium 
                                   hover:bg-[#f8f3ed] transition-all duration-200">
                    Задать вопрос
                  </button>
                </div>
              </div>

              {/* Преимущества */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-[#6b4e3d] mb-4">Гарантии качества</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="text-amber-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#8b7355] leading-relaxed">
                        Вся продукция мастерской проходит контроль качества. На изделия приобретенные в мастерской действует гарантия на производственный брак месяц со дня покупки.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="text-amber-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-[#8b7355] leading-relaxed">
                        Доставка осуществляется транспортными компаниями: Яндекс. Маркет, Сдек, Почта России согласно тарифам выбранной компании.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Похожие товары */}
      <section className="py-16 px-6 bg-white/50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-[#6b4e3d] mb-8 text-center">Похожие украшения</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl card-hover overflow-hidden">
                <div className="relative aspect-square bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#6b4e3d] mb-1">Браслет #{i + 1}</h3>
                  <p className="text-sm text-[#8b7355] mb-3">Авторская работа</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#6b4e3d]">3 200 ₽</span>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-[#8b7355]">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


