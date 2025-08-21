'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    shortDescription: '',
    categoryId: '', // Пустое значение по умолчанию
    subcategoryId: '',
    inStock: true,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceCents: Math.round(parseFloat(formData.price) * 100),
          images: images,
        }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('Ошибка при создании товара');
      }
    } catch (error) {
      alert('Ошибка при создании товара');
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
            <Link href="/admin" className="flex items-center gap-2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Назад</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#6b4e3d]">Добавить товар</h1>
              <p className="text-[#8b7355]">Создание нового украшения</p>
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
                  Название товара *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Браслет золотой с камнями"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Артикул *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="BR-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Цена (₽) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="3500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                  Категория *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                >
                  <option value="">Выберите категорию</option>
                  <option value="1">Браслеты</option>
                  <option value="2">Колье</option>
                  <option value="3">Медальоны</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#6b4e3d] mb-2">
                Краткое описание
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-[#e8dcc6] rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                placeholder="Элегантный браслет из высококачественного золота с натуральными камнями..."
              />
            </div>
            <div className="mt-6">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-5 h-5 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-sm font-medium text-[#6b4e3d]">В наличии</span>
              </label>
            </div>
          </div>

          {/* Изображения */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-[#6b4e3d] mb-6">Изображения</h2>
            
            {/* Загрузка изображений */}
            <div className="mb-6">
              <label className="block w-full">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#e8dcc6] rounded-lg p-8 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <Upload size={48} className="mx-auto text-[#8b7355] mb-4" />
                  <p className="text-[#6b4e3d] font-medium mb-2">Загрузить изображения</p>
                  <p className="text-sm text-[#8b7355]">Выберите несколько файлов или перетащите их сюда</p>
                </div>
              </label>
            </div>

            {/* Превью изображений */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Превью ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-[#e8dcc6]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Обложка
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all disabled:opacity-50"
            >
              <Plus size={18} />
              {isSubmitting ? 'Создание...' : 'Создать товар'}
            </button>
            <Link
              href="/admin"
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
