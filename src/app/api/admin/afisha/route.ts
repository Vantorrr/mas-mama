import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toWebp } from "@/lib/image";

// Получить настройки афиши
export async function GET() {
  try {
    const config = await prisma.homepageConfig.findUnique({ 
      where: { id: 2 } // ID 2 для афиши
    });
    
    const data = (config?.data as any) || {
      image: '/logo.jpg',
      title: 'Мастер-классы и события',
      content: 'Скоро здесь появится информация о наших мероприятиях!'
    };
    
    return NextResponse.json(data, { 
      headers: { 'Cache-Control': 'no-store, must-revalidate' } 
    });
  } catch (error) {
    console.error('Error getting afisha config:', error);
    return NextResponse.json(
      { error: 'Failed to get afisha config' }, 
      { status: 500 }
    );
  }
}

// Обновить настройки афиши
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Оптимизация изображения если это base64
    let imageUrl = body.image || '/logo.jpg';
    if (imageUrl.startsWith('data:image')) {
      try {
        imageUrl = await toWebp(imageUrl, { 
          width: 1920, 
          height: 1080, 
          quality: 85 
        });
      } catch (error) {
        console.error('Image optimization failed, using original:', error);
        // Используем оригинал если оптимизация не удалась
      }
    }
    
    const data = {
      image: imageUrl,
      title: body.title || 'Мастер-классы и события',
      content: body.content || ''
    };
    
    // Сохраняем в БД
    await prisma.homepageConfig.upsert({
      where: { id: 2 },
      update: { data },
      create: { id: 2, data }
    });
    
    return NextResponse.json(
      { success: true }, 
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error saving afisha config:', error);
    return NextResponse.json(
      { error: 'Failed to save afisha config' }, 
      { status: 500 }
    );
  }
}
