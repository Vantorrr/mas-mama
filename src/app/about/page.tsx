import Image from 'next/image';
import { Heart, Award, Gem, Users, Mail, Phone, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed]">
      {/* Hero секция */}
      <div className="relative h-[60vh] bg-gradient-to-br from-[#6b4e3d] to-[#3c2415] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <ScrollReveal className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">О нас</h1>
            <p className="text-xl leading-relaxed">Мы создаем уникальные авторские украшения, которые рассказывают истории и дарят эмоции. Каждое изделие — это частичка души мастера, воплощенная в драгоценных камнях и металлах.</p>
          </ScrollReveal>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-amber-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-amber-300/30 rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* История бренда */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-[#6b4e3d] mb-6">Наша история</h2>
              <div className="space-y-4 text-[#8b7355] leading-relaxed">
                <p><strong className="text-[#6b4e3d]">Masterskaya Mama</strong> — это семейная мастерская, которая появилась из любви к прекрасному и желания создавать что-то особенное своими руками.</p>
                <p>Все началось с маленького хобби — создания украшений для близких. Постепенно это увлечение переросло в настоящее дело, которому мы посвящаем всю свою душу.</p>
                <p>Сегодня мы создаем авторские украшения из натуральных камней, драгоценных металлов и качественных материалов, каждое изделие проходит через наши руки с особой заботой и вниманием.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] rounded-2xl p-8">
                  <Image src="/logo.jpg" alt="Мастерская" fill className="object-cover rounded-2xl" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Наши ценности */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#6b4e3d] text-center mb-12">
            Наши ценности
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: "Любовь к делу",
                description: "Каждое украшение создается с любовью и вниманием к деталям"
              },
              {
                icon: Award,
                title: "Качество",
                description: "Используем только качественные материалы и проверенные техники"
              },
              {
                icon: Gem,
                title: "Уникальность",
                description: "Каждое изделие — это авторская работа в единственном экземпляре"
              },
              {
                icon: Users,
                title: "Индивидуальный подход",
                description: "Учитываем пожелания каждого клиента и создаем персональные украшения"
              }
            ].map((value, index) => (
              <ScrollReveal key={index}>
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-[#f8f3ed] rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="text-[#6b4e3d]" size={24} />
                  </div>
                  <h3 className="font-semibold text-[#6b4e3d] mb-2">{value.title}</h3>
                  <p className="text-[#8b7355] text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Процесс создания */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[#6b4e3d] text-center mb-12">
            Как мы создаем украшения
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Идея и эскиз",
                description: "Каждое украшение начинается с идеи. Мы создаем эскизы, продумываем концепцию и выбираем материалы."
              },
              {
                step: "02", 
                title: "Подбор материалов",
                description: "Тщательно отбираем натуральные камни, металлы и фурнитуру. Каждый элемент должен быть идеальным."
              },
              {
                step: "03",
                title: "Создание украшения",
                description: "Ручная работа мастера. Каждый элемент обрабатывается с особой тщательностью и любовью."
              }
            ].map((process, index) => (
              <ScrollReveal key={index}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#6b4e3d] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {process.step}
                  </div>
                  <h3 className="font-semibold text-[#6b4e3d] mb-3 text-lg">{process.title}</h3>
                  <p className="text-[#8b7355] leading-relaxed">{process.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Контакты */}
        <section className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-3xl font-bold text-[#6b4e3d] text-center mb-8">
            Свяжитесь с нами
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal className="text-center">
              <div className="w-12 h-12 bg-[#f8f3ed] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-[#6b4e3d]" size={24} />
              </div>
              <h3 className="font-semibold text-[#6b4e3d] mb-2">Телефон</h3>
              <a href="tel:+79991234567" className="text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
                +7 (999) 123-45-67
              </a>
            </ScrollReveal>

            <ScrollReveal className="text-center">
              <div className="w-12 h-12 bg-[#f8f3ed] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-[#6b4e3d]" size={24} />
              </div>
              <h3 className="font-semibold text-[#6b4e3d] mb-2">Email</h3>
              <a href="mailto:info@masterskaya-mama.ru" className="text-[#8b7355] hover:text-[#6b4e3d] transition-colors">
                info@masterskaya-mama.ru
              </a>
            </ScrollReveal>

            <ScrollReveal className="text-center">
              <div className="w-12 h-12 bg-[#f8f3ed] rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-[#6b4e3d]" size={24} />
              </div>
              <h3 className="font-semibold text-[#6b4e3d] mb-2">Адрес</h3>
              <p className="text-[#8b7355]">
                г. Москва<br />
                ул. Мастеров, 123
              </p>
            </ScrollReveal>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#e8dcc6] text-center">
            <p className="text-[#8b7355] mb-4">
              Мы всегда рады ответить на ваши вопросы и помочь с выбором украшений
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+79991234567"
                className="px-6 py-3 bg-[#6b4e3d] hover:bg-[#3c2415] text-white rounded-xl font-semibold transition-colors"
              >
                Позвонить
              </a>
              <a
                href="mailto:info@masterskaya-mama.ru"
                className="px-6 py-3 border border-[#6b4e3d] text-[#6b4e3d] hover:bg-[#6b4e3d] hover:text-white rounded-xl font-semibold transition-colors"
              >
                Написать
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
