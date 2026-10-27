import { groupProducts } from '../src/features/products/application/services/productGrouping';
import { ProductEntity } from '../src/features/products/domain/entities/ProductEntity';

describe('productGrouping service', () => {
  it('should group products by grupo_producto feature', () => {
    const materials = [
      new ProductEntity({
        id: '1',
        name: 'iPhone 17 Pro Max',
        price: 5000000,
        features: [
          { entity_type: 'grupo_producto', value: 'i17pm' },
          { entity_type: 'color', value: 'Naranja' },
          { entity_type: 'almacenamiento', value: '512 GB' }
        ]
      }),
      new ProductEntity({
        id: '2',
        name: 'iPhone 17 Pro Max',
        price: 4500000,
        features: [
          { entity_type: 'grupo_producto', value: 'i17pm' },
          { entity_type: 'color', value: 'Naranja' },
          { entity_type: 'almacenamiento', value: '256 GB' }
        ]
      })
    ];

    const grouped = groupProducts(materials);
    expect(grouped.length).toBe(1);
    expect(grouped[0].groupCode).toBe('i17pm');
    expect(grouped[0].variants.length).toBe(2);
    expect(grouped[0].priceRange.min).toBe(4500000);
    expect(grouped[0].priceRange.max).toBe(5000000);
  });
});
