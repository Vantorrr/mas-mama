import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Удаление товара
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method');

    if (method === 'DELETE') {
      // Сначала удаляем связанные изображения
      await prisma.productImage.deleteMany({
        where: { productId: parseInt(id) }
      });

      // Затем удаляем товар
      await prisma.product.delete({
        where: { id: parseInt(id) }
      });

      return NextResponse.redirect(new URL('/admin/products', request.url));
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// Обновление товара
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, sku, priceCents, shortDescription, categoryId, subcategoryId, inStock, images } = body;

    // Создаем slug из названия
    const slug = name
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/[а-я]/g, (match: string) => {
        const cyrillicToLatin: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
          'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
          'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
          'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return cyrillicToLatin[match] || match;
      });

    // Обновляем товар
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug: `${slug}-${id}`, // Используем ID для уникальности
        sku,
        priceCents,
        shortDescription: shortDescription || null,
        categoryId: parseInt(categoryId),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
        inStock,
      },
    });

    // Обновляем изображения если переданы
    if (images && images.length > 0) {
      // Удаляем старые изображения
      await prisma.productImage.deleteMany({
        where: { productId: product.id }
      });

      // Добавляем новые
      await Promise.all(
        images.map((imageUrl: string, index: number) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              url: imageUrl,
              isCover: index === 0,
              sortOrder: index,
            },
          })
        )
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
