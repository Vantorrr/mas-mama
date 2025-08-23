import Image from 'next/image';
import { prisma } from '@/lib/prisma';

async function getAfishaContent() {
  try {
    const config = await prisma.homepageConfig.findUnique({ 
      where: { id: 2 } // ID 2 для афиши
    });
    
    return (config?.data as any) || {
      image: '/logo.jpg',
      title: 'Мастер-классы и события',
      content: `
        Добро пожаловать в мир авторских украшений!
        
        Мы регулярно проводим мастер-классы, где вы сможете:
        • Создать уникальное украшение своими руками
        • Познакомиться с различными техниками работы
        • Узнать секреты мастерства от профессионалов
        
        Следите за обновлениями нашей афиши — скоро здесь появится расписание ближайших событий!
        
        А пока вы можете связаться с нами для индивидуальной консультации или записи на персональный мастер-класс.
      `
    };
  } catch {
    return {
      image: '/logo.jpg', 
      title: 'Мастер-классы и события',
      content: 'Скоро здесь появится информация о наших мероприятиях!'
    };
  }
}

export default async function AfishaPage() {
  const content = await getAfishaContent();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed] pt-20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Заголовок */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#6b4e3d] text-center mb-12">
          Афиша
        </h1>
        
        {/* Основной контент */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Изображение */}
          <div className="relative h-[400px] bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
            <Image
              src={content.image}
              alt="Афиша событий"
              fill
              className="object-cover"
            />
          </div>
          
          {/* Текстовый контент */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#6b4e3d] mb-6">
              {content.title}
            </h2>
            
            <div className="prose prose-lg max-w-none text-[#8b7355]">
              {content.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
            
            {/* Контакты */}
            <div className="mt-12 p-6 bg-[#f8f3ed] rounded-xl">
              <h3 className="text-xl font-semibold text-[#6b4e3d] mb-4">
                Записаться на мастер-класс
              </h3>
              <div className="space-y-3">
                <a 
                  href="tel:+79991234567" 
                  className="flex items-center gap-3 text-[#8b7355] hover:text-[#6b4e3d] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    />
                  </svg>
                  +7 (999) 123-45-67
                </a>
                <a 
                  href="mailto:info@masterskaya-mama.ru" 
                  className="flex items-center gap-3 text-[#8b7355] hover:text-[#6b4e3d] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  info@masterskaya-mama.ru
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
