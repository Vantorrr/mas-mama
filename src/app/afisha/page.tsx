'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users, Tag, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  price: number;
  maxParticipants?: number;
  currentParticipants: number;
  isActive: boolean;
}

// Моковые данные событий
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Мастер-класс: Создание браслета из натуральных камней',
    description: 'Научитесь создавать красивые браслеты из натуральных камней. В программе: выбор камней, техники плетения, создание уникального дизайна.',
    date: '2024-01-15',
    time: '14:00',
    location: 'Мастерская на ул. Мастеров, 123',
    image: '/logo.jpg',
    category: 'Мастер-класс',
    price: 2500,
    maxParticipants: 8,
    currentParticipants: 3,
    isActive: true
  },
  {
    id: '2',
    title: 'Выставка авторских украшений "Зимние грезы"',
    description: 'Представляем новую коллекцию зимних украшений. Уникальные дизайны, вдохновленные красотой зимней природы.',
    date: '2024-01-20',
    time: '18:00',
    location: 'Галерея "Арт-Пространство"',
    image: '/logo.jpg',
    category: 'Выставка',
    price: 0,
    currentParticipants: 0,
    isActive: true
  },
  {
    id: '3',
    title: 'Индивидуальная консультация по выбору украшений',
    description: 'Персональная встреча с мастером для создания украшения по вашим пожеланиям. Обсуждение дизайна, материалов и сроков.',
    date: '2024-01-25',
    time: '16:00',
    location: 'Мастерская (по записи)',
    image: '/logo.jpg',
    category: 'Консультация',
    price: 1000,
    maxParticipants: 1,
    currentParticipants: 0,
    isActive: true
  }
];

const categories = ['Все', 'Мастер-класс', 'Выставка', 'Консультация'];

export default function AfishaPage() {
  const [events] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Все') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === category));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isEventSoon = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const isEventFull = (event: Event) => {
    return event.maxParticipants && event.currentParticipants >= event.maxParticipants;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed]">
      {/* Hero секция */}
      <div className="relative h-[50vh] bg-gradient-to-br from-[#6b4e3d] to-[#3c2415] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Афиша событий
            </h1>
            <p className="text-xl leading-relaxed">
              Мастер-классы, выставки и встречи для ценителей авторских украшений
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Фильтры */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-400 text-white shadow-md'
                    : 'bg-[#f8f3ed] text-[#6b4e3d] hover:bg-[#f0e6d2]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Список событий */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-[#6b4e3d] mb-2">События не найдены</h2>
            <p className="text-[#8b7355]">В выбранной категории пока нет событий</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Изображение */}
                <div className="relative h-48 bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Бейджи */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-amber-400 text-white text-sm font-semibold rounded-full">
                      {event.category}
                    </span>
                    {isEventSoon(event.date) && (
                      <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                        Скоро
                      </span>
                    )}
                    {isEventFull(event) && (
                      <span className="px-3 py-1 bg-gray-500 text-white text-sm font-semibold rounded-full">
                        Мест нет
                      </span>
                    )}
                  </div>

                  {/* Цена */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-[#6b4e3d] font-bold rounded-full">
                      {event.price === 0 ? 'Бесплатно' : `${event.price} ₽`}
                    </span>
                  </div>
                </div>

                {/* Контент */}
                <div className="p-6">
                  <h3 className="font-bold text-[#6b4e3d] text-xl mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-[#8b7355] mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Детали события */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[#8b7355]">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#8b7355]">
                      <Clock size={16} />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#8b7355]">
                      <MapPin size={16} />
                      <span className="text-sm">{event.location}</span>
                    </div>

                    {event.maxParticipants && (
                      <div className="flex items-center gap-2 text-[#8b7355]">
                        <Users size={16} />
                        <span className="text-sm">
                          {event.currentParticipants} из {event.maxParticipants} участников
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-3 border border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white rounded-xl font-semibold transition-colors"
                    >
                      Подробнее
                    </button>
                    
                    <button
                      disabled={isEventFull(event)}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${
                        isEventFull(event)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-amber-400 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {event.price === 0 ? 'Записаться' : 'Купить билет'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA секция */}
        <section className="mt-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Хотите провести свое мероприятие?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Мы организуем мастер-классы, выставки и частные показы украшений
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+79991234567"
              className="px-6 py-3 bg-white text-amber-600 hover:bg-amber-50 rounded-xl font-semibold transition-colors"
            >
              Обсудить мероприятие
            </a>
            <a
              href="mailto:info@masterskaya-mama.ru"
              className="px-6 py-3 border border-white text-white hover:bg-white hover:text-amber-600 rounded-xl font-semibold transition-colors"
            >
              Написать нам
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
