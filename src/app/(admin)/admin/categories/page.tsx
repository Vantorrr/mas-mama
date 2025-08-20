import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, BarChart3, ArrowLeft } from "lucide-react";
import DeleteCategoryButton from "@/components/DeleteCategoryButton";
import React from "react";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { 
      children: true,
      _count: { select: { products: true, subcategoryProducts: true } }
    },
    orderBy: { order: "asc" }
  });

  const mainCategories = categories.filter(cat => !cat.parentId);

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      {/* Хедер */}
      <header className="bg-white border-b border-[#e8dcc6] shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Назад</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#6b4e3d]">Управление категориями</h1>
                <p className="text-[#8b7355]">Всего категорий: {categories.length}</p>
              </div>
            </div>
            <Link 
              href="/admin/categories/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all"
            >
              <Plus size={18} />
              Добавить категорию
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f3ed]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Название</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Slug</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Порядок</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Товаров</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6b4e3d]">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8dcc6]">
                {mainCategories.map((category) => (
                  <React.Fragment key={category.id}>
                    {/* Основная категория */}
                    <tr className="hover:bg-[#f8f3ed]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={16} className="text-[#8b7355]" />
                          <span className="font-semibold text-[#6b4e3d]">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-[#8b7355] bg-[#f8f3ed] px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#6b4e3d]">{category.order}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#6b4e3d]">
                          {category._count.products + category._count.subcategoryProducts}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/catalog?category=${category.slug}`}
                            className="p-2 text-[#8b7355] hover:bg-[#f8f3ed] rounded-lg transition-colors"
                            title="Просмотр"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit size={16} />
                          </Link>
                          <DeleteCategoryButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        </div>
                      </td>
                    </tr>
                    
                    {/* Подкатегории */}
                    {category.children.map((subcategory) => (
                      <tr key={`sub-${subcategory.id}`} className="hover:bg-[#f8f3ed]/30 transition-colors bg-gray-50/50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3 ml-6">
                            <div className="w-4 h-px bg-[#e8dcc6]"></div>
                            <span className="text-sm text-[#8b7355]">{subcategory.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <code className="text-xs text-[#a69584] bg-gray-100 px-2 py-1 rounded">
                            {subcategory.slug}
                          </code>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs text-[#8b7355]">{subcategory.order}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs text-[#8b7355]">
                            {categories.find(c => c.id === subcategory.id)?._count?.subcategoryProducts || 0}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/categories/${subcategory.id}/edit`}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Редактировать"
                            >
                              <Edit size={12} />
                            </Link>
                            <DeleteCategoryButton
                              categoryId={subcategory.id}
                              categoryName={subcategory.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
