import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null, // Только основные категории
      },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}