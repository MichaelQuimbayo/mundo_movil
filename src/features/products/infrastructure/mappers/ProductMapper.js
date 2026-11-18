import { ProductEntity } from '../../domain/entities/ProductEntity.js';

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\\w\\-]+/g, '')       // Remove all non-word chars
    .replace(/\\-\\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Checks if a raw material from the API is a product modification (only for POS, not for web display).
 * @param {object} rawMaterial The raw material object from the API.
 * @returns {boolean} True if it is a product modification.
 */
export const isProductModification = (rawMaterial) => {
  if (!rawMaterial) return false;

  // Check direct boolean/string/number properties
  if (
    rawMaterial.is_modification === true ||
    rawMaterial.is_modification === 'SI' ||
    rawMaterial.is_modification === 1 ||
    rawMaterial.is_modification === 'true' ||
    rawMaterial.is_modifier === true ||
    rawMaterial.is_modifier === 'SI' ||
    rawMaterial.is_modifier === 1 ||
    rawMaterial.is_modifier === 'true' ||
    rawMaterial.is_product_modification === true ||
    rawMaterial.is_product_modification === 'SI' ||
    rawMaterial.is_product_modification === 1 ||
    rawMaterial.modificacion === true ||
    rawMaterial.modificacion === 'SI' ||
    rawMaterial.modificacion === 1
  ) {
    return true;
  }

  // Check type feature or property
  const typeFeature = rawMaterial.features?.find(f => f.entity_type === 'type');
  if (
    rawMaterial.type === 'modificacion' ||
    rawMaterial.type === 'modification' ||
    rawMaterial.type === 'modifier' ||
    typeFeature?.value === 'modificacion' ||
    typeFeature?.value === 'modification' ||
    typeFeature?.value === 'modifier'
  ) {
    return true;
  }

  // Check labels
  if (Array.isArray(rawMaterial.labels)) {
    const hasModLabel = rawMaterial.labels.some(l => {
      const et = (l.entity_type || '').toLowerCase();
      const val = (l.value || '').toString().toLowerCase();
      return (
        (et.includes('modification') || et.includes('modificacion') || et.includes('modifier')) &&
        (val === 'si' || val === 'true' || val === '1')
      );
    });
    if (hasModLabel) return true;
  }

  // Check features
  if (Array.isArray(rawMaterial.features)) {
    const hasModFeature = rawMaterial.features.some(f => {
      const et = (f.entity_type || '').toLowerCase();
      const val = (f.value || '').toString().toLowerCase();
      return (
        (et.includes('modification') || et.includes('modificacion') || et.includes('modifier')) &&
        (val === 'si' || val === 'true' || val === '1')
      );
    });
    if (hasModFeature) return true;
  }

  return false;
};

/**
 * Maps a raw API material object to a clean ProductEntity.
 * @param {object} rawMaterial The raw material object from the API.
 * @returns {ProductEntity} An instance of the clean ProductEntity.
 */
export const toDomain = (rawMaterial) => {
  const id = rawMaterial.id;

  // --- Robust Name Extraction ---
  // Ensure descriptions is an array before trying to process it.
  // Fallback to a top-level `name` property if descriptions are missing.
  const name = (Array.isArray(rawMaterial.descriptions) && rawMaterial.descriptions.find(d => d.lang === 'es-co')?.value) ||
               (Array.isArray(rawMaterial.descriptions) && rawMaterial.descriptions[0]?.value) ||
               rawMaterial.name || // Fallback for items that might have a direct name property
               'Producto sin Nombre'; // Final fallback

  // Description from features array
  const description = rawMaterial.features?.find(f => f.entity_type === 'description')?.value || 
                      'Descripción no disponible';

  const slug = slugify(name);

  // Price from values
  const priceValue = rawMaterial.values?.find(v => v.entity_type === 'price')?.value || 0;
  const originalPriceValue = rawMaterial.values?.find(v => v.entity_type === 'original_price')?.value || null;

  // Stock from values
  const stockValue = rawMaterial.values?.find(v => v.entity_type === 'inventory')?.value || 0;

  // Status from labels and stock
  const isActiveLabel = rawMaterial.labels?.find(l => l.entity_type === 'is_product_active');
  const isProductActive = isActiveLabel?.value === 'SI';
  const status = isProductActive && stockValue > 0 ? 'available' : 'sold-out';

  // Rating and category are not consistently present in sample, defaulting
  const rating = rawMaterial.values?.find(v => v.entity_type === 'rating')?.value || 0;
  const category = rawMaterial.labels?.find(l => l.entity_type === 'category')?.value ||
                   rawMaterial.labels?.find(l => l.entity_type === 'material')?.value ||
                   rawMaterial.material ||
                   rawMaterial.features?.find(f => f.entity_type === 'material')?.value ||
                   'General';

  const brand = rawMaterial.labels?.find(l => l.entity_type === 'brand' || l.entity_type === 'marca' || l.entity_type === 'fabricante')?.value ||
                rawMaterial.features?.find(f => f.entity_type === 'brand' || f.entity_type === 'marca' || f.entity_type === 'fabricante')?.value ||
                null;

  // imageUrl will be a placeholder, primaryImage getter in ProductEntity will handle resources
  const imageUrl = 'https://via.placeholder.com/150';

  return new ProductEntity({
    id: id,
    name: name,
    slug: slug,
    originalPrice: originalPriceValue,
    price: priceValue,
    description: description,
    status: status,
    rating: rating,
    category: category,
    brand: brand,
    imageUrl: imageUrl,
    stock: stockValue,
    codes: rawMaterial.codes,       // Pass raw codes
    features: rawMaterial.features, // Pass raw features
    resources: rawMaterial.resources, // Pass raw resources
    labels: rawMaterial.labels,     // Pass raw labels
  });
};
