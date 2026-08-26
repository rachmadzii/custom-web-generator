import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Trash2,
} from 'lucide-react';
import {
  LetterContent,
  PublishedPage,
  ThemeId,
  slugify,
  validateSlug,
} from '../types';
import { deletePage, getPage, listPages, savePage } from '../db';

interface Props {
  theme: ThemeId;
  content: LetterContent;
  onNavigate: (path: string) => void;
}

export default function PublishPanel({ theme, content, onNavigate }: Props) {
  const [slug, setSlug] = useState(() => slugify(content.title) || 'surat-ku');
  const [pages, setPages] = useState<PublishedPage[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const error = validateSlug(slug);
  const origin = typeof window === 'undefined' ? '' : window.location.origin;

  const refresh = () => listPages().then(setPages).catch(() => undefined);

  useEffect(() => {
    refresh();
  }, []);

  const publish = async () => {
    if (error) return;
    setBusy(true);
    setStatus(null);
    try {
      const existing = await getPage(slug);
      const now = Date.now();
      await savePage({
        slug,
        theme,
        content,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      });
      await refresh();
      setStatus(
        existing
          ? `Halaman /${slug} berhasil diperbarui.`
          : `Halaman /${slug} berhasil dipublish.`
      );
    } catch {
      setStatus('Gagal menyimpan. Kemungkinan kuota penyimpanan penuh.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setStatus('Browser menolak akses clipboard. Salin manual, ya.');
    }
  };

  const remove = async (target: string) => {
    await deletePage(target);
    await refresh();
    setStatus(`Halaman /${target} dihapus.`);
  };

  return (
    <section className="panel">
      <h3 className="panel-title">
        <Globe size={15} />
        Publish
      </h3>

      <label className="field-label" htmlFor="f-slug">
        Alamat halaman
      </label>
      <div
        className={`flex items-center gap-0 overflow-hidden rounded-xl border bg-white transition
          focus-within:ring-4
          ${
            error
              ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100'
              : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'
          }`}
      >
        <span className="shrink-0 border-r border-slate-200 bg-slate-50 px-2.5 py-2.5 text-xs text-slate-400">
          /
        </span>
        <input
          id="f-slug"
          type="text"
          className="min-w-0 flex-1 px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onBlur={() => setSlug((s) => slugify(s))}
          placeholder="untuk-ama"
          spellCheck={false}
        />
      </div>

      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-rose-500">
          <AlertTriangle size={12} className="mt-px shrink-0" />
          {error}
        </p>
      ) : (
        <p className="mt-1.5 break-all text-[11px] text-slate-400">
          Akan tersedia di{' '}
          <span className="font-medium text-slate-600">
            {origin}/{slug}
          </span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-accent flex-1"
          onClick={publish}
          disabled={!!error || busy}
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Globe size={15} />
          )}
          Publish halaman
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onNavigate(`/${slug}`)}
          disabled={!!error}
        >
          <ExternalLink size={15} />
          Buka
        </button>
      </div>

      {status && (
        <p className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
          {status}
        </p>
      )}

      {pages.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-3.5">
          <span className="field-label">
            Sudah dipublish ({pages.length})
          </span>
          <ul className="space-y-1.5">
            {pages.map((page) => (
              <li
                key={page.slug}
                className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2"
              >
                <button
                  type="button"
                  onClick={() => onNavigate(`/${page.slug}`)}
                  className="min-w-0 flex-1 truncate text-left text-xs font-medium text-slate-700 hover:text-indigo-600"
                  title={page.content.title}
                >
                  /{page.slug}
                  <span className="ml-1.5 font-normal text-slate-400">
                    {page.content.title}
                  </span>
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => copy(`${origin}/${page.slug}`)}
                  aria-label={`Salin tautan ${page.slug}`}
                >
                  {copied === `${origin}/${page.slug}` ? (
                    <Check size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
                <button
                  type="button"
                  className="btn-icon hover:bg-rose-50 hover:text-rose-500"
                  onClick={() => remove(page.slug)}
                  aria-label={`Hapus ${page.slug}`}
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3.5 flex items-start gap-1.5 border-t border-slate-100 pt-3 text-[11px] leading-snug text-slate-400">
        <AlertTriangle size={12} className="mt-px shrink-0" />
        Halaman disimpan di IndexedDB browser ini. Tautannya bisa dibuka kapan
        saja di browser yang sama, tapi belum bisa diakses orang lain atau dari
        device lain — itu butuh backend. Untuk dikirim ke orang, pakai tombol
        Export HTML.
      </p>
    </section>
  );
}
