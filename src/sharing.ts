import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { LetterContent, ThemeId } from './types';

/**
 * Data halaman yang di-encode ke dalam URL untuk dibagikan secara publik.
 * Gambar base64 TIDAK disertakan di URL karena terlalu besar — hanya
 * caption yang ikut. Pengguna bisa pakai Export HTML kalau mau kirim
 * versi lengkap dengan gambar.
 */
export interface SharedPageData {
  t: ThemeId; // theme
  c: LetterContent; // content (tanpa imageUrl besar)
}

/**
 * Encode data halaman menjadi string yang aman untuk URL hash.
 * Gambar base64 dihilangkan supaya URL tetap ringkas.
 */
export function encodePageData(theme: ThemeId, content: LetterContent): string {
  const payload: SharedPageData = {
    t: theme,
    c: {
      ...content,
      photos: content.photos.map((p) => ({
        ...p,
        imageUrl: p.imageUrl.startsWith('data:') ? '' : p.imageUrl,
      })),
    },
  };
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

/**
 * Decode data halaman dari URL hash.
 * Mengembalikan null kalau data tidak valid.
 */
export function decodePageData(
  encoded: string
): { theme: ThemeId; content: LetterContent } | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const data: SharedPageData = JSON.parse(json);
    if (!data.t || !data.c) return null;
    return { theme: data.t, content: data.c };
  } catch {
    return null;
  }
}
