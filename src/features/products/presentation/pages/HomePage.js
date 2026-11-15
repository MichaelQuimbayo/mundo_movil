import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../../../shared/components/Navbar';
import Footer from '../../../../shared/components/Footer';
import ProductCard from '../components/ProductCard';
import TestimonialsSection from '../../../testimonials/presentation/components/TestimonialsSection';
import GuaranteesSection from '../../../../shared/components/GuaranteesSection';
import { useProducts } from '../../infrastructure/data/useProducts';
import ModelingCarousel from '../components/ModelingCarousel';
import HeroCarousel from '../../../../shared/components/HeroCarousel';
import { ProductEntity } from '../../domain/entities/ProductEntity';
import { 
  QuickBrandsBar, 
  FilterSidebar, 
  ActiveFiltersBar, 
  MobileFilterButton, 
  MobileFilterDrawer 
} from '../components/ProductFilters';

// Datos para el carrusel principal
const slides = [
  {
    image: '/images/Banner01.jpg',
    title: 'Eleva tu Rendimiento',
    subtitle: 'Diseño premium y tecnología de vanguardia para el atleta moderno.',
    cta: 'Ver colección',
    link: '#productos'
  },
  {
    image: '/images/Banner02.jpg',
    title: 'Eleva tu Rendimiento',
    subtitle: 'Diseño premium y tecnología de vanguardia para el atleta moderno.',
    cta: 'Ver colección',
    link: '#productos'
  },
  {
    image: '/images/Banner03.jpg',
    title: 'Eleva tu Rendimiento',
    subtitle: 'Diseño premium y tecnología de vanguardia para el atleta moderno.',
    cta: 'Ver colección',
    link: '#productos'
  },
];

const BenefitsSection = () => (
  <div className="py-24 sm:py-32">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="max-w-2xl mx-auto lg:text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
          Diseñado para el Movimiento
        </h2>
        <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
          Cada pieza está meticulosamente confeccionada para fusionar estilo, comodidad y un rendimiento sin concesiones.
        </p>
      </div>
    </div>
  </div>
);

