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
      const normalizeBlock = (urlOrObj: any) => {
        if (!urlOrObj) return { url: '/logo.jpg', x: 50, y: 50 };
        if (typeof urlOrObj === 'string') return { url: urlOrObj, x: 50, y: 50 };
        const { url, x, y } = urlOrObj;
        return { url: url || '/logo.jpg', x: Number(x ?? 50), y: Number(y ?? 50) };
      };

      // Поддержка старых ключей novinkiFoto/kolyeFoto/... если они были строками
      const blocks = raw.blocks || {};
      const normalized = {
        heroImage: raw.heroImage || '/logo.jpg',
        heroPos: { x: Number(raw.heroPos?.x ?? 50), y: Number(raw.heroPos?.y ?? 50) },
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
        heroImage: '/logo.jpg',
        heroPos: { x: 50, y: 50 },
        blocks: {
          novinki: { url: '/logo.jpg', x: 50, y: 50 },
          kolye: { url: '/logo.jpg', x: 50, y: 50 },
          braslety: { url: '/logo.jpg', x: 50, y: 50 },
          medalony: { url: '/logo.jpg', x: 50, y: 50 },
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
