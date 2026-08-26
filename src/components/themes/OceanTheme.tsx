import { Fragment } from 'react';
import { Shell, Sparkles, Heart } from 'lucide-react';
import { LetterContent, PLACEHOLDER_IMAGE } from '../../types';
import { buildBlocks } from './blocks';

/**
 * Replika project-aca-done/src/App.tsx.
 * Struktur elemen dan className identik dengan aslinya; hanya teks & gambar
 * yang diganti menjadi props.
 */
export default function OceanTheme({ content }: { content: LetterContent }) {
  const dividers = [
    <Shell className="text-coral-400" size={24} />,
    <Sparkles className="text-amber-400" size={24} />,
  ];
  const blocks = buildBlocks(content.paragraphs, dividers.length);

  return (
    <div className="theme-ocean min-h-screen bg-gradient-to-b from-sky-200 via-blue-100 to-amber-100 relative overflow-hidden">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-5xl leading-relaxed font-serif text-teal-800 mb-4 flex items-center justify-center gap-3">
            {content.title}
          </h1>
          <p className="text-base text-teal-700 italic max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </header>

        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 flex max-md:flex-col gap-16 animate-slide-up">
          <div className="space-y-6 text-gray-800 leading-relaxed text-justify">
            <div className="prose prose-lg">
              <h2 className="text-xl font-serif text-teal-800 mb-6">
                {content.greeting}
              </h2>

              {blocks.map((block, i) =>
                block.kind === 'paragraph' ? (
                  <p key={`p-${i}`}>{block.text}</p>
                ) : (
                  <div
                    key={`d-${i}`}
                    className="flex items-center justify-center my-6"
                  >
                    <Fragment>{dividers[block.iconIndex]}</Fragment>
                  </div>
                )
              )}

              {content.quote.trim() !== '' && (
                <p className="bg-gradient-to-r from-cyan-50 to-peach-50 p-4 rounded-2xl border-l-4 border-teal-400">
                  {content.quote}
                </p>
              )}

              <div className="flex items-center justify-center my-6">
                <Heart className="text-rose-400 fill-rose-300" size={24} />
              </div>

              <p className="text-xl font-serif text-teal-800 mt-8 text-right italic">
                {content.closing}
                <br />
                {content.signature}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {content.photos.map((photo) => (
              <div
                key={photo.id}
                className="md:w-[350px] relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={photo.imageUrl || PLACEHOLDER_IMAGE}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-center shadow-lg">
                    <p className="text-cyan-700 font-medium">{photo.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center mt-12 animate-fade-in">
          <p className="text-teal-700 text-base italic font-light">
            {content.footerText}
          </p>
        </footer>
      </div>

      <div className="wave-container">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id="wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="wave-parallax">
            <use href="#wave" x="48" y="0" fill="rgba(147, 197, 253, 0.3)" />
            <use href="#wave" x="48" y="3" fill="rgba(125, 211, 252, 0.3)" />
            <use href="#wave" x="48" y="5" fill="rgba(165, 243, 252, 0.5)" />
            <use href="#wave" x="48" y="7" fill="rgba(186, 230, 253, 0.7)" />
          </g>
        </svg>
      </div>

      <div className="sparkles">
        <div
          className="sparkle"
          style={{ left: '10%', top: '20%', animationDelay: '0s' }}
        ></div>
        <div
          className="sparkle"
          style={{ left: '80%', top: '30%', animationDelay: '1s' }}
        ></div>
        <div
          className="sparkle"
          style={{ left: '50%', top: '15%', animationDelay: '2s' }}
        ></div>
        <div
          className="sparkle"
          style={{ left: '20%', top: '60%', animationDelay: '3s' }}
        ></div>
        <div
          className="sparkle"
          style={{ left: '90%', top: '70%', animationDelay: '1.5s' }}
        ></div>
        <div
          className="sparkle"
          style={{ left: '60%', top: '80%', animationDelay: '2.5s' }}
        ></div>
      </div>
    </div>
  );
}
