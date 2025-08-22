import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = typeof params?.category === 'string' ? params.category : undefined;
  const sub = typeof params?.sub === 'string' ? params.sub : undefined;
  const q = typeof params?.q === 'string' ? params.q : undefined;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        category ? { category: { slug: category } } : {},
        sub ? { subcategory: { slug: sub } } : {},
        q ? { OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } }
        ] } : {},
      ],
    },
    include: { images: true, category: true, subcategory: true },
    orderBy: { createdAt: 'desc' },
  });

  const heading = category ? (products[0]?.category?.name || 'Каталог украшений') : 'Каталог украшений';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#6b4e3d] mb-4">{heading}</h1>
          <p className="text-[#8b7355] text-lg">{products.length} {products.length === 1 ? 'товар' : 'товаров'}</p>
        </div>

        {/* Поиск (GET-параметры) */}
        <form className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7355]" size={20} />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Поиск по названию или артикулу..."
              className="w-full pl-10 pr-4 py-3 border border-[#e8dcc6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6b4e3d]/50 focus:border-[#6b4e3d]"
            />
          </div>
        </form>

        {/* Список товаров */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-[#6b4e3д] mb-2">Товары не найдены</h2>
            <p className="text-[#8b7355] mb-4">Попробуйте изменить параметры поиска</p>
            <Link href="/catalog" className="px-6 py-3 bg-[#6b4e3d] hover:bg-[#3c2415] text-white rounded-xl font-semibold transition-colors">Сбросить фильтры</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 см:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => {
              const cover = p.images.find(i => i.isCover) ?? p.images[0];
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative aspect-square bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
                    {cover && (
                      <Image src={cover.url} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    {!p.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Нет в наличии</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1">
                    <Link href={`/product/${encodeURIComponent(p.slug || p.sku)}`}>
                      <h3 className="font-semibold text-[#6b4e3d] mb-2 hover:text-[#3c2415] transition-colors line-clamp-2">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-[#8b7355] mb-2">Артикул: {p.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#6б4e3d]">{(p.priceCents / 100).toLocaleString('ru-RU')} ₽</span>
                      <div className="flex gap-2">
                        <Link href={`/product/${encodeURIComponent(p.slug || p.sku)}`} className="px-3 py-2 text-sm border border-[#6b4e3d] text-[#6b4e3d] hover:bg-[#6b4e3d] hover:text-white rounded-lg transition-colors">Подробнее</Link>
                        <AddToCartButton
                          productId={p.id}
                          productName={p.name}
                          productPrice={p.priceCents / 100}
                          productImage={cover?.url || '/logo.jpg'}
                          className="px-3 py-2 text-sm bg-[#6b4e3d] hover:bg-[#3c2415] text-white rounded-lg transition-colors flex items-center gap-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
