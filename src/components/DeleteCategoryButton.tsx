'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteCategoryButtonProps {
  categoryId: number;
  categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Удалить категорию "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        router.refresh();
      } else {
        alert(result.error || 'Ошибка при удалении категории');
      }
    } catch (error) {
      alert('Ошибка при удалении категории');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
      title="Удалить"
    >
      <Trash2 size={12} />
    </button>
  );
}
