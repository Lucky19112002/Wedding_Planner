import { supabase } from '@/lib/supabase';
import type { OutfitImage } from '@/types/domain';

const bucket = 'outfit-references';
const maxImages = 5;
const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const signedUrlTtlSeconds = 60 * 30;
const signedUrlCache = new Map<string, { expiresAt: number; url: string }>();

type OutfitImageRow = {
  id: string;
  outfit_id: string;
  wedding_id: string;
  storage_path: string;
  sort_order: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type UploadImageInput = {
  file: File;
  outfitId: string;
  weddingId: string;
  existingCount: number;
  onProgress?: (progress: number) => void;
};

const imageSelect = 'id,outfit_id,wedding_id,storage_path,sort_order,archived_at,created_at,updated_at';

function mapImage(row: OutfitImageRow, signedUrl: string | null = null): OutfitImage {
  return {
    id: row.id,
    outfitId: row.outfit_id,
    weddingId: row.wedding_id,
    storagePath: row.storage_path,
    sortOrder: row.sort_order,
    signedUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function assertImageFile(file: File) {
  if (!acceptedImageTypes.includes(file.type)) {
    throw new Error('Use a JPG, PNG, or WEBP image.');
  }
}

function safeFileName(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${crypto.randomUUID()}.${extension.replace(/[^a-z0-9]/g, '')}`;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be read.'));
    };
    image.src = url;
  });
}

async function compressImage(file: File): Promise<Blob> {
  assertImageFile(file);
  const image = await loadImage(file);
  const maxEdge = 1800;
  const ratio = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));
  const context = canvas.getContext('2d');
  if (!context) return file;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, 0.82));
  return blob && blob.size < file.size ? blob : file;
}

async function signedUrlForPath(storagePath: string): Promise<string> {
  const cached = signedUrlCache.get(storagePath);
  if (cached && cached.expiresAt > Date.now()) return cached.url;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, signedUrlTtlSeconds);
  if (error) throw error;

  signedUrlCache.set(storagePath, {
    expiresAt: Date.now() + (signedUrlTtlSeconds - 60) * 1000,
    url: data.signedUrl,
  });
  return data.signedUrl;
}

async function mapWithSignedUrls(rows: OutfitImageRow[]): Promise<OutfitImage[]> {
  return Promise.all(
    rows.map(async (row) => mapImage(row, await signedUrlForPath(row.storage_path))),
  );
}

export async function getSignedUrl(storagePath: string): Promise<string> {
  return signedUrlForPath(storagePath);
}

export async function getOutfitImages(outfitId: string): Promise<OutfitImage[]> {
  const { data, error } = await supabase
    .from('outfit_images')
    .select(imageSelect)
    .eq('outfit_id', outfitId)
    .is('archived_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return mapWithSignedUrls((data ?? []) as OutfitImageRow[]);
}

export async function uploadImage({
  existingCount,
  file,
  onProgress,
  outfitId,
  weddingId,
}: UploadImageInput): Promise<OutfitImage> {
  if (existingCount >= maxImages) throw new Error('An outfit can have up to 5 images.');
  onProgress?.(10);
  const compressed = await compressImage(file);
  onProgress?.(35);
  const storagePath = `${weddingId}/${outfitId}/${safeFileName(file)}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, compressed, {
    cacheControl: '3600',
    contentType: compressed.type || file.type,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  onProgress?.(70);

  const { data, error } = await supabase
    .from('outfit_images')
    .insert({
      outfit_id: outfitId,
      wedding_id: weddingId,
      storage_path: storagePath,
      sort_order: existingCount + 1,
    })
    .select(imageSelect)
    .single<OutfitImageRow>();

  if (error) {
    await supabase.storage.from(bucket).remove([storagePath]);
    throw error;
  }
  onProgress?.(100);
  return mapImage(data, await signedUrlForPath(data.storage_path));
}

export async function deleteImage(image: OutfitImage): Promise<void> {
  const { error: rowError } = await supabase.from('outfit_images').delete().eq('id', image.id);
  if (rowError) throw rowError;
  signedUrlCache.delete(image.storagePath);
  const { error: storageError } = await supabase.storage.from(bucket).remove([image.storagePath]);
  if (storageError) throw storageError;
}

export async function reorderImages(images: OutfitImage[]): Promise<OutfitImage[]> {
  if (images.length === 0) return [];

  const results = await Promise.all(
    images.map((image, index) =>
      supabase.from('outfit_images').update({ sort_order: index + 1 }).eq('id', image.id),
    ),
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
  return getOutfitImages(images[0]?.outfitId ?? '');
}

export async function setPrimaryImage(images: OutfitImage[], imageId: string): Promise<OutfitImage[]> {
  const selected = images.find((image) => image.id === imageId);
  if (!selected) return images;
  const ordered = [selected, ...images.filter((image) => image.id !== imageId)];
  return reorderImages(ordered);
}
