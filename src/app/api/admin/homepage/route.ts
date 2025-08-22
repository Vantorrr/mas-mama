import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

// Получить настройки главной страницы
export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src/data/homepage.json');
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      const raw = JSON.parse(data);
      // Нормализуем схему к новой структуре с фокусом (x/y) и обратной совместимостью
      const normalizeSlide = (input: any) => {
        if (!input) return { url: '/logo.jpg', x: 50, y: 50 };
        if (typeof input === 'string') return { url: input, x: 50, y: 50 };
        return { url: input.url || '/logo.jpg', x: Number(input.x ?? 50), y: Number(input.y ?? 50) };
      };
      const normalizeBlock = (val: any) => {
        // Поддержка: строка → один слайд; объект → один слайд; массив → slides
        if (Array.isArray(val)) return { slides: val.map(normalizeSlide) };
        const slide = normalizeSlide(val);
        return { slides: [slide] };
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
      return NextResponse.json(normalized);
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
      return NextResponse.json(defaultConfig);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get homepage config' }, { status: 500 });
  }
}

// Обновить настройки главной страницы
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const configPath = path.join(process.cwd(), 'src/data/homepage.json');
    
    // Создаем папку если не существует
    const dataDir = path.join(process.cwd(), 'src/data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Папка уже существует
    }
    
    await fs.writeFile(configPath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving homepage config:', error);
    return NextResponse.json({ error: 'Failed to save homepage config' }, { status: 500 });
  }
}
