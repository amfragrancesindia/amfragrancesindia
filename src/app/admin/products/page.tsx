import type { Metadata } from 'next';
import { ProductsTable } from '@/components/admin/products/ProductsTable';
import { requireAdmin } from '@/lib/auth';
import { getAdminProducts } from '@/lib/products';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  await requireAdmin('/admin/products');
  const products = await getAdminProducts();
  return <ProductsTable products={products} />;
}
