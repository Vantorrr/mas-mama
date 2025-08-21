import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, order, parentId, seoTitle, seoDescription, coverImageUrl } = body;

    const category = await prisma.category.create({
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
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
