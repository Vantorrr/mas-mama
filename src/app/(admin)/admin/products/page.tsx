import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, Package } from "lucide-react";
import Image from "next/image";
import DeleteProductButton from "@/components/DeleteProductButton";
import SeedDataButton from "@/components/SeedDataButton";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { 
      images: true, 
      category: true, 
      subcategory: true 
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      {/* Хедер */}
      <header className="bg-white border-b border-[#e8dcc6] shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
                ← Назад
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#6b4e3d]">Управление товарами</h1>
                <p className="text-[#8b7355]">Всего товаров: {products.length}</p>
              </div>
            </div>
            <Link 
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all"
            >
              <Plus size={18} />
              Добавить товар
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-[#8b7355] mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-2">Товаров пока нет</h2>
            <p className="text-[#8b7355] mb-6">Добавьте первый товар или загрузите демо-данные</p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/admin/products/new"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all"
              >
                <Plus size={18} />
                Добавить товар
              </Link>
              <SeedDataButton />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f3ed]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Товар</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Категория</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Цена</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Статус</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8dcc6]">
                  {products.map((product) => {
                    const coverImage = product.images.find(img => img.isCover) || product.images[0];
                    return (
                      <tr key={product.id} className="hover:bg-[#f8f3ed]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
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
                              <h3 className="font-semibold text-[#6b4e3d]">{product.name}</h3>
                              <p className="text-sm text-[#8b7355]">Артикул: {product.sku}</p>
                              <p className="text-xs text-[#a69584]">{product.images.length} фото</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-[#6b4e3d]">{product.category.name}</p>
                            {product.subcategory && (
                              <p className="text-[#8b7355]">{product.subcategory.name}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#6b4e3d]">
                            {(product.priceCents / 100).toLocaleString('ru-RU')} ₽
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {product.inStock ? 'В наличии' : 'Нет в наличии'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              className="p-2 text-[#8b7355] hover:bg-[#f8f3ed] rounded-lg transition-colors"
                              title="Просмотр"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit size={16} />
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
          </div>
        )}
      </div>
    </main>
  );
}
