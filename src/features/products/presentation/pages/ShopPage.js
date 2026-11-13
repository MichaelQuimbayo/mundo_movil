import React, { useState, useMemo } from 'react';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import { ProductEntity } from '../../domain/entities/ProductEntity';
import { 
  QuickBrandsBar, 
  FilterSidebar, 
  ActiveFiltersBar, 
  MobileFilterButton, 
  MobileFilterDrawer 
} from '../components/ProductFilters';

export default function ShopPage({ products: initialProductGroups }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Re-hydrate plain objects from props back into ProductEntity class instances
  const productGroups = useMemo(() => 
    initialProductGroups ? initialProductGroups.map(group => ({
        ...group,
        variants: group.variants.map(v => new ProductEntity(v))
    })) : []
  , [initialProductGroups]);

  // Derive categories dynamically
  const categories = useMemo(() => {
    const counts = {};
    productGroups.forEach(g => {
      const cat = g.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const list = Object.keys(counts).map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat,
      count: counts[cat]
    }));

    return [
      { id: 'todos', name: 'Todos', count: productGroups.length },
      ...list
    ];
  }, [productGroups]);

  // Derive brands dynamically
  const brands = useMemo(() => {
    const counts = {};
    productGroups.forEach(g => {
      const brand = g.brand || 'Otras Marcas';
      counts[brand] = (counts[brand] || 0) + 1;
    });

    let list = Object.keys(counts).map(brand => ({
      id: brand.toLowerCase().replace(/\s+/g, '-'),
      name: brand,
      count: counts[brand]
    }));

    if (brandSearchQuery) {
      list = list.filter(b => b.name.toLowerCase().includes(brandSearchQuery.toLowerCase()));
    }

    return list;
  }, [productGroups, brandSearchQuery]);

  // Filter logic (AND between category and brands, OR between multiple brands)
  const filteredProducts = useMemo(() => {
    return productGroups.filter(group => {
      // 1. Search term
      if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory && selectedCategory !== 'todos') {
        const groupCatId = (group.category || '').toLowerCase().replace(/\s+/g, '-');
        if (groupCatId !== selectedCategory) {
          return false;
        }
      }

      // 3. Brands filter (OR if multiple selected)
      if (selectedBrands.length > 0) {
        const groupBrandId = (group.brand || '').toLowerCase().replace(/\s+/g, '-');
        if (!selectedBrands.includes(groupBrandId)) {
          return false;
        }
      }

      return true;
    });
  }, [productGroups, searchTerm, selectedCategory, selectedBrands]);

  // Handlers
  const handleSelectCategory = (catId) => setSelectedCategory(catId);
  const handleToggleBrand = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };
  const handleClearAll = () => {
    setSelectedCategory('todos');
    setSelectedBrands([]);
  };

  return (
    <>
      <Navbar />
      <main className="bg-stone-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white">
              Nuestra Colección
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-stone-600 dark:text-stone-400">
              Explora todo nuestro catálogo de smartphones, accesorios y tecnología de última generación.
            </p>
          </div>

          {/* Quick Brands Bar */}
          <div className="mt-8 border-b border-stone-200 dark:border-stone-800 pb-2">
            <QuickBrandsBar 
              brands={brands} 
              selectedBrands={selectedBrands} 
              onSelectBrand={handleToggleBrand} 
            />
          </div>

          {/* Buscador y Botón Móvil de Filtros */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-stone-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca en nuestra colección..."
                className="block w-full rounded-xl border-0 bg-white dark:bg-stone-800 py-3 pl-10 pr-3 text-stone-900 dark:text-stone-200 ring-1 ring-inset ring-stone-300 dark:ring-stone-700 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm"
              />
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              <MobileFilterButton 
                onClick={() => setIsMobileFiltersOpen(true)} 
                activeCount={(selectedCategory && selectedCategory !== 'todos' ? 1 : 0) + selectedBrands.length} 
              />
            </div>
          </div>

          {/* Active Filters Bar */}
          <ActiveFiltersBar 
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            categories={categories}
            brands={brands}
            onRemoveCategory={() => setSelectedCategory('todos')}
            onRemoveBrand={(brandId) => handleToggleBrand(brandId)}
            onClearAll={handleClearAll}
          />

          {/* Layout Principal: Sidebar Izquierdo + Productos */}
          <div className="mt-8 flex gap-8 items-start">
            <FilterSidebar 
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              selectedBrands={selectedBrands}
              onSelectCategory={handleSelectCategory}
              onToggleBrand={handleToggleBrand}
              onSearchBrand={setBrandSearchQuery}
              brandSearchQuery={brandSearchQuery}
            />

            <div className="flex-1">
              {/* Contador de resultados */}
              <div className="mb-6 text-sm text-stone-500 dark:text-stone-400">
                Mostrando <strong className="text-stone-900 dark:text-white">{filteredProducts.length}</strong> productos encontrados
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((group) => (
                    <ProductCard key={group.groupCode} group={group} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <p className="text-lg text-stone-600 dark:text-stone-400">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                  <button 
                    onClick={handleClearAll}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Restablecer filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileFilterDrawer 
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        selectedBrands={selectedBrands}
        onSelectCategory={handleSelectCategory}
        onToggleBrand={handleToggleBrand}
        onClearAll={handleClearAll}
        matchedCount={filteredProducts.length}
      />

      <Footer />
    </>
  );
}
