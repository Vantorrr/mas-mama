import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, Settings, BarChart3, Edit, Eye } from "lucide-react";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";
import SeedDataButton from "@/components/SeedDataButton";
import AdminLogout from "@/components/AdminLogout";

export const revalidate = 0;

export default async function AdminHome() {
  const products = await prisma.product.findMany({ 
    orderBy: { createdAt: "desc" }, 
    take: 10,
    include: { images: true }
  });
  
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  const totalProducts = await prisma.product.count();

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      {/* Хедер админки */}
      <header className="bg-white border-b border-[#e8dcc6] shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#6b4e3d]">Админ-панель</h1>
              <p className="text-[#8b7355]">masterskaya_mama</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
                ← Вернуться на сайт
              </Link>
              <AdminLogout />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Package className="text-amber-500" size={24} />
              <div>
                <p className="text-2xl font-bold text-[#6b4e3d]">{totalProducts}</p>
                <p className="text-sm text-[#8b7355]">Всего товаров</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-amber-500" size={24} />
              <div>
                <p className="text-2xl font-bold text-[#6b4e3d]">{categories.length}</p>
                <p className="text-sm text-[#8b7355]">Категорий</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Settings className="text-amber-500" size={24} />
              <div>
                <p className="text-2xl font-bold text-[#6b4e3d]">Активно</p>
                <p className="text-sm text-[#8b7355]">Статус сайта</p>
              </div>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-4">Управление товарами</h2>
            <div className="space-y-3">
              <Link 
                href="/admin/products/new" 
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all"
              >
                <Plus size={18} />
                Добавить товар
              </Link>
              <Link 
                href="/admin/products" 
                className="flex items-center gap-3 p-3 border-2 border-[#8b7355] text-[#8b7355] rounded-lg hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <Package size={18} />
                Все товары ({totalProducts})
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              <SeedDataButton />
              <Link 
                href="/admin/categories" 
                className="flex items-center gap-3 p-3 border-2 border-[#8b7355] text-[#8b7355] rounded-lg hover:bg-[#8b7355] hover:text-white transition-all"
              >
                <BarChart3 size={18} />
                Управление категориями
              </Link>
            </div>
          </div>
        </div>

        {/* Последние товары */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-[#e8dcc6]">
            <h2 className="text-xl font-semibold text-[#6b4e3d]">Последние товары</h2>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-[#8b7355] mb-4" />
              <p className="text-[#8b7355]">Товаров пока нет</p>
              <p className="text-sm text-[#a69584]">Добавьте первый товар или загрузите демо-данные</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f3ed]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6b4e3d]">Товар</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6b4e3d]">Категория</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6b4e3d]">Цена</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6b4e3d]">Статус</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6b4e3d]">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8dcc6]">
                  {products.map((product) => {
                    const coverImage = product.images.find(img => img.isCover) || product.images[0];
                    return (
                      <tr key={product.id} className="hover:bg-[#f8f3ed]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
                              {coverImage && (
                                <Image
                                  src={coverImage.url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-[#6b4e3d] text-sm">{product.name}</h3>
                              <p className="text-xs text-[#8b7355]">Артикул: {product.sku}</p>
                              <p className="text-xs text-[#a69584]">{product.images.length} фото</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-[#6b4e3d]">{product.category?.name || 'Без категории'}</p>
                            {product.subcategory && (
                              <p className="text-[#8b7355] text-xs">{product.subcategory.name}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-[#6b4e3d] text-sm">
                            {(product.priceCents / 100).toLocaleString('ru-RU')} ₽
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {product.inStock ? 'В наличии' : 'Нет в наличии'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/product/${product.slug}`}
                              className="p-1.5 text-[#8b7355] hover:bg-[#f8f3ed] rounded transition-colors"
                              title="Просмотр"
                            >
                              <Eye size={14} />
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Редактировать"
                            >
                              <Edit size={14} />
                            </Link>
                            <DeleteProductButton
                              productId={product.id}
                              productName={product.name}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


