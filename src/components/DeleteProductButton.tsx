'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteProductButtonProps {
  productId: number;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Удалить "${productName}"?`)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('_method', 'DELETE');

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Ошибка при удалении товара');
      }
    } catch {
      alert('Ошибка при удалении товара');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Удалить"
    >
      <Trash2 size={16} />
    </button>
  );
}
