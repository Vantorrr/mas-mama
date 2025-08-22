import { prisma } from "@/lib/prisma";
import { toWebp } from "@/lib/image";
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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
