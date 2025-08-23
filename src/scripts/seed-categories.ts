import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаем основные категории
  const braslety = await prisma.category.upsert({
    where: { slug: 'braslety' },
    update: {},
    create: {
      name: 'Браслеты',
      slug: 'braslety',
      order: 1,
    }
  });

  const kolye = await prisma.category.upsert({
    where: { slug: 'kolye' },
    update: {},
    create: {
      name: 'Колье',
      slug: 'kolye', 
      order: 2,
    }
  });

  const medalony = await prisma.category.upsert({
    where: { slug: 'medalony' },
    update: {},
    create: {
      name: 'Медальоны',
      slug: 'medalony',
      order: 3,
    }
  });

  console.log('Категории созданы:', { braslety, kolye, medalony });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

