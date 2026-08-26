import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, SearchX } from 'lucide-react';
import { PublishedPage as Page } from '../types';
import { getPage } from '../db';
import ThemeRenderer from '../components/ThemeRenderer';

interface Props {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function PublishedPageView({ slug, onNavigate }: Props) {
  const [state, setState] = useState<
    { status: 'loading' } | { status: 'found'; page: Page } | { status: 'missing' }
  >({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    getPage(slug)
      .then((page) => {
        if (cancelled) return;
        setState(page ? { status: 'found', page } : { status: 'missing' });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'missing' });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (state.status === 'found') {
      document.title = state.page.content.title;
    }
  }, [state]);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-300" size={28} />
      </div>
    );
  }

  if (state.status === 'missing') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-200">
          <SearchX className="mx-auto mb-3 text-slate-300" size={34} />
          <h1 className="text-base font-semibold text-slate-800">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Belum ada halaman dengan alamat{' '}
            <span className="font-medium text-slate-700">/{slug}</span> di
            browser ini.
          </p>
          <button
            type="button"
            className="btn-primary mt-5 w-full"
            onClick={() => onNavigate('/')}
          >
            <ArrowLeft size={15} />
            Kembali ke editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* chrome aplikasi, bukan bagian dari tema */}
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="fixed bottom-4 left-4 z-[999] inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 shadow-lg backdrop-blur transition hover:bg-white"
      >
        <ArrowLeft size={13} />
        Editor
      </button>
      <ThemeRenderer theme={state.page.theme} content={state.page.content} />
    </div>
  );
}
