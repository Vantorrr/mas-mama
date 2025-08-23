import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal ?? 
  new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}


