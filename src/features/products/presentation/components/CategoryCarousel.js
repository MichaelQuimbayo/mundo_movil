import { useRef, useState, useEffect, useMemo } from 'react';
import CategoryCard from './CategoryCard';
import Link from 'next/link';
import { useProducts } from '../../infrastructure/data/useProducts';

const ArrowButton = ({ direction, onClick, isVisible }) => (
  <div className={`absolute top-0 bottom-0 hidden md:flex items-center z-10 ${direction === 'left' ? 'left-0' : 'right-0'}`}>
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      className={`rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-stone-800/80 dark:hover:bg-stone-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
      <svg className="h-6 w-6 text-stone-900 dark:text-stone-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  </div>
);

export default function CategoryCarousel() {
  const { products } = useProducts();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const catMap = new Map();
    for (const group of products) {
      const catName = group.category || 'General';
      if (!catMap.has(catName)) {
        catMap.set(catName, {
          name: catName,
          productCount: 0,
          image: group.mainImage || '/images/logo.png',
        });
      }
      const data = catMap.get(catName);
      data.productCount += 1;
      if ((!data.image || data.image.includes('placeholder')) && group.mainImage) {
        data.image = group.mainImage;
      }
    }
    return Array.from(catMap.values());
  }, [products]);

  const fallbackCategories = [
    { name: 'celulares', productCount: 0, image: '/images/logo.png' },
    { name: 'smartwatches', productCount: 0, image: '/images/logo.png' },
  ];
  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(hasOverflow && Math.ceil(el.scrollLeft) < el.scrollWidth - el.clientWidth);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollability();
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);
      el.addEventListener('scroll', checkScrollability, { passive: true });
      return () => {
        resizeObserver.unobserve(el);
        el.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [displayCategories]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  
  return (
    <div className=" sm:py-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12 ">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">Explora por categoría</h2>
          <Link href="/shop" className="hidden sm:inline-block text-blue-600 dark:text-blue-400 font-semibold py-2 px-4 rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors">Ver todos los productos &rarr;</Link>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div 
            ref={scrollContainerRef}
            className="flex items-center space-x-4 md:space-x-8 overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x category-carousel hide-scrollbar-on-desktop pb-4"
          >
            {displayCategories.map((category) => (
              <div key={category.name} className="snap-start">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>

          <ArrowButton direction="left" onClick={() => scroll('left')} isVisible={canScrollLeft} />
          <ArrowButton direction="right" onClick={() => scroll('right')} isVisible={canScrollRight} />
        </div>
      </div>
    </div>
  );
}
