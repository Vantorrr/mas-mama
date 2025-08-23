import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Проверяем есть ли уже товары
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({ message: "Демо-товары уже добавлены", count: existingProducts });
    }

    // Создаём категории если их нет
    let bracelets = await prisma.category.findFirst({ where: { slug: "braslety" } });
    if (!bracelets) {
      bracelets = await prisma.category.create({
        data: { name: "Браслеты", slug: "braslety", order: 1 },
      });
    }

    let necklaces = await prisma.category.findFirst({ where: { slug: "ozherelya" } });
    if (!necklaces) {
      necklaces = await prisma.category.create({
        data: { name: "Ожерелье", slug: "ozherelya", order: 2 },
      });
    }

    let pendants = await prisma.category.findFirst({ where: { slug: "kulony" } });
    if (!pendants) {
      pendants = await prisma.category.create({
        data: { name: "Кулоны", slug: "kulony", order: 3 },
      });
    }

    // Создаём подкатегории
    let silver = await prisma.category.findFirst({ where: { slug: "serebro" } });
    if (!silver) {
      silver = await prisma.category.create({
        data: { name: "Серебро", slug: "serebro", parentId: bracelets.id },
      });
    }

    // Создаём демо-товары
    const createdProducts = [];
    for (let i = 1; i <= 12; i += 1) {
      const product = await prisma.product.create({
        data: {
          name: `Браслет ${i}`,
          slug: `braslet-${i}-${Date.now()}`,
          sku: `BR-${1000 + i}`,
          priceCents: 350000,
          shortDescription: "Аккуратный браслет в бежевой гамме",
          categoryId: bracelets.id,
          subcategoryId: silver.id,
          images: {
            create: [
              { url: "/logo.jpg", isCover: true, sortOrder: 0 },
              { url: "/logo.jpg", sortOrder: 1 },
              { url: "/logo.jpg", sortOrder: 2 },
            ],
          },
        },
      });
      createdProducts.push(product);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Создано ${createdProducts.length} товаров`,
      products: createdProducts.length 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      error: 'Ошибка при создании демо-товаров',
      details: error 
    }, { status: 500 });
  }
}

// Удобный запуск из браузера
export async function GET() {
  return POST();
}