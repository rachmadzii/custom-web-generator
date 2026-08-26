/**
 * Menyusun urutan blok isi surat.
 *
 * Tema asli menaruh ikon pemisah di posisi yang di-hardcode (mis. Ocean:
 * setelah paragraf ke-2 dan ke-6). Karena jumlah paragraf di sini dinamis,
 * pemisah disebar merata setiap `every` paragraf dengan ikon yang berputar.
 * Ini keputusan tata letak konten, bukan perubahan style — elemen dan class
 * pemisahnya tetap sama dengan aslinya.
 */
export type LetterBlock =
  | { kind: 'paragraph'; text: string; index: number }
  | { kind: 'divider'; iconIndex: number };

export function buildBlocks(
  paragraphs: string[],
  dividerCount: number,
  every = 3
): LetterBlock[] {
  const blocks: LetterBlock[] = [];
  if (dividerCount <= 0) {
    return paragraphs.map((text, index) => ({
      kind: 'paragraph' as const,
      text,
      index,
    }));
  }

  let placed = 0;
  paragraphs.forEach((text, index) => {
    blocks.push({ kind: 'paragraph', text, index });
    const isLast = index === paragraphs.length - 1;
    if (!isLast && (index + 1) % every === 0) {
      blocks.push({ kind: 'divider', iconIndex: placed % dividerCount });
      placed += 1;
    }
  });

  return blocks;
}
