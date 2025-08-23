import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/EditProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true, subcategory: true }
  });

  if (!product) return notFound();

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" }
  });

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#fffbf7] to-[#f8f3ed]">
      <EditProductForm product={product} categories={categories} />
    </main>
  );
}

