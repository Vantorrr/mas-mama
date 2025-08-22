import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, priceCents, shortDescription, categoryId, subcategoryId, inStock, images } = body;

    // Создаем slug надёжно (транслитерация + очистка)
    const slug = slugify(name, Date.now().toString());

    // Создаем товар
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`, // Добавляем timestamp для уникальности
        sku,
        priceCents,
        shortDescription: shortDescription || null,
        categoryId: parseInt(categoryId),
        subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
        inStock,
      },
    });

    // Добавляем изображения
    if (images && images.length > 0) {
      await Promise.all(
        images.map((imageUrl: string, index: number) =>
          prisma.productImage.create({
            data: {
              productId: product.id,
              url: imageUrl,
              isCover: index === 0, // Первое изображение - обложка
              sortOrder: index,
            },
          })
        )
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
