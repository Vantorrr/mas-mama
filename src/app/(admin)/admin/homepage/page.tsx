'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminHomepagePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState({
    heroImage: '/logo.jpg',
    blocks: {
      novinkiFoto: '/logo.jpg',
      kolyeFoto: '/logo.jpg',
      brasletyFoto: '/logo.jpg',
      medalonyFoto: '/logo.jpg'
    }
  });

  useEffect(() => {
    // Загружаем текущие настройки
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const handleImageUpload = (blockKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageData = e.target.result as string;
          if (blockKey === 'hero') {
            setConfig(prev => ({ ...prev, heroImage: imageData }));
          } else {
            setConfig(prev => ({
              ...prev,
              blocks: { ...prev.blocks, [blockKey]: imageData }
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Обложки успешно обновлены! 🎉');
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (error) {
      alert('Ошибка при сохранении');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImageUploadBlock = ({ title, blockKey, currentImage }: { title: string, blockKey: string, currentImage: string }) => (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-[#6b4e3d] mb-4">{title}</h3>
      
      <div className="mb-4">
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
          <Image
            src={currentImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <label className="block w-full">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(blockKey, e)}
          className="hidden"
        />
        <div className="border-2 border-dashed border-[#e8dcc6] rounded-lg p-4 text-center hover:border-[#3c2415] transition-colors cursor-pointer">
          <Upload size={24} className="mx-auto text-[#8b7355] mb-2" />
          <p className="text-sm text-[#6b4e3d] font-medium">Загрузить новое фото</p>
        </div>
      </label>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-[#6b4e3d]">Настройки главной страницы</h1>
              <p className="text-[#8b7355]">Редактирование обложек и hero-изображения</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Hero изображение */}
          <ImageUploadBlock 
            title="Hero-изображение (главный логотип)" 
            blockKey="hero" 
            currentImage={config.heroImage} 
          />

          {/* Блоки категорий */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadBlock 
              title="Обложка блока 'Новинки'" 
              blockKey="novinkiFoto" 
              currentImage={config.blocks.novinkiFoto} 
            />
            <ImageUploadBlock 
              title="Обложка блока 'Колье'" 
              blockKey="kolyeFoto" 
              currentImage={config.blocks.kolyeFoto} 
            />
            <ImageUploadBlock 
              title="Обложка блока 'Браслеты'" 
              blockKey="brasletyFoto" 
              currentImage={config.blocks.brasletyFoto} 
            />
            <ImageUploadBlock 
              title="Обложка блока 'Медальоны'" 
              blockKey="medalonyFoto" 
              currentImage={config.blocks.medalonyFoto} 
            />
          </div>

          {/* Кнопка сохранения */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3c2415] to-[#2d2d2d] text-white rounded-xl font-medium 
                       hover:from-[#4a2e1a] hover:to-[#3a3a3a] transition-all disabled:opacity-50 mx-auto"
            >
              <Save size={18} />
              {isSubmitting ? 'Сохранение...' : 'Сохранить все изменения'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