export default function HomePage({ testimonials, products: serverProductGroups }) {
  const { products: clientProductGroups, isLoading } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [sortBy, setSortBy] = useState('mas-destacados');
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Prioritize client-side data if available, otherwise use server-side data
  const rawProductGroups = clientProductGroups && clientProductGroups.length > 0 
    ? clientProductGroups 
    : serverProductGroups || [];

  // Re-hydrate plain objects into ProductEntity instances
  const productGroups = useMemo(() => 
    rawProductGroups.map(group => ({
        ...group,
        variants: group.variants.map(v => new ProductEntity(v))
    }))
  , [rawProductGroups]);

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

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = productGroups.filter(group => {
      // 1. Search term (from header search bar)
      if (searchTerm) {
        const q = searchTerm.toLowerCase().trim();
        const nameMatch = group.name.toLowerCase().includes(q);
        const brandMatch = (group.brand || '').toLowerCase().includes(q);
        const categoryMatch = (group.category || '').toLowerCase().includes(q);
        if (!nameMatch && !brandMatch && !categoryMatch) {
          return false;
        }
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

      // 4. Max Price filter
      const groupMinPrice = group.priceRange?.min || 0;
      if (maxPrice !== undefined && groupMinPrice > maxPrice) {
        return false;
      }

      return true;
    });

    // 5. Sorting
    if (sortBy === 'precio-asc') {
      result.sort((a, b) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
    } else if (sortBy === 'precio-desc') {
      result.sort((a, b) => (b.priceRange?.min || 0) - (a.priceRange?.min || 0));
    } else if (sortBy === 'mas-destacados') {
      result.sort((a, b) => (b.rating || 4) - (a.rating || 4));
    }

    return result;
  }, [productGroups, searchTerm, selectedCategory, selectedBrands, maxPrice, sortBy]);

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
    setMaxPrice(5000000);
    setSearchTerm('');
  };

  return (
    <>
      <div className="relative flex flex-col bg-stone-50 dark:bg-gray-900 min-h-screen">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        {/* Slider de imágenes a ancho completo (de lado a lado) */}
        <div className="w-full">
          <HeroCarousel slides={slides} />
        </div>

        <main>
          <div id="productos" className="py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Quick Brands Bar */}
              <div className="border-b border-stone-200 dark:border-stone-800 pb-2">
                <QuickBrandsBar 
                  brands={brands} 
                  selectedBrands={selectedBrands} 
                  onSelectBrand={handleToggleBrand} 
                />
              </div>

              {/* Barra superior de controles en Móvil (Ordenar por a la izquierda, Filtro marcas a la derecha) */}
              <div className="mt-4 flex sm:hidden items-center justify-between gap-3 bg-white dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-xs text-stone-500 whitespace-nowrap">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-blue-600 truncate"
                  >
                    <option value="mas-destacados">Más destacados</option>
                    <option value="precio-asc">Menor a mayor</option>
                    <option value="precio-desc">Mayor a menor</option>
                  </select>
                </div>

                <div className="flex-shrink-0">
                  <MobileFilterButton 
                    onClick={() => setIsMobileFiltersOpen(true)} 
                    activeCount={(selectedCategory && selectedCategory !== 'todos' ? 1 : 0) + selectedBrands.length + (maxPrice < 5000000 ? 1 : 0)} 
                  />
                </div>
              </div>

              {/* Active Filters Bar */}
              <ActiveFiltersBar 
                selectedCategory={selectedCategory}
                selectedBrands={selectedBrands}
                maxPrice={maxPrice}
                categories={categories}
                brands={brands}
                onRemoveCategory={() => setSelectedCategory('todos')}
                onRemoveBrand={(brandId) => handleToggleBrand(brandId)}
                onRemovePrice={() => setMaxPrice(5000000)}
                onClearAll={handleClearAll}
              />

              {/* Layout Principal: Sidebar Izquierdo + Productos */}
              <div className="mt-6 flex gap-8 items-start">
                <FilterSidebar 
                  categories={categories}
                  brands={brands}
                  selectedCategory={selectedCategory}
                  selectedBrands={selectedBrands}
                  maxPrice={maxPrice}
                  onSelectCategory={handleSelectCategory}
                  onToggleBrand={handleToggleBrand}
                  onSearchBrand={setBrandSearchQuery}
                  brandSearchQuery={brandSearchQuery}
                  onPriceChange={setMaxPrice}
                />

                <div className="flex-1 min-w-0">
                  {/* Resultados Header Bar: Mostrando productos + Sort Combobox (Solo Escritorio) */}
                  <div className="hidden sm:flex bg-white dark:bg-stone-800 p-4 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm mb-6 items-center justify-between gap-4">
                    <div className="text-sm text-stone-600 dark:text-stone-300">
                      Mostrando <strong className="text-stone-900 dark:text-white">{filteredProducts.length}</strong> productos encontrados
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-stone-500 whitespace-nowrap">Ordenar por:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm text-stone-900 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="mas-destacados">Más destacados</option>
                        <option value="precio-asc">Menor a mayor precio</option>
                        <option value="precio-desc">Mayor a menor precio</option>
                      </select>
                    </div>
                  </div>

                  {isLoading && <p className="text-center mt-6 text-stone-500">Cargando productos...</p>}

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredProducts.map((group) => (
                        <ProductCard key={group.groupCode} group={group} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
              <GuaranteesSection />
              <ModelingCarousel products={productGroups} />
              <TestimonialsSection testimonials={testimonials} />
              <BenefitsSection />
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <MobileFilterDrawer 
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        brands={brands}
        selectedCategory={selectedCategory}
        selectedBrands={selectedBrands}
        maxPrice={maxPrice}
        onSelectCategory={handleSelectCategory}
        onToggleBrand={handleToggleBrand}
        onPriceChange={setMaxPrice}
        onClearAll={handleClearAll}
        matchedCount={filteredProducts.length}
      />
    </>
  );
}
