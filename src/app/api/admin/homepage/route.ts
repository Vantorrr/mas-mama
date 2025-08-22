import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Получить настройки главной страницы
export async function GET() {
  try {
    try {
      // Читаем из БД
      const row = await prisma.homepageConfig.findUnique({ where: { id: 1 } });
      const raw = (row?.data as any) || {};
      // Нормализуем схему к новой структуре с фокусом (x/y) и обратной совместимостью
      const normalizeSlide = (input: any) => {
        if (!input) return { url: '/logo.jpg', x: 50, y: 50 };
        if (typeof input === 'string') return { url: input, x: 50, y: 50 };
        return { url: input.url || '/logo.jpg', x: Number(input.x ?? 50), y: Number(input.y ?? 50) };
      };
      const normalizeBlock = (val: any) => {
        // Поддержка форматов:
        // - массив слайдов
        // - объект { slides: [...] }
        // - строка URL
        // - объект слайд { url, x, y }
        if (!val) return { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] };
        if (Array.isArray(val)) return { slides: val.map(normalizeSlide) };
        if (Array.isArray(val.slides)) return { slides: val.slides.map(normalizeSlide) };
        return { slides: [normalizeSlide(val)] };
      };

      // Поддержка старых ключей novinkiFoto/kolyeFoto/... если они были строками
      const blocks = raw.blocks || {};
      const normalized = {
        hero: {
          slides: (raw.hero?.slides ? raw.hero.slides : [raw.heroImage]).map(normalizeSlide),
        },
        blocks: {
          novinki: normalizeBlock(blocks.novinki || blocks.novinkiFoto),
          kolye: normalizeBlock(blocks.kolye || blocks.kolyeFoto),
          braslety: normalizeBlock(blocks.braslety || blocks.brasletyFoto),
          medalony: normalizeBlock(blocks.medalony || blocks.medalonyFoto),
        },
      };
      return NextResponse.json(normalized, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
    } catch (error) {
      // Если файла нет, возвращаем дефолтные настройки
      const defaultConfig = {
        hero: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
        blocks: {
          novinki: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
          kolye: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
          braslety: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
          medalony: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
        },
      };
      return NextResponse.json(defaultConfig, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get homepage config' }, { status: 500 });
  }
}

// Обновить настройки главной страницы
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // upsert в БД
    await prisma.homepageConfig.upsert({
      where: { id: 1 },
      update: { data: body },
      create: { id: 1, data: body },
    });
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error saving homepage config:', error);
    return NextResponse.json({ error: 'Failed to save homepage config' }, { status: 500 });
  }
}
