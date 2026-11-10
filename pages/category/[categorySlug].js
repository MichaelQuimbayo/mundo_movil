import CategoryPage from '../../src/features/products/presentation/pages/CategoryPage';
import { InMemoryProductRepository } from '../../src/features/products/infrastructure/repositories/InMemoryProductRepository';
import { GetProductsByCategory } from '../../src/features/products/application/useCases/GetProductsByCategory';
import { GetAllProducts } from '../../src/features/products/application/useCases/GetAllProducts';

export default CategoryPage;

export async function getStaticPaths() {
  try {
    const productRepository = new InMemoryProductRepository();
    const getAllProducts = new GetAllProducts(productRepository);
    const products = await getAllProducts.execute();

    const categories = new Set();
    if (products) {
      products.forEach(group => {
        if (group.category) {
          categories.add(group.category.toLowerCase().trim());
        }
      });
    }

    const paths = Array.from(categories).map(categorySlug => ({
      params: { categorySlug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error("Error generating static paths for categories:", error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps(context) {
  const { categorySlug } = context.params;

  const productRepository = new InMemoryProductRepository();
  const getProductsByCategory = new GetProductsByCategory(productRepository);
  const products = await getProductsByCategory.execute(categorySlug);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categoryName: categorySlug,
    },
    revalidate: 3600,
  };
}
