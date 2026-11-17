'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search as SearchIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../../features/products/infrastructure/data/useProducts';

const SearchModal = ({ open, onClose, query, setQuery }) => {
  const { products } = useProducts();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Filter products based on query
  const matchingProducts = products && query ? products.filter(group => {
    const q = query.toLowerCase().trim();
    const nameMatch = group.name.toLowerCase().includes(q);
    const brandMatch = (group.brand || '').toLowerCase().includes(q);
    const categoryMatch = (group.category || '').toLowerCase().includes(q);
    return nameMatch || brandMatch || categoryMatch;
  }).slice(0, 6) : [];

  const modalContent = (
    <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
    >
        <div
            className="mx-auto mt-[10vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-700 px-5 py-4">
                <SearchIcon className="h-5 w-5 text-gray-400" />
                <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar celulares, marcas, accesorios..."
                    className="flex-1 bg-transparent outline-none text-sm text-stone-900 dark:text-stone-100"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="text-gray-400 hover:text-stone-600">
                        <X size={16} />
                    </button>
                )}
                <button onClick={onClose} className="text-xs font-medium text-gray-500 dark:text-gray-400 border border-stone-200 dark:border-stone-700 px-2 py-1 rounded">ESC</button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
                {query ? (
                    matchingProducts.length > 0 ? (
                        <div className="space-y-2">
                            <p className="px-2 text-xs font-medium uppercase text-gray-400">Productos encontrados ({matchingProducts.length})</p>
                            {matchingProducts.map(group => {
                                const firstVariant = group.variants?.[0];
                                const minPrice = group.priceRange?.min || firstVariant?.price || 0;
                                const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(minPrice);
                                
                                return (
                                    <Link 
                                        key={group.groupCode}
                                        href={`/product/${firstVariant?.productSlug}-${firstVariant?.id}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                {group.mainImage ? (
                                                    <img src={group.mainImage} alt={group.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">IMG</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-blue-600 transition-colors">{group.name}</p>
                                                <p className="text-xs text-stone-500 capitalize">{group.category} · <span className="font-semibold">{group.brand}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{formattedPrice}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No se encontraron productos para "<strong>{query}</strong>".
                        </div>
                    )
                ) : (
                    <div className="py-12 text-center text-sm text-gray-400">
                        Escribe el nombre de un celular, marca o categoría para buscar...
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!open || !isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export default function Search({ searchTerm, onSearchChange }) {
    const [open, setOpen] = useState(false);
    const [internalQuery, setInternalQuery] = useState("");

    const query = searchTerm !== undefined ? searchTerm : internalQuery;
    const setQuery = onSearchChange || setInternalQuery;

    // Renderiza un botón diferente en móvil vs escritorio
    const trigger = (
      <button onClick={() => setOpen(true)} className="p-2 text-stone-500 lg:flex lg:w-full lg:max-w-xl lg:items-center lg:gap-3 lg:rounded-lg lg:border lg:border-gray-300 lg:bg-stone-50 lg:px-4 lg:py-2.5 lg:text-sm lg:text-gray-500 lg:shadow-sm lg:dark:bg-stone-800 lg:dark:border-stone-700">
          {/* Icono en móvil */}
          <div className="lg:hidden">
            <SearchIcon size={24} />
          </div>
          {/* Botón completo en escritorio */}
          <div className="hidden lg:flex items-center w-full">
            <SearchIcon className="h-5 w-5 mr-2 text-gray-400" />
            <span className="truncate">{query ? `Buscando: "${query}"` : "Buscar productos, marcas o categorías..."}</span>
            <kbd className="ml-auto rounded border px-2 py-1 text-xs dark:border-stone-600 bg-white dark:bg-stone-900">Ctrl K</kbd>
          </div>
        </button>
    );

    return (
      <>
        {trigger}
        <SearchModal open={open} onClose={() => setOpen(false)} query={query} setQuery={setQuery} />
      </>
    );
}
