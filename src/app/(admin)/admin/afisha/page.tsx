'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Upload, X } from 'lucide-react';

export default function AdminAfishaPage() {
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [content, setContent] = useState({
    image: '/logo.jpg',
    title: 'Мастер-классы и события',
    content: ''
  });

  // Загружаем текущие настройки
  useEffect(() => {
    fetch('/api/admin/afisha')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(console.error);
  }, []);

  // Обработка загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setContent(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Сохранение изменений
  const handleSave = async () => {
    setLoading(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/admin/afisha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Редактирование афиши
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Изображение */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Изображение</h2>
            
            <div className="relative">
              <div className="relative h-[400px] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={content.image}
                  alt="Афиша"
                  fill
                  className="object-cover"
                />
              </div>

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2">
                  <Upload size={20} />
                  Загрузить изображение
                </div>
              </label>
            </div>
          </div>

          {/* Заголовок */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Мастер-классы и события"
            />
          </div>

          {/* Контент */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст (каждый абзац с новой строки)
            </label>
            <textarea
              value={content.content}
              onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={12}
              placeholder="Введите текст афиши..."
            />
          </div>

          {/* Кнопка сохранения */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>

            {saveSuccess && (
              <span className="text-green-600 flex items-center gap-2">
                ✓ Сохранено успешно!
              </span>
            )}
          </div>

          {/* Подсказка */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Подсказка:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Каждый новый абзац начинайте с новой строки</li>
              <li>• Для маркированного списка используйте символ • в начале строки</li>
              <li>• Рекомендуемый размер изображения: 1920x1080 пикселей</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

