import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Truck, Heart, Star } from 'lucide-react';
import { useFavorites } from '../../../../shared/context/FavoritesContext';

// A helper function to format the minimum price
const formatMinPrice = (priceRange, variants) => {
  if (priceRange && priceRange.min !== undefined) {
    const minPrice = priceRange.min;
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(minPrice).replace(/\s/g, '');
  }
  if (variants && variants.length > 0) {
    const prices = variants.map(v => v.price).filter(p => p != null);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(minPrice).replace(/\s/g, '');
  }
  return '$0';
};

// Componente para mostrar las estrellas de calificación
const ProductRating = ({ rating, reviewCount }) => (
  <div className="flex items-center mb-2">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-stone-300 dark:text-stone-500"} />
      ))}
    </div>
    <span className="text-xs text-stone-500 dark:text-stone-400 ml-2">({reviewCount})</span>
  </div>
);

/**
 * A card component that displays a grouped product or single product.
 */
export default function ProductCard({ group }) {
  if (!group) {
    return null; 
  }

  // Support both grouped products (group.variants) and flat product entities
  const variants = Array.isArray(group.variants) ? group.variants : [group];
  if (variants.length === 0) {
    return null;
  }

  const { isFavorite, toggleFavorite } = useFavorites();
  const [reviewCount, setReviewCount] = useState(group.reviewCount || null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (group.reviewCount === undefined) {
      setReviewCount(Math.floor(Math.random() * 50) + 10);
    }
  }, [group.reviewCount]);

  const isSoldOut = variants.every(v => v.status === 'sold-out');
  const firstVariant = variants[0];
  const groupCode = group.groupCode || firstVariant.id;
  const groupName = group.name || firstVariant.name || 'Producto';
  const mainImage = group.mainImage || firstVariant.primaryImage || 'https://via.placeholder.com/400';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(groupCode);
  };

  const rating = group.rating || firstVariant.rating || 4;
  const displayPriceText = formatMinPrice(group.priceRange, variants);

  return (
    <Link href={`/product/${firstVariant.productSlug}-${firstVariant.id}`} className="h-full">
      <div className={`group flex flex-col h-full bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden transition-all duration-300 ${isSoldOut ? 'opacity-50 grayscale' : 'hover:shadow-lg'}`}>
        <div className="relative w-full h-64 sm:h-80 bg-stone-200 overflow-hidden">
          {isSoldOut && (
            <div className={`absolute top-3 left-3 z-10 bg-stone-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full`}>
              Agotado
            </div>
          )}
          
          {!isSoldOut && (
            <button 
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm rounded-full"
              aria-label="Añadir a favoritos"
            >
              <Heart 
                className={`transition-colors ${isMounted && isFavorite(groupCode) ? 'text-red-500 fill-current' : 'text-stone-700 dark:text-stone-300'}`} 
                size={20} 
              />
            </button>
          )}

          <img
            src={mainImage} 
            alt={groupName}
            className={`w-full h-full object-center object-cover ${!isSoldOut && 'group-hover:scale-105 transition-transform duration-300'}`}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base font-medium text-stone-800 dark:text-stone-200 min-h-[2.5rem] sm:min-h-[3rem]" title={groupName}>
            {groupName}
          </h3>
          {reviewCount !== null && <ProductRating rating={rating} reviewCount={reviewCount} />}

          <div className="flex-grow">
            <p className="text-lg font-bold text-stone-900 dark:text-white mt-2">
              {displayPriceText}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1">
              <Truck size={14} /> Envío nacional
            </span>
            <span>{variants.length} {variants.length === 1 ? 'opción' : 'opciones'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
