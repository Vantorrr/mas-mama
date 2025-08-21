'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order: '0',
    parentId: '',
    seoTitle: '',
    seoDescription: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/[а-я]/g, (match: string) => {
        const cyrillicToLatin: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
          'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
          'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
          'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return cyrillicToLatin[match] || match;
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: parseInt(formData.order),
          parentId: formData.parentId ? parseInt(formData.parentId) : null,
          coverImageUrl: coverImage || null,
        }),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert('Ошибка при создании категории');
      }
    } catch (error) {
      alert('Ошибка при создании категории');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      {/* Хедер */}
      <header className="bg-white border-b border-[#e8dcc6] shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/categories" className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Назад</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#6b4e3d]">Добавить категорию</h1>
              <p className="text-[#8b7355]">Создание новой категории или подкатегории</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-6">Основная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Название категории *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Браслеты"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  URL (slug) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="braslety"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Родительская категория
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                >
                  <option value="">Основная категория</option>
                  <option value="1">Браслеты</option>
                  <option value="2">Ожерелье</option>
                  <option value="3">Кулоны</option>
                </select>
              </div>
            </div>
          </div>

          {/* Обложка категории */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-6">Обложка категории</h2>
            
            <div className="mb-6">
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#e8dcc6] rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-[#8b7355] mb-4" />
                  <p className="text-[#6b4e3d] font-medium mb-2">Загрузить обложку</p>
                  <p className="text-sm text-[#8b7355]">Рекомендуемый размер: 400x300px</p>
                </div>
              </label>
            </div>

            {coverImage && (
              <div className="relative w-48 h-36 mx-auto">
                <Image
                  src={coverImage}
                  alt="Обложка категории"
                  fill
                  className="object-cover rounded-lg border border-[#e8dcc6]"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-6">SEO настройки</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  SEO заголовок
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Браслеты ручной работы | masterskaya_mama"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  SEO описание
                </label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Эксклюзивные браслеты ручной работы из премиальных материалов..."
                />
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {isSubmitting ? 'Создание...' : 'Создать категорию'}
            </button>
            <Link
              href="/admin/categories"
              className="px-6 py-3 border-2 border-[#8b7355] text-[#8b7355] rounded-lg hover:bg-[#8b7355] hover:text-white transition-all"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
