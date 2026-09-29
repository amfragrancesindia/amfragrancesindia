// Browser-only: shrinks a photo before it is uploaded, so product photos stay
// small (fast pages) no matter how large the original camera file is.

const MAX_EDGE = 1600;

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Resizes to at most 1600 px on the longest side and encodes as WebP (JPEG where WebP isn't available). */
export async function compressImage(file: File): Promise<Blob> {
  const options = { imageOrientation: 'from-image' } as ImageBitmapOptions;
  const bitmap = await createImageBitmap(file, options).catch(() => null);
  if (!bitmap) throw new Error(`${file.name}: this photo format isn’t supported. Please use JPG, PNG or WebP.`);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error(`${file.name}: the photo could not be processed.`);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await canvasBlob(canvas, 'image/webp', 0.86);
  if (webp && webp.type === 'image/webp') return webp;

  // Older Safari can't encode WebP: use JPEG on a white background instead.
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  const jpeg = await canvasBlob(canvas, 'image/jpeg', 0.88);
  if (!jpeg) throw new Error(`${file.name}: the photo could not be processed.`);
  return jpeg;
}
