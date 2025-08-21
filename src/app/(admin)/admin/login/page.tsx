'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/admin');
      } else {
        setError(result.error || 'Неверный логин или пароль');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="masterskaya_mama"
            width={80}
            height={80}
            className="mx-auto rounded-full shadow-lg mb-4"
          />
          <h1 className="text-2xl font-bold text-[#6b4e3d] mb-2">Вход в админ-панель</h1>
          <p className="text-[#8b7355]">masterskaya_mama</p>
        </div>

        {/* Форма входа */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-medium 
                       hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 
                       shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Вход...' : 'Войти в админ-панель'}
            </button>
          </form>

          {/* Подсказка для разработки */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700 font-medium mb-1">Данные для входа:</p>
            <p className="text-xs text-amber-600">Email: admin@example.com</p>
            <p className="text-xs text-amber-600">Пароль: admin123</p>
          </div>
        </div>

        {/* Ссылка на сайт */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-[#8b7355] hover:text-[#6b4e3d] transition-colors text-sm"
          >
            ← Вернуться на сайт
          </Link>
        </div>
      </div>
    </main>
  );
}
