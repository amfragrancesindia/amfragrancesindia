import type { Metadata } from 'next';
import { ProductEditor } from '@/components/admin/products/ProductEditor';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Add product' };

export default async function NewProductPage() {
  await requireAdmin('/admin/products/new');
  return <ProductEditor />;
}
