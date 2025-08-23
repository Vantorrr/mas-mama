import { prisma } from "@/lib/prisma";
import { toWebp } from "@/lib/image";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      sku,
      priceCents,
      price, // можно прислать price в рублях
      shortDescription,
      categoryId,
      subcategoryId,
      inStock,
      images,
    } = body;

    // Создаем slug надёжно (транслитерация + очистка)
    const slug = slugify(name, Date.now().toString());

    // Нормализуем и валидируем поля
    const finalPriceCents: number = Number.isFinite(Number(priceCents))
      ? Math.round(Number(priceCents))
      : Math.round(Number(String(price || 0).replace(/,/, '.')) * 100);

    const categoryIdInt = categoryId ? parseInt(categoryId) : null;
    const subcategoryIdInt = subcategoryId ? parseInt(subcategoryId) : null;

    if (!name || !sku || !Number.isFinite(finalPriceCents)) {
      return NextResponse.json(
        { error: 'Некорректные данные товара' },
        { status: 400 }
      );
    }

    // Создаем товар
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`, // Добавляем timestamp для уникальности
        sku,
        priceCents: finalPriceCents,
        // Совместимо с любой схемой: пишем в стандартное поле
        description: shortDescription || null,
        categoryId: categoryIdInt,
        subcategoryId: subcategoryIdInt,
        inStock: Boolean(inStock),
      },
    });

    // Добавляем изображения
    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        const imageUrl: string = images[index];
        let optimized = imageUrl;
        if (imageUrl && imageUrl.startsWith('data:image')) {
          try {
            optimized = await toWebp(imageUrl, { width: 1600, height: 1600, quality: 85 });
          } catch {
            optimized = imageUrl; // fallback без оптимизации
          }
        }
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: optimized,
            isCover: index === 0,
            // Не используем нестандартные поля для совместимости
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
