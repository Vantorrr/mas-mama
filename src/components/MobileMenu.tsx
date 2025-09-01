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
    name: 'Ожерелье',
    href: '/catalog?category=ozherelya',
    subcategories: [
      { name: 'Натуральные камни', href: '/catalog?category=ozherelya&sub=naturalnye-kamni' },
      { name: 'Жемчуг', href: '/catalog?category=ozherelya&sub=zhemchug' },
    ]
  },
  {
    name: 'Кулоны',
    href: '/catalog?category=kulony',
    subcategories: [
      { name: 'С камнями', href: '/catalog?category=kulony&sub=s-kamnyami' },
      { name: 'Гравировка', href: '/catalog?category=kulony&sub=gravirovka' },
    ]
  },
  { name: 'Афиша', href: '/afisha' },
  { name: 'О нас', href: '/about' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <div>
      {/* Кнопка меню */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: '#f8f3ed',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Menu size={18} style={{ color: '#6b4e3d' }} />
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b4e3d' }}>Меню</span>
      </button>

      {/* Затемнение */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
        />
      )}

      {/* Панель меню */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '300px',
            backgroundColor: '#f5e6d3',
            zIndex: 999,
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
            overflow: 'auto'
          }}
        >
          {/* Заголовок */}
          <div
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid #e8dcc6',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#6b4e3d', margin: 0 }}>
              Меню
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%'
              }}
            >
              <X size={20} style={{ color: '#8b7355' }} />
            </button>
          </div>

          {/* Содержимое */}
          <div style={{ padding: '24px' }}>
            {menuItems.map((item) => (
              <div key={item.name} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      color: '#6b4e3d',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      display: 'block'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.name}
                  </Link>
                  {item.subcategories && (
                    <button
                      onClick={() => setOpenCategory(openCategory === item.name ? null : item.name)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '8px'
                      }}
                    >
                      <ChevronRight 
                        size={16} 
                        style={{ 
                          color: '#8b7355',
                          transform: openCategory === item.name ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }} 
                      />
                    </button>
                  )}
                </div>
                
                {/* Подкатегории */}
                {item.subcategories && openCategory === item.name && (
                  <div style={{ marginLeft: '16px', marginTop: '8px', borderLeft: '2px solid #f8f3ed' }}>
                    {item.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 16px',
                          color: '#8b7355',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f3ed';
                          e.currentTarget.style.color = '#6b4e3d';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#8b7355';
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Контакты */}
            <div
              style={{
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid #f8f3ed',
                textAlign: 'center'
              }}
            >
              <p style={{ fontSize: '14px', color: '#8b7355', marginBottom: '8px' }}>
                Нужна помощь?
              </p>
              <a 
                href="tel:+79991234567" 
                style={{ color: '#6b4e3d', fontWeight: '500', textDecoration: 'none' }}
              >
                +7 (999) 123-45-67
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}