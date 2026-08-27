import { ChangeEvent } from 'react';
import { Plus, Trash2, ImagePlus, Info, GripVertical } from 'lucide-react';
import { LetterContent, ThemeInfo } from '../types';

interface Props {
  content: LetterContent;
  theme: ThemeInfo;
  onChange: (content: LetterContent) => void;
}

export default function ContentEditor({ content, theme, onChange }: Props) {
  const set = <K extends keyof LetterContent>(
    key: K,
    value: LetterContent[K]
  ) => onChange({ ...content, [key]: value });

  const updateParagraph = (index: number, value: string) => {
    const next = [...content.paragraphs];
    next[index] = value;
    set('paragraphs', next);
  };

  const moveParagraph = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= content.paragraphs.length) return;
    const next = [...content.paragraphs];
    [next[index], next[target]] = [next[target], next[index]];
    set('paragraphs', next);
  };

  const updatePhoto = (
    index: number,
    field: 'caption' | 'imageUrl',
    value: string
  ) => {
    const next = [...content.photos];
    next[index] = { ...next[index], [field]: value };
    set('photos', next);
  };

  const handleUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      updatePhoto(index, 'imageUrl', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* ---------- Header ---------- */}
      <section className="panel">
        <h3 className="panel-title">Header</h3>
        <div className="space-y-3">
          <div>
            <label className="field-label" htmlFor="f-title">
              Judul
            </label>
            <input
              id="f-title"
              className="field-input"
              value={content.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Surat Kecil Untukmu"
            />
            {(theme.id === 'sunset' || theme.id === 'sky') && (
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-slate-400">
                <Info size={12} className="mt-px shrink-0" />
                Tema {theme.name} sudah menyertakan emoji dekoratif di atas judul
                {theme.id === 'sunset' ? ' (💌)' : ' (✨⛅)'} sebagai bagian dari
                layoutnya, jadi kamu tidak perlu menambahkannya sendiri.
              </p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="f-subtitle">
              Subjudul
            </label>
            <input
              id="f-subtitle"
              className="field-input"
              value={content.subtitle}
              onChange={(e) => set('subtitle', e.target.value)}
              placeholder="Sebuah surat yang kutulis dengan sepenuh hati"
            />
          </div>
        </div>
      </section>

      {/* ---------- Isi surat ---------- */}
      <section className="panel">
        <h3 className="panel-title">Isi Surat</h3>
        <div className="space-y-3">
          <div>
            <label className="field-label" htmlFor="f-greeting">
              Salam pembuka
            </label>
            <input
              id="f-greeting"
              className="field-input"
              value={content.greeting}
              onChange={(e) => set('greeting', e.target.value)}
              placeholder="Hai, kamu!"
            />
          </div>

          <div className="space-y-2.5">
            <span className="field-label mb-0">
              Paragraf ({content.paragraphs.length})
            </span>
            {content.paragraphs.map((text, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <GripVertical size={12} />
                    Paragraf {idx + 1}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveParagraph(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Pindahkan paragraf ${idx + 1} ke atas`}
                    >
                      <span aria-hidden className="text-xs leading-none">
                        ↑
                      </span>
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => moveParagraph(idx, 1)}
                      disabled={idx === content.paragraphs.length - 1}
                      aria-label={`Pindahkan paragraf ${idx + 1} ke bawah`}
                    >
                      <span aria-hidden className="text-xs leading-none">
                        ↓
                      </span>
                    </button>
                    {content.paragraphs.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon hover:bg-rose-50 hover:text-rose-500"
                        onClick={() =>
                          set(
                            'paragraphs',
                            content.paragraphs.filter((_, i) => i !== idx)
                          )
                        }
                        aria-label={`Hapus paragraf ${idx + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  className="field-input min-h-[92px] resize-y leading-relaxed"
                  value={text}
                  onChange={(e) => updateParagraph(idx, e.target.value)}
                  placeholder="Tulis paragrafmu di sini..."
                />
              </div>
            ))}

            <button
              type="button"
              className="btn-ghost w-full border-dashed"
              onClick={() => set('paragraphs', [...content.paragraphs, ''])}
            >
              <Plus size={15} />
              Tambah paragraf
            </button>
          </div>

          {theme.hasQuote ? (
            <div>
              <label className="field-label" htmlFor="f-quote">
                Blok kutipan
              </label>
              <textarea
                id="f-quote"
                className="field-input min-h-[76px] resize-y"
                value={content.quote}
                onChange={(e) => set('quote', e.target.value)}
                placeholder="Kosongkan kalau tidak ingin menampilkan kutipan"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Kutipan akan tampil dalam kotak bergaris tepi di tema{' '}
                {theme.name}.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-snug text-amber-700">
              <Info size={13} className="mt-0.5 shrink-0" />
              Tema {theme.name} tidak mendukung blok kutipan, jadi kolom ini
              disembunyikan. Pilih tema Ocean atau Lake kalau kamu mau
              menggunakannya.
            </div>
          )}

          <div>
            <label className="field-label" htmlFor="f-closing">
              Penutup
            </label>
            <input
              id="f-closing"
              className="field-input"
              value={content.closing}
              onChange={(e) => set('closing', e.target.value)}
              placeholder="Dengan hangat dan penuh cinta,"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="f-signature">
              Tanda tangan
            </label>
            <input
              id="f-signature"
              className="field-input"
              value={content.signature}
              onChange={(e) => set('signature', e.target.value)}
              placeholder="Namamu"
            />
          </div>
        </div>
      </section>

      {/* ---------- Foto ---------- */}
      <section className="panel">
        <h3 className="panel-title">Foto ({content.photos.length})</h3>
        <div className="space-y-3">
          {!theme.hasCaption && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-snug text-amber-700">
              <Info size={13} className="mt-0.5 shrink-0" />
              Tema {theme.name} tidak menampilkan caption foto secara visual.
              Caption tetap tersimpan dan dipakai sebagai teks alt untuk
              aksesibilitas.
            </div>
          )}

          {content.photos.map((photo, idx) => (
            <div
              key={photo.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
            >
              <div className="flex gap-3">
                <label
                  className="group relative h-20 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white"
                  title="Klik untuk pilih gambar"
                >
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImagePlus size={20} />
                    </span>
                  )}
                  <span className="absolute inset-0 hidden items-center justify-center bg-slate-900/50 text-[10px] font-medium text-white group-hover:flex">
                    Ganti
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleUpload(idx, e)}
                  />
                </label>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      Foto {idx + 1}
                    </span>
                    {content.photos.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon hover:bg-rose-50 hover:text-rose-500"
                        onClick={() =>
                          set(
                            'photos',
                            content.photos.filter((_, i) => i !== idx)
                          )
                        }
                        aria-label={`Hapus foto ${idx + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    className="field-input py-2 text-xs"
                    value={photo.caption}
                    onChange={(e) =>
                      updatePhoto(idx, 'caption', e.target.value)
                    }
                    placeholder="Caption foto..."
                  />
                  {photo.imageUrl && (
                    <button
                      type="button"
                      className="text-[11px] font-medium text-slate-400 hover:text-rose-500"
                      onClick={() => updatePhoto(idx, 'imageUrl', '')}
                    >
                      Hapus gambar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn-ghost w-full border-dashed"
            onClick={() =>
              set('photos', [
                ...content.photos,
                {
                  id: `p${Date.now()}`,
                  imageUrl: '',
                  caption: 'Caption baru',
                },
              ])
            }
          >
            <Plus size={15} />
            Tambah foto
          </button>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <section className="panel">
        <h3 className="panel-title">Footer</h3>
        {theme.hasFooter ? (
          <input
            className="field-input"
            value={content.footerText}
            onChange={(e) => set('footerText', e.target.value)}
            placeholder="Ditulis dengan 💖"
          />
        ) : (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-snug text-amber-700">
            <Info size={13} className="mt-0.5 shrink-0" />
            Tema Sunset tidak menampilkan footer, jadi teks ini tidak akan
            muncul. Nilainya tetap tersimpan kalau kamu ganti ke tema lain.
          </div>
        )}
      </section>
    </div>
  );
}
