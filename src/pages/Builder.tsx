import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download,
  Expand,
  Monitor,
  Palette,
  Smartphone,
  SlidersHorizontal,
  Tablet,
} from 'lucide-react';
import {
  DEFAULT_CONTENT,
  LetterContent,
  ThemeId,
  getTheme,
  slugify,
} from '../types';
import { loadDraft, saveDraft } from '../db';
import { buildStandaloneHtml, downloadHtml } from '../exportHtml';
import ThemeSelector from '../components/ThemeSelector';
import ContentEditor from '../components/ContentEditor';
import PublishPanel from '../components/PublishPanel';
import PreviewFrame from '../components/PreviewFrame';
import ThemeRenderer from '../components/ThemeRenderer';

type DeviceId = 'desktop' | 'tablet' | 'mobile';

/**
 * Ukuran viewport preview. Angka-angka ini menyeberangi breakpoint asli tiap
 * tema, jadi preview benar-benar menguji layout aslinya:
 *   mobile  390px -> memicu media query max-width 480px (Sunset) & 767px (Sky)
 *   tablet  820px -> di antara breakpoint md Tailwind (768px) dan 1024px (Sky)
 *   desktop 1440px -> semua aturan desktop aktif
 */
const DEVICES: Record<
  DeviceId,
  { label: string; width: number; height: number; icon: typeof Monitor }
> = {
  desktop: { label: 'Desktop', width: 1440, height: 900, icon: Monitor },
  tablet: { label: 'Tablet', width: 820, height: 1180, icon: Tablet },
  mobile: { label: 'Mobile', width: 390, height: 844, icon: Smartphone },
};

interface Props {
  onNavigate: (path: string) => void;
}

export default function Builder({ onNavigate }: Props) {
  const [themeId, setThemeId] = useState<ThemeId>('ocean');
  const [content, setContent] = useState<LetterContent>(DEFAULT_CONTENT);
  const [device, setDevice] = useState<DeviceId>('desktop');
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);

  const previewDoc = useRef<Document | null>(null);
  const handleDocument = useCallback((doc: Document | null) => {
    previewDoc.current = doc;
  }, []);

  // Muat draft terakhir.
  useEffect(() => {
    loadDraft()
      .then((draft) => {
        if (draft) {
          setThemeId(draft.theme);
          setContent({ ...DEFAULT_CONTENT, ...draft.content });
        }
      })
      .finally(() => setReady(true));
  }, []);

  // Autosave draft, ditahan 600ms supaya tidak menulis di setiap ketikan.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      saveDraft({ theme: themeId, content }).catch(() => undefined);
    }, 600);
    return () => clearTimeout(timer);
  }, [themeId, content, ready]);

  const theme = getTheme(themeId);

  const exportHtml = () => {
    const body = previewDoc.current?.body.innerHTML;
    if (!body) return;
    const name = `${slugify(content.title) || 'surat'}.html`;
    downloadHtml(name, buildStandaloneHtml(content.title, body));
  };

  if (fullscreen) {
    return (
      <div className="relative">
        <div className="fixed right-3 top-3 z-[999] flex gap-2">
          <button
            type="button"
            className="btn-ghost shadow-lg backdrop-blur"
            onClick={() => setFullscreen(false)}
          >
            <SlidersHorizontal size={15} />
            Kembali ke editor
          </button>
          <button
            type="button"
            className="btn-primary shadow-lg"
            onClick={exportHtml}
          >
            <Download size={15} />
            Export
          </button>
        </div>
        <ThemeRenderer theme={themeId} content={content} />
      </div>
    );
  }

  const active = DEVICES[device];

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* ---------------- Top bar ---------------- */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-3 py-3 sm:px-5 lg:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              Dear Page
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              Pilih tema, isi kontennya, lalu publish jadi halaman sendiri
            </p>
          </div>

          <button
            type="button"
            className="btn-ghost px-3 sm:px-4"
            onClick={exportHtml}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            className="btn-primary px-3 sm:px-4"
            onClick={() => setFullscreen(true)}
          >
            <Expand size={15} />
            <span className="hidden sm:inline">Layar penuh</span>
          </button>
        </div>

        {/* Tab hanya untuk layar < lg */}
        <div className="mx-auto flex max-w-[1800px] gap-1 px-3 pb-2 sm:px-5 lg:hidden">
          {(
            [
              ['editor', 'Editor', SlidersHorizontal],
              ['preview', 'Preview', Monitor],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`chip flex-1 justify-center ${
                tab === id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ---------------- Body ---------------- */}
      <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-5 lg:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-5 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          {/* -------- Kolom editor -------- */}
          <div className={tab === 'editor' ? '' : 'hidden lg:block'}>
            <div className="scroll-slim space-y-4 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:pr-1.5">
              <section className="panel">
                <h3 className="panel-title">
                  <Palette size={15} />
                  Tema
                </h3>
                <ThemeSelector selected={themeId} onSelect={setThemeId} />
              </section>

              <ContentEditor
                content={content}
                theme={theme}
                onChange={setContent}
              />

              <PublishPanel
                theme={themeId}
                content={content}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          {/* -------- Kolom preview -------- */}
          <div
            className={`${
              tab === 'preview' ? '' : 'hidden lg:block'
            } mt-4 lg:mt-0`}
          >
            <div className="lg:sticky lg:top-[4.5rem]">
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
                  {(Object.keys(DEVICES) as DeviceId[]).map((id) => {
                    const Icon = DEVICES[id].icon;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDevice(id)}
                        aria-pressed={device === id}
                        className={`chip ${
                          device === id
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        <Icon size={13} />
                        <span className="hidden sm:inline">
                          {DEVICES[id].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <span className="ml-auto text-[11px] tabular-nums text-slate-400">
                  {active.width} × {active.height}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
                <PreviewFrame
                  width={active.width}
                  height={active.height}
                  onDocument={handleDocument}
                >
                  <ThemeRenderer theme={themeId} content={content} />
                </PreviewFrame>
              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                Preview dirender di iframe pada lebar {active.width}px, jadi
                layout responsif tema ikut aktif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
