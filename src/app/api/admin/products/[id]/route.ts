import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { toWebp } from "@/lib/image";
import { slugify } from "@/lib/slugify";

// Удаление товара (метод override через POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method');

    if (method === 'DELETE') {
      await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
      await prisma.product.delete({ where: { id: parseInt(id) } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

// Удаление товара (нативный HTTP DELETE)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.productImage.deleteMany({ where: { productId: parseInt(id) } });
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
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
    const slug = slugify(name, id);

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
      for (let index = 0; index < images.length; index++) {
        const imageUrl: string = images[index];
        const optimized = imageUrl.startsWith('data:image')
          ? await toWebp(imageUrl, { width: 1600, height: 1600, quality: 85 })
          : imageUrl;
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: optimized,
            isCover: index === 0,
            sortOrder: index,
          },
        });
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
