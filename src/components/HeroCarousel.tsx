'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Slide = { url: string; x: number; y: number };

export default function HeroCarousel({ slides, intervalMs = 3500 }: { slides: Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(id);
  }, [slides, intervalMs]);

  const current = slides[Math.min(index, slides.length - 1)];

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] shadow-md">
      {current && (
        <Image src={current.url} alt="hero" fill className="object-cover" style={{ objectPosition: `${current.x}% ${current.y}%` }} />
      )}
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === index ? 'bg-[#3c2415]' : 'bg-white/70'}`} />)
          )}
        </div>
      )}
    </div>
  );
}


