import { Fragment } from 'react';
import { Leaf, Waves, Sparkles, Heart } from 'lucide-react';
import { LetterContent, PLACEHOLDER_IMAGE } from '../../types';
import { buildBlocks } from './blocks';

const CAPTION_BG = ['bg-gray-100/80', 'bg-teal-100/80', 'bg-green-100/80'];
const ASPECT = ['aspect-[3/4]', 'aspect-[3/4]', 'aspect-square'];

export default function LakeTheme({ content }: { content: LetterContent }) {
  const dividers = [
    <Waves className="w-6 h-6 text-[#4a7c8f] opacity-50" strokeWidth={1} />,
    <Leaf className="w-6 h-6 text-[#6b9b7f] opacity-50" strokeWidth={1} />,
    <Sparkles className="w-6 h-6 text-[#8ab4b4] opacity-50" strokeWidth={1} />,
  ];
  const blocks = buildBlocks(content.paragraphs, dividers.length);

  return (
    <div className="theme-lake min-h-screen bg-gradient-to-b from-[#1a4d4d] via-[#2d6b7f] to-[#4a7c8f] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 water-texture"></div>

      <div className="absolute inset-0 shimmer"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-[#b8d4d4]" strokeWidth={1.5} />
            <h1 className="text-4xl md:text-5xl font-serif text-[#e8f1f1] tracking-wide">
              {content.title}
            </h1>
            <Leaf className="w-8 h-8 text-[#b8d4d4]" strokeWidth={1.5} />
          </div>
          <p className="text-[#b8d4d4] italic">{content.subtitle}</p>
        </header>

        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-8 mb-12">
          <div className="letter-card bg-[#f5f8f8]/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#d4e5e5]/30 animate-slide-up">
            <div className="prose prose-lg max-w-none text-justify">
              <p className="font-serif text-[#1a4d4d] text-lg">
                {content.greeting}
              </p>

              {blocks.map((block, i) =>
                block.kind === 'paragraph' ? (
                  <p
                    key={`p-${i}`}
                    className={
                      block.index === 0
                        ? 'text-[#2d5555] leading-relaxed my-6'
                        : 'text-[#2d5555] leading-relaxed mb-6'
                    }
                  >
                    {block.text}
                  </p>
                ) : (
                  <div
                    key={`d-${i}`}
                    className="flex items-center justify-center my-8"
                  >
                    <Fragment>{dividers[block.iconIndex]}</Fragment>
                  </div>
                )
              )}

              <div className="flex items-center justify-center my-8">
                <Heart
                  className="w-6 h-6 text-[#8ab4b4] opacity-50"
                  strokeWidth={1}
                />
              </div>

              {content.quote.trim() !== '' && (
                <div className="bg-[#d4e8e8]/50 rounded-2xl p-6 my-8 border-l-4 border-[#4a7c8f]">
                  <p className="text-[#1a4d4d] italic font-serif text-base leading-relaxed">
                    {content.quote}
                  </p>
                </div>
              )}

              <p className="text-[#1a4d4d]/80 italic leading-relaxed mb-0">
                {content.closing}
              </p>
              <p className="font-serif italic text-[#1a4d4d] text-lg">
                {content.signature}
              </p>
            </div>
          </div>

          <div className="space-y-6 animate-slide-up-delay">
            {content.photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="image-card bg-[#f5f8f8]/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#d4e5e5]/30 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div
                  className={`${
                    ASPECT[idx % ASPECT.length]
                  } rounded-xl mb-4 overflow-hidden`}
                >
                  <img
                    src={photo.imageUrl || PLACEHOLDER_IMAGE}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={`${
                    CAPTION_BG[idx % CAPTION_BG.length]
                  } rounded-full px-4 py-2 text-center`}
                >
                  <p className="text-[#2d5555] text-sm font-medium">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center animate-fade-in-late">
          <div className="inline-block bg-[#f5f8f8]/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-[#d4e5e5]/30">
            <p className="text-[#2d5555] italic text-sm">
              {content.footerText}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
