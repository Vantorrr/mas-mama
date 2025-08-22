'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, Grid, List, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  sku: string;
  inStock: boolean;
}

// Моковые данные товаров
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Браслет из натуральных камней с бантиком Дельфин',
    price: 3900,
    image: '/api/images/braslet-iz-naturalьnyh-kamney-s-bantikom-delьfin-1755840511329.jpg',
    category: 'braslety',
    subcategory: 'naturalnye-kamni',
    sku: '001',
    inStock: true
  },
  {
    id: '2',
    name: 'Колье Клоун',
    price: 5500,
    image: '/api/images/kolьe-kloun-1755840511254.jpg',
    category: 'kolye',
    subcategory: 'monokamni',
    sku: '002',
    inStock: true
  },
  {
    id: '3',
    name: 'Браслет 6',
    price: 3500,
    image: '/logo.jpg',
    category: 'braslety',
    subcategory: 'serebro',
    sku: 'BR-1006',
    inStock: true
  },
  {
    id: '4',
    name: 'Браслет 7',
    price: 3500,
    image: '/logo.jpg',
    category: 'braslety',
    subcategory: 'zoloto',
    sku: 'BR-1007',
    inStock: true
  },
  {
    id: '5',
    name: 'Браслет 8',
    price: 3500,
    image: '/logo.jpg',
    category: 'braslety',
    subcategory: 'kozha',
    sku: 'BR-1008',
    inStock: true
  },
  {
    id: '6',
    name: 'Браслет 9',
    price: 3500,
    image: '/logo.jpg',
    category: 'braslety',
    subcategory: 'serebro',
    sku: 'BR-1009',
    inStock: true
  }
];

const categories = {
  braslety: 'Браслеты',
  kolye: 'Колье',
  medalony: 'Медальоны'
};

const subcategories = {
  braslety: {
    serebro: 'Серебро',
    zoloto: 'Золото',
    kozha: 'Кожа'
  },
  kolye: {
    'naturalnye-kamni': 'Натуральные камни',
    zhemchug: 'Жемчуг'
  },
  medalony: {
    's-kamnyami': 'С камнями',
    gravirovka: 'Гравировка'
  }
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('sub') || '';
    
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    
    filterProducts(category, subcategory, searchQuery);
  }, [searchParams, searchQuery]);

  const filterProducts = (category: string, subcategory: string, search: string) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (subcategory) {
      filtered = filtered.filter(product => product.subcategory === subcategory);
    }

    if (search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
    filterProducts(category, '', searchQuery);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    filterProducts(selectedCategory, subcategory, searchQuery);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    filterProducts(selectedCategory, selectedSubcategory, search);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchQuery('');
    setFilteredProducts(products);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed]">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#6b4e3d] mb-4">
            {selectedCategory ? categories[selectedCategory as keyof typeof categories] : 'Каталог украшений'}
          </h1>
          <p className="text-[#8b7355] text-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'товар' : 'товаров'}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Поиск */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b7355]" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию или артикулу..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e8dcc6] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
            </div>

            {/* Кнопки управления */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f8f3ed] hover:bg-[#f0e6d2] rounded-lg transition-colors"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Фильтры</span>
              </button>
              
              <div className="flex border border-[#e8dcc6] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-amber-400 text-white' : 'bg-white hover:bg-[#f8f3ed]'} transition-colors`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-amber-400 text-white' : 'bg-white hover:bg-[#f8f3ed]'} transition-colors`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Развернутые фильтры */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[#e8dcc6]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Категории */}
                <div>
                  <h3 className="font-semibold text-[#6b4e3d] mb-3">Категория</h3>
                  <div className="space-y-2">
                    {Object.entries(categories).map(([key, name]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === key}
                          onChange={() => handleCategoryChange(key)}
                          className="text-amber-400"
                        />
                        <span className="text-sm">{name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Подкатегории */}
                {selectedCategory && subcategories[selectedCategory as keyof typeof subcategories] && (
                  <div>
                    <h3 className="font-semibold text-[#6b4e3d] mb-3">Материал</h3>
                    <div className="space-y-2">
                      {Object.entries(subcategories[selectedCategory as keyof typeof subcategories]).map(([key, name]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={selectedSubcategory === key}
                            onChange={() => handleSubcategoryChange(key)}
                            className="text-amber-400"
                          />
                          <span className="text-sm">{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Действия */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-[#8b7355] hover:text-[#6b4e3d] transition-colors"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Список товаров */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-[#6b4e3d] mb-2">Товары не найдены</h2>
            <p className="text-[#8b7355] mb-4">Попробуйте изменить параметры поиска</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`relative bg-gradient-to-br from-[#f8f3ed] to-[#f0e6d2] ${
                  viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
                }`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Нет в наличии</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1">
                  <Link href={`/product/${product.sku.toLowerCase()}-${product.id}`}>
                    <h3 className="font-semibold text-[#6b4e3d] mb-2 hover:text-[#3c2415] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-[#8b7355] mb-2">
                    Артикул: {product.sku}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#6b4e3d]">
                      {product.price.toLocaleString()} ₽
                    </span>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.sku.toLowerCase()}-${product.id}`}
                        className="px-3 py-2 text-sm border border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white rounded-lg transition-colors"
                      >
                        Подробнее
                      </Link>
                      <button
                        className="px-3 py-2 text-sm bg-amber-400 hover:bg-amber-500 text-white rounded-lg transition-colors"
                        disabled={!product.inStock}
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f8f3ed] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-[#6b4e3d] text-lg">Загружаем каталог...</p>
      </div>
    </div>}>
      <CatalogContent />
    </Suspense>
  );
}
