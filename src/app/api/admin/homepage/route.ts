import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

// Получить настройки главной страницы
export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src/data/homepage.json');
    
    try {
      const data = await fs.readFile(configPath, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    } catch (error) {
      // Если файла нет, возвращаем дефолтные настройки
      const defaultConfig = {
        heroImage: '/logo.jpg',
        blocks: {
          novinkiFoto: '/logo.jpg',
          kolyeFoto: '/logo.jpg',
          brasletyFoto: '/logo.jpg',
          medalonyFoto: '/logo.jpg'
        }
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
