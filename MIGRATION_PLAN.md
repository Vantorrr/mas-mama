# План миграции для ускорения сайта

## Вариант 1: Prisma Accelerate (15 минут)
1. Зарегистрироваться на https://console.prisma.io/
2. Создать проект и получить CONNECTION_STRING
3. Заменить DATABASE_URL на Accelerate URL
4. Деплой - будет летать!

## Вариант 2: Vercel + Supabase (30 минут)
1. Создать аккаунт Supabase
2. Экспортировать данные из Railway
3. Импортировать в Supabase
4. Подключить Vercel к GitHub
5. Настроить env переменные
6. Деплой

## Вариант 3: Добавить Redis кэш (20 минут)
1. Создать Upstash Redis
2. Добавить @upstash/redis
3. Кэшировать тяжелые запросы
4. Деплой

## Сравнение:
- **Скорость**: Vercel+Supabase > Prisma Accelerate > Redis кэш
- **Простота**: Prisma Accelerate > Redis > Vercel+Supabase
- **Стоимость**: Все имеют бесплатные планы
