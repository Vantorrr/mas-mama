'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRef } from 'react';

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
    // Загружаем настройки обложек без кэша и обновляем при фокусе вкладки
    const load = () => fetch('/api/admin/homepage', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  // Универсальный блок слайдов
  const Slides = ({ slides, alt }: { slides: any[]; alt: string }) => {
    const [index, setIndex] = useState(0);
    const timerRef = useRef<number | null>(null);

    // Автопрокрутка
    useEffect(() => {
      if (!slides || slides.length <= 1) return;
      timerRef.current && window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 3500);
      return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }, [slides]);

    const current = slides?.[index] || slides?.[0];
    return (
      <div className="relative w-full h-full">
        {slides?.map((s, i) => (
          <Image key={`${s.url}-${i}`} src={s.url} alt={alt} fill className="object-contain bg-[#f8f3ed] absolute inset-0" style={{ objectPosition: `${s.x}% ${s.y}%`, opacity: i === index ? 1 : 0, transition: 'opacity 700ms ease-in-out' }} />
        ))}
        {slides?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {slides.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); setIndex(i); }} className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-[#3c2415]' : 'bg-white/70'}`} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-6 bg-white/50">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Новинки */}
          <a href="/catalog?new=true" className="group block">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Slides slides={config.blocks.novinki?.slides || []} alt="Новинки" />
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
                <Slides slides={config.blocks.kolye?.slides || []} alt="Колье" />
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
                <Slides slides={config.blocks.braslety?.slides || []} alt="Браслеты" />
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
                <Slides slides={config.blocks.medalony?.slides || []} alt="Медальоны" />
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
