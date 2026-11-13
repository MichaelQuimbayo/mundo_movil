import React, { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';

// 1. Barra superior de píldoras (chips) para marcas rápidas
export function QuickBrandsBar({ brands, selectedBrands, onSelectBrand }) {
  return (
    <div className="flex items-center space-x-3 overflow-x-auto py-3 no-scrollbar">
      <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 whitespace-nowrap">
        Explora por marca rápida:
      </span>
      {brands.map((brand) => {
        const isSelected = selectedBrands.includes(brand.id);
        return (
          <button
            key={brand.id}
            onClick={() => onSelectBrand(brand.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
            }`}
          >
            {brand.name}
          </button>
        );
      })}
    </div>
  );
}

// 2. Sidebar izquierdo con categorías y marcas (checkboxes)
export function FilterSidebar({ categories, brands, selectedCategory, selectedBrands, onSelectCategory, onToggleBrand, onSearchBrand, brandSearchQuery }) {
  return (
    <aside className="w-64 bg-white dark:bg-stone-800 p-6 rounded-xl border border-stone-200 dark:border-stone-700 space-y-6 hidden lg:block h-fit sticky top-24">
      {/* Categorías */}
      <div>
        <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-3">Categorías</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700/50'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-stone-400">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-stone-200 dark:border-stone-700" />

      {/* Marcas con checkboxes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Marcas</h3>
          <span className="text-xs text-stone-400">Multiselección</span>
        </div>
        
        {/* Buscador de marcas interno */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar marca..."
            value={brandSearchQuery || ''}
            onChange={(e) => onSearchBrand(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => {
            const isChecked = selectedBrands.includes(brand.id);
            return (
              <label key={brand.id} className="flex items-center justify-between cursor-pointer group text-sm">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand.id)}
                    className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white">
                    {brand.name}
                  </span>
                </div>
                <span className="text-xs text-stone-400">{brand.count}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// 3. Barra de Filtros Activos con botones de remover "X"
export function ActiveFiltersBar({ selectedCategory, selectedBrands, categories, brands, onRemoveCategory, onRemoveBrand, onClearAll }) {
  const hasActiveFilters = (selectedCategory && selectedCategory !== 'todos') || selectedBrands.length > 0;

  if (!hasActiveFilters) return null;

  const categoryName = categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm text-stone-500">Filtros aplicados:</span>

      {selectedCategory && selectedCategory !== 'todos' && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Categoría: {categoryName}
          <button onClick={onRemoveCategory} className="ml-1.5 hover:text-blue-900 dark:hover:text-white">
            <X size={14} />
          </button>
        </span>
      )}

      {selectedBrands.map((brandId) => {
        const brandName = brands.find(b => b.id === brandId)?.name || brandId;
        return (
          <span key={brandId} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
            Marca: {brandName}
            <button onClick={() => onRemoveBrand(brandId)} className="ml-1.5 hover:text-stone-900 dark:hover:text-white">
              <X size={14} />
            </button>
          </span>
        );
      })}

      <button
        onClick={onClearAll}
        className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 ml-2 underline"
      >
        Limpiar todos
      </button>
    </div>
  );
}

// 4. Botón móvil "Filtros y Marcas"
export function MobileFilterButton({ onClick, activeCount }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 transition-colors"
    >
      <SlidersHorizontal size={18} />
      <span>Filtros y Marcas</span>
      {activeCount > 0 && (
        <span className="ml-1 bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}

// 5. Drawer / Bottom Sheet móvil con acordeón
export function MobileFilterDrawer({ 
  isOpen, 
  onClose, 
  categories, 
  brands, 
  selectedCategory, 
  selectedBrands, 
  onSelectCategory, 
  onToggleBrand, 
  onClearAll, 
  matchedCount 
}) {
  const [openSection, setOpenSection] = useState('categories');

  if (!isOpen) return null;

  const activeCount = (selectedCategory && selectedCategory !== 'todos' ? 1 : 0) + selectedBrands.length;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 h-full flex flex-col shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Filtros y Marcas</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'categories' ? null : 'categories')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white font-semibold text-sm"
            >
              <span>Categorías</span>
              <ChevronDown size={18} className={`transition-transform ${openSection === 'categories' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'categories' && (
              <div className="p-4 space-y-2 bg-white dark:bg-stone-900">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-stone-400">{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'brands' ? null : 'brands')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-white font-semibold text-sm"
            >
              <span>Marcas</span>
              <ChevronDown size={18} className={`transition-transform ${openSection === 'brands' ? 'rotate-180' : ''}`} />
            </button>
            {openSection === 'brands' && (
              <div className="p-4 space-y-3 bg-white dark:bg-stone-900 max-h-60 overflow-y-auto">
                {brands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand.id);
                  return (
                    <label key={brand.id} className="flex items-center justify-between cursor-pointer text-sm">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleBrand(brand.id)}
                          className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-stone-700 dark:text-stone-300">{brand.name}</span>
                      </div>
                      <span className="text-xs text-stone-400">{brand.count}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="w-full py-2 text-center text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>

        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Ver {matchedCount} productos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
