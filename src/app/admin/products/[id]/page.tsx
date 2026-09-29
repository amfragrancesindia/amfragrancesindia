import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductEditor } from '@/components/admin/products/ProductEditor';
import { requireAdmin } from '@/lib/auth';
import { getAdminProduct } from '@/lib/products';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getAdminProduct((await params).id);
  return { title: product ? `Edit ${product.name}` : 'Product' };
}

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  await requireAdmin(`/admin/products/${id}`);
  const product = await getAdminProduct(id);
  if (!product) notFound();
  return <ProductEditor product={product} />;
}
