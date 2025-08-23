import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Удаление категории
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Проверяем есть ли товары в этой категории
    const productsCount = await prisma.product.count({
      where: {
        OR: [
          { categoryId: parseInt(id) },
          { subcategoryId: parseInt(id) }
        ]
      }
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: `Нельзя удалить категорию с товарами (${productsCount} шт.)` },
        { status: 400 }
      );
    }

    // Проверяем есть ли подкатегории
    const subcategoriesCount = await prisma.category.count({
      where: { parentId: parseInt(id) }
    });

    if (subcategoriesCount > 0) {
      return NextResponse.json(
        { error: `Сначала удалите подкатегории (${subcategoriesCount} шт.)` },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

// Обновление категории
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, order, parentId, seoTitle, seoDescription, coverImageUrl } = body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        order: order || 0,
        parentId: parentId || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        coverImageUrl: coverImageUrl || null,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

