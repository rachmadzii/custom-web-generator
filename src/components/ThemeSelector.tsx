import { Check } from 'lucide-react';
import { THEMES, ThemeId } from '../types';

interface Props {
  selected: ThemeId;
  onSelect: (theme: ThemeId) => void;
}

export default function ThemeSelector({ selected, onSelect }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
    >
      {THEMES.map((theme) => {
        const active = selected === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(theme.id)}
            className={`group relative overflow-hidden rounded-xl border-2 text-left transition
              focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200
              ${
                active
                  ? 'border-indigo-500 shadow-md'
                  : 'border-transparent hover:border-slate-300'
              }`}
          >
            <div
              className="h-16 w-full sm:h-20"
              style={{ background: theme.previewGradient }}
            />
            <div className="bg-white px-3 py-2.5">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-semibold text-slate-800">
                  {theme.name}
                </span>
                {active && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                {theme.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
