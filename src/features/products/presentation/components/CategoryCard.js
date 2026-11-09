import Link from 'next/link';
import { useState } from 'react';

export default function CategoryCard({ category }) {
  const displayName = category.name.charAt(0).toUpperCase() + category.name.slice(1);
  const defaultImage = '/images/logo.png';
  const [imgSrc, setImgSrc] = useState(category.image || defaultImage);

  return (
    <Link href={`/category/${category.name.toLowerCase()}`} className="flex-shrink-0 group">
      {/* Mobile view: Tag-like */}
      <div className="md:hidden bg-blue-500 dark:bg-blue-800 rounded-full py-2 px-5">
        <p className="text-stone-50 dark:text-stone-100 font-semibold whitespace-nowrap">{displayName}</p>
      </div>

      {/* Desktop view: Full card */}
      <div className="hidden md:flex items-center bg-white dark:bg-blue-800 rounded-lg shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300 w-80">
        <div className="w-1/3 h-32 bg-stone-100 flex items-center justify-center overflow-hidden">
          <img 
            src={imgSrc} 
            alt={`Categoría ${displayName}`} 
            className="object-cover h-full w-full"
            onError={() => setImgSrc(defaultImage)}
          />
        </div>
        <div className="w-2/3 p-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white truncate" title={displayName}>{displayName}</h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{category.productCount} productos</p>
          <div className="inline-block mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Ver más &rarr;
          </div>
        </div>
      </div>
    </Link>
  );
}
