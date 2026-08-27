import { useEffect, useMemo } from 'react';
import { ArrowLeft, SearchX } from 'lucide-react';
import { decodePageData } from '../sharing';
import ThemeRenderer from '../components/ThemeRenderer';

interface Props {
  encodedData: string;
  onNavigate: (path: string) => void;
}

export default function SharedPageView({ encodedData, onNavigate }: Props) {
  const page = useMemo(() => decodePageData(encodedData), [encodedData]);

  useEffect(() => {
    if (page) {
      document.title = page.content.title;
    }
  }, [page]);

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-slate-200">
          <SearchX className="mx-auto mb-3 text-slate-300" size={34} />
          <h1 className="text-base font-semibold text-slate-800">
            Link tidak valid
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Data halaman tidak bisa dibaca. Mungkin link-nya terpotong atau
            sudah tidak berlaku.
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
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="fixed bottom-4 left-4 z-[999] inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 shadow-lg backdrop-blur transition hover:bg-white"
      >
        <ArrowLeft size={13} />
        Buat halaman baru
      </button>
      <ThemeRenderer theme={page.theme} content={page.content} />
    </div>
  );
}
