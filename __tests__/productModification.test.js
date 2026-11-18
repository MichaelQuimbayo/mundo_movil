import { isProductModification } from '../src/features/products/infrastructure/mappers/ProductMapper';

describe('isProductModification helper', () => {
  it('should identify product modifications by direct flags', () => {
    expect(isProductModification({ is_modification: true })).toBe(true);
    expect(isProductModification({ is_modifier: 'SI' })).toBe(true);
    expect(isProductModification({ is_product_modification: 1 })).toBe(true);
    expect(isProductModification({ modificacion: true })).toBe(true);
  });

  it('should identify product modifications by type or labels', () => {
    expect(isProductModification({ type: 'modificacion' })).toBe(true);
    expect(isProductModification({ labels: [{ entity_type: 'is_modification', value: 'SI' }] })).toBe(true);
    expect(isProductModification({ features: [{ entity_type: 'modificacion', value: 'true' }] })).toBe(true);
  });

  it('should return false for regular products', () => {
    expect(isProductModification({ id: '1', name: 'iPhone 17 Pro Max', is_modification: false })).toBe(false);
    expect(isProductModification({ id: '2', name: 'Samsung Galaxy A17', features: [{ entity_type: 'brand', value: 'Samsung' }] })).toBe(false);
  });
});
