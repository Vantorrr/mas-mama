'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CategoryBlocks() {
  const [config, setConfig] = useState<any>({
    blocks: {
      novinki: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
      kolye: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
      braslety: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
      medalony: { slides: [{ url: '/logo.jpg', x: 50, y: 50 }] },
    }
  });

  useEffect(() => {
    // Загружаем настройки обложек
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  return (
    <section className="py-16 px-6 bg-white/50">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Новинки */}
          <a href="/catalog?new=true" className="group block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Image src={config.blocks.novinki.slides[0].url} alt="Новинки" fill className="object-cover group-hover:scale-105 transition-transform duration-300" style={{ objectPosition: `${config.blocks.novinki.slides[0].x}% ${config.blocks.novinki.slides[0].y}%` }} />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-[#6b4e3d] text-sm">Новинки</h3>
              </div>
            </div>
          </a>

          {/* Колье */}
          <a href="/catalog?category=kolye" className="group block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Image src={config.blocks.kolye.slides[0].url} alt="Колье" fill className="object-cover group-hover:scale-105 transition-transform duration-300" style={{ objectPosition: `${config.blocks.kolye.slides[0].x}% ${config.blocks.kolye.slides[0].y}%` }} />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-[#6b4e3d] text-sm">Колье</h3>
              </div>
            </div>
          </a>

          {/* Браслеты */}
          <a href="/catalog?category=braslety" className="group block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Image src={config.blocks.braslety.slides[0].url} alt="Браслеты" fill className="object-cover group-hover:scale-105 transition-transform duration-300" style={{ objectPosition: `${config.blocks.braslety.slides[0].x}% ${config.blocks.braslety.slides[0].y}%` }} />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-[#6b4e3d] text-sm">Браслеты</h3>
              </div>
            </div>
          </a>

          {/* Медальоны */}
          <a href="/catalog?category=medalony" className="group block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Image src={config.blocks.medalony.slides[0].url} alt="Медальоны" fill className="object-cover group-hover:scale-105 transition-transform duration-300" style={{ objectPosition: `${config.blocks.medalony.slides[0].x}% ${config.blocks.medalony.slides[0].y}%` }} />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-[#6b4e3d] text-sm">Медальоны</h3>
              </div>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
