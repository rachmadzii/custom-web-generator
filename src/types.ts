export type ThemeId = 'ocean' | 'sunset' | 'sky' | 'lake';

export interface PhotoCard {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface LetterContent {
  title: string;
  subtitle: string;
  greeting: string;
  paragraphs: string[];
  quote: string;
  closing: string;
  signature: string;
  footerText: string;
  photos: PhotoCard[];
}

export interface PublishedPage {
  slug: string;
  theme: ThemeId;
  content: LetterContent;
  createdAt: number;
  updatedAt: number;
}

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  source: string;
  description: string;
  previewGradient: string;
  /** apakah tema aslinya punya blok kutipan */
  hasQuote: boolean;
  /** apakah tema aslinya punya footer */
  hasFooter: boolean;
  /** apakah tema aslinya menampilkan caption di kartu foto */
  hasCaption: boolean;
  darkPreview: boolean;
}

export const THEMES: ThemeInfo[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    source: 'project-aca-done',
    description: 'Biru laut, ombak SVG, awan, dan sparkle',
    previewGradient: 'linear-gradient(to bottom, #bae6fd, #dbeafe, #fef3c7)',
    hasQuote: true,
    hasFooter: true,
    hasCaption: true,
    darkPreview: false,
  },
  {
    id: 'sunset',
    name: 'Sunset',
    source: 'project-aren-done',
    description: 'Gradien pink-peach dengan awan melayang',
    previewGradient:
      'linear-gradient(to bottom, #ffd6e8, #ffabcc, #ff9fb8, #ffc995)',
    hasQuote: false,
    hasFooter: false,
    hasCaption: true,
    darkPreview: false,
  },
  {
    id: 'sky',
    name: 'Sky',
    source: 'project-arlon-done',
    description: 'Langit biru cerah, awan dua arah, glass card',
    previewGradient: 'linear-gradient(to bottom, #bae6fd, #e0f2fe, #f0f9ff)',
    hasQuote: false,
    hasFooter: true,
    hasCaption: false,
    darkPreview: false,
  },
  {
    id: 'lake',
    name: 'Lake',
    source: 'project-kak-ail-done',
    description: 'Danau hijau teal, tekstur air, shimmer',
    previewGradient: 'linear-gradient(to bottom, #1a4d4d, #2d6b7f, #4a7c8f)',
    hasQuote: true,
    hasFooter: true,
    hasCaption: true,
    darkPreview: true,
  },
];

export function getTheme(id: ThemeId): ThemeInfo {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** Placeholder dipakai sebagai src <img> supaya elemen & CSS tema tetap identik. */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#e8eaed"/>
      <g fill="none" stroke="#b0b6bd" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="140" y="205" width="120" height="90" rx="12"/>
        <path d="M170 205l12-18h36l12 18"/>
        <circle cx="200" cy="252" r="22"/>
      </g>
      <text x="200" y="340" font-family="sans-serif" font-size="20" fill="#9aa1a9" text-anchor="middle">Belum ada gambar</text>
    </svg>`
  );

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateSlug(slug: string): string | null {
  if (!slug) return 'Nama halaman tidak boleh kosong.';
  if (slug.length < 3) return 'Minimal 3 karakter.';
  if (slug.length > 60) return 'Maksimal 60 karakter.';
  if (!SLUG_PATTERN.test(slug))
    return 'Hanya huruf kecil, angka, dan tanda hubung (-).';
  return null;
}

export const DEFAULT_CONTENT: LetterContent = {
  title: 'Surat Kecil Untukmu',
  subtitle: 'Sebuah surat yang kutulis dengan sepenuh hati',
  greeting: 'Hai, kamu!',
  paragraphs: [
    'Selamat datang di penghujung tahun ini! Semoga bersamaan dengan sampainya surat ini, kamu sedang dalam kondisi baik dan sehat.',
    'Aku mau bilang terima kasih sudah menjadi bagian dari ceritaku tahun ini. Kehadiran kamu berarti lebih banyak daripada yang mungkin kamu sadari.',
    'Mungkin ada banyak hal sulit yang kamu lalui sendiri. Tapi kamu berhasil sampai ke titik ini, dan itu hebat. Jangan lupa mengapresiasi diri kamu sendiri, ya?',
    'Semoga di tahun yang akan datang, lebih banyak kebahagiaan dan kebaikan yang datang ke kamu. Lebih banyak sehatnya, lebih banyak istirahatnya, lebih banyak senangnya.',
    'Kalau suatu saat kamu butuh teman cerita, jangan sungkan menghubungi aku, ya? Aku akan selalu ada di sini.',
  ],
  quote:
    'Kamu lebih kuat dari yang kamu kira. Seperti laut yang dalam, ada begitu banyak kekuatan dalam diri kamu yang bahkan mungkin belum kamu sadari.',
  closing: 'Dengan hangat dan penuh cinta,',
  signature: 'Dari seseorang yang menyayangimu.',
  footerText: 'Ditulis dengan 💖',
  photos: [
    { id: 'p1', imageUrl: '', caption: 'Caption untuk foto pertama' },
    { id: 'p2', imageUrl: '', caption: 'Caption untuk foto kedua' },
    { id: 'p3', imageUrl: '', caption: 'Caption untuk foto ketiga' },
  ],
};
