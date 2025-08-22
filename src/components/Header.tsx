import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import MobileMenu from "./MobileMenu";
import CartCounter from "./CartCounter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8dcc6] shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* Левая часть - меню */}
          <div className="justify-self-start">
            <MobileMenu />
          </div>

          {/* Центр - логотип и название (строго по центру) */}
          <div className="justify-self-center">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center gap-4 group cursor-pointer"
              onClick={(e) => {
                // fallback на случай, если клиентский роутер тормозит/заблокирован
                const timer = setTimeout(() => {
                  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    window.location.assign('/');
                  }
                }, 800);
                // очистка, если переход сработал быстро
                window.addEventListener('popstate', () => clearTimeout(timer), { once: true });
              }}
            >
              <div className="relative">
                <Image 
                  src="/logo.jpg" 
                  alt="masterskaya_mama" 
                  width={50} 
                  height={50} 
                  className="rounded-full shadow-md ring-2 ring-[#f8f3ed] group-hover:ring-[#3c2415] transition-all duration-200" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#3c2415] to-[#2d2d2d] rounded-full flex items-center justify-center">
                  <Star size={10} className="text-white fill-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-[#6b4e3d] tracking-tight group-hover:text-[#3c2415] transition-colors">
                  masterskaya_mama
                </h1>
                <p className="text-xs text-[#8b7355] font-light">Авторские украшения</p>
              </div>
            </Link>
          </div>

          {/* Правая часть - поиск и корзина */}
          <div className="justify-self-end flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
              <input 
                placeholder="Поиск украшений..." 
                className="w-64 pl-10 pr-4 py-2.5 bg-[#f8f3ed] border border-[#e8dcc6] rounded-full text-sm 
                         placeholder:text-[#a69584] focus:outline-none focus:ring-2 focus:ring-amber-400/50 
                         focus:border-amber-400 transition-all"
              />
            </div>
            <CartCounter />
          </div>
        </div>
      </div>
    </header>
  );
}