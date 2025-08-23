import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toWebp } from "@/lib/image";

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
    // Если пришли base64-картинки — конвертируем в WebP и ограничим размер
    const optimizeSlides = async (slides: any[] = []) => {
      const out: any[] = [];
      for (const s of slides) {
        const isBase64 = typeof s?.url === 'string' && s.url.startsWith('data:image');
        let finalUrl = s?.url || '/logo.jpg';
        if (isBase64) {
          try {
            // Пытаемся оптимизировать, но если среда/библиотека не позволяет — не падаем
            finalUrl = await toWebp(s.url, { width: 1920, height: 1080, quality: 80 });
          } catch {
            finalUrl = s.url; // fallback без конвертации
          }
        }
        out.push({
          url: finalUrl,
          x: Number(s?.x ?? 50),
          y: Number(s?.y ?? 50),
        });
      }
      return out;
    };

    const normalized = { ...body };
    if (normalized.hero?.slides) normalized.hero.slides = await optimizeSlides(normalized.hero.slides);
    if (normalized.blocks) {
      for (const key of Object.keys(normalized.blocks)) {
        const block = normalized.blocks[key];
        if (block?.slides) normalized.blocks[key].slides = await optimizeSlides(block.slides);
      }
    }
    // upsert в БД
    await prisma.homepageConfig.upsert({
      where: { id: 1 },
      update: { data: normalized },
      create: { id: 1, data: normalized },
    });
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Error saving homepage config:', error);
    return NextResponse.json({ error: 'Failed to save homepage config' }, { status: 500 });
  }
}
