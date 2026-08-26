import { LetterContent, PublishedPage, ThemeId } from './types';

/**
 * Penyimpanan pakai IndexedDB, bukan localStorage.
 * Alasannya: gambar disimpan sebagai data URL base64, dan 3 foto saja sudah
 * bisa melewati kuota ~5MB milik localStorage. IndexedDB jauh lebih longgar.
 *
 * Catatan penting: ini penyimpanan per-browser. Halaman yang dipublish bisa
 * dibuka lewat URL-nya di browser yang sama, tapi tidak otomatis bisa diakses
 * orang lain atau dari device lain — itu butuh backend.
 */

const DB_NAME = 'custom-web-generator';
const DB_VERSION = 1;
const PAGES = 'pages';
const META = 'meta';
const DRAFT_KEY = 'draft';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PAGES)) {
        db.createObjectStore(PAGES, { keyPath: 'slug' });
      }
      if (!db.objectStoreNames.contains(META)) {
        db.createObjectStore(META);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const request = run(transaction.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
  );
}

export interface Draft {
  theme: ThemeId;
  content: LetterContent;
}

export function saveDraft(draft: Draft): Promise<unknown> {
  return tx(META, 'readwrite', (s) => s.put(draft, DRAFT_KEY));
}

export function loadDraft(): Promise<Draft | undefined> {
  return tx<Draft | undefined>(META, 'readonly', (s) => s.get(DRAFT_KEY));
}

export function savePage(page: PublishedPage): Promise<unknown> {
  return tx(PAGES, 'readwrite', (s) => s.put(page));
}

export function getPage(slug: string): Promise<PublishedPage | undefined> {
  return tx<PublishedPage | undefined>(PAGES, 'readonly', (s) => s.get(slug));
}

export function listPages(): Promise<PublishedPage[]> {
  return tx<PublishedPage[]>(PAGES, 'readonly', (s) => s.getAll()).then(
    (pages) => pages.sort((a, b) => b.updatedAt - a.updatedAt)
  );
}

export function deletePage(slug: string): Promise<unknown> {
  return tx(PAGES, 'readwrite', (s) => s.delete(slug));
}
