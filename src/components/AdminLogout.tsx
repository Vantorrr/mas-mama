'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-[#8b7355] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Выйти"
    >
      <LogOut size={16} />
      <span className="text-sm">Выйти</span>
    </button>
  );
}
