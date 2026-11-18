import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from '../src/features/products/presentation/components/ProductCard';
import '@testing-library/jest-dom';

// Mock del componente Link de Next.js
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock de FavoritesContext
jest.mock('../src/shared/context/FavoritesContext', () => ({
  useFavorites: () => ({
    isFavorite: () => false,
    toggleFavorite: () => {}
  })
}));

describe('ProductCard Component', () => {
  const groupedProductWithMinPrice = {
    groupCode: 'g1',
    name: 'Producto sin Descuento',
    mainImage: 'test2.jpg',
    priceRange: { min: 50000, max: 50000 },
    variants: [
      { id: '2', name: 'Producto sin Descuento', price: 50000, productSlug: 'producto-sin-descuento', status: 'available' }
    ]
  };

  it('debe mostrar el precio y el nombre del producto', () => {
    render(<ProductCard group={groupedProductWithMinPrice} />);

    expect(screen.getByText('Producto sin Descuento')).toBeInTheDocument();
    expect(screen.getByText('$50.000')).toBeInTheDocument();
  });

  it('debe mostrar la cantidad de opciones disponibles', () => {
    render(<ProductCard group={groupedProductWithMinPrice} />);
    
    expect(screen.getByText('1 opción')).toBeInTheDocument();
  });
});
