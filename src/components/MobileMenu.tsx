'use client';

import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    name: 'Браслеты',
    href: '/catalog?category=braslety',
    subcategories: [
      { name: 'Серебро', href: '/catalog?category=braslety&sub=serebro' },
      { name: 'Золото', href: '/catalog?category=braslety&sub=zoloto' },
      { name: 'Кожа', href: '/catalog?category=braslety&sub=kozha' },
    ]
  },
  {
    name: 'Колье',
    href: '/catalog?category=kolye',
    subcategories: [
      { name: 'На борные камни', href: '/catalog?category=kolye&sub=bornye-kamni' },
      { name: 'Монокамни', href: '/catalog?category=kolye&sub=monokamni' },
    ]
  },
  {
    name: 'Медальоны',
    href: '/catalog?category=medalony',
    subcategories: [
      { name: 'На борные камни', href: '/catalog?category=medalony&sub=bornye-kamni' },
      { name: 'Монокамни', href: '/catalog?category=medalony&sub=monokamni' },
    ]
  },
  { name: 'Афиша', href: '/afisha' },
  { name: 'О нас', href: '/about' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <>
      {/* Кнопка меню */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8f3ed] hover:bg-[#f0e6d2] transition-colors group"
      >
        <Menu size={18} className="text-[#6b4e3d] group-hover:text-[#8b7355]" />
        <span className="text-sm font-medium text-[#6b4e3d] hidden sm:block">Меню</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Боковое меню */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-[#fdfcfb] shadow-xl z-[9999] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full bg-[#fdfcfb]">
          {/* Header с логотипом */}
          <div className="bg-white border-b border-[#e8dcc6] px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#6b4e3d]">Меню</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-[#f8f3ed] transition-colors"
            >
              <X size={20} className="text-[#8b7355]" />
            </button>
          </div>
          
          <div className="p-6">

          {/* Пункты меню */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 px-4 text-[#6b4e3d] hover:bg-white rounded-lg transition-all hover:shadow-sm font-medium"
                  >
                    {item.name}
                  </Link>
                  {item.subcategories && (
                    <button
                      onClick={() => setOpenCategory(openCategory === item.name ? null : item.name)}
                      className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm"
                    >
                      <ChevronRight 
                        size={16} 
                        className={`text-[#8b7355] transform transition-transform ${
                          openCategory === item.name ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                  )}
                </div>
                
                {/* Подкатегории */}
                {item.subcategories && openCategory === item.name && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-[#f8f3ed]">
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 px-4 text-[#8b7355] hover:bg-[#f8f3ed] hover:text-[#6b4e3d] rounded-lg transition-colors text-sm"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Дополнительная информация */}
          <div className="mt-12 pt-6 border-t border-[#f8f3ed]">
            <div className="text-center">
              <p className="text-sm text-[#8b7355] mb-2">Нужна помощь?</p>
              <a href="tel:+79991234567" className="text-[#6b4e3d] font-medium">
                +7 (999) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
