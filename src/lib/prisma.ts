import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prismaGlobal: any | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Важно: для Prisma Accelerate используем prisma:// URL из ENV
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
};

export const prisma = global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}


