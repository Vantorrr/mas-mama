'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Slide = { url: string; x: number; y: number };

export default function HeroCarousel({ slides, intervalMs = 3500 }: { slides: Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [slides, intervalMs]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div
      className="relative w-full h-[56vh] md:h-[68vh] rounded-2xl overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] shadow-md select-none"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) {
          dx > 0 ? prev() : next();
        }
        touchStartX.current = null;
      }}
    >
      {/* Слои со слайдами, мягкое перекрытие */}
      {slides.map((s, i) => (
        <div
          key={`${s.url}-${i}`}
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: i === index ? 1 : 0,
            transition: 'opacity 900ms ease-in-out, transform 4000ms ease-out',
            transform: i === index ? 'scale(1.03)' : 'scale(1)'
          }}
        >
          <Image
            src={s.url}
            alt="hero"
            fill
            priority={i === index}
            className="object-cover"
            style={{ objectPosition: `${s.x}% ${s.y}%` }}
          />
          {/* Лёгкая затемняющая подложка для контраста */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
        </div>
      ))}

      {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Слайд ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#3c2415]' : 'bg-white/70'}`}
              />
            ))}
          </div>
      )}
    </div>
  );
}


