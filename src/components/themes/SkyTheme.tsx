import { LetterContent, PLACEHOLDER_IMAGE } from '../../types';

/**
 * Replika project-arlon-done/index.html.
 * Root <div class="container"> asli diganti menjadi .theme-sky karena
 * `.container` bentrok dengan utility Tailwind — deklarasinya sama persis.
 * Urutan DOM tetap: photo-section dulu, lalu letter-section (CSS order yang
 * menukar posisinya di desktop).
 * Tema ini tidak menampilkan caption foto di aslinya.
 */
export default function SkyTheme({ content }: { content: LetterContent }) {
  return (
    <div className="theme-sky">
      {/* Animated Background Clouds */}
      <div className="clouds-container">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="main-title">
            ✨⛅ <br />
            {content.title}
          </h1>
          <p className="subtitle">{content.subtitle}</p>
        </header>

        {/* Main Content Area */}
        <main className="main-section">
          <div className="content-wrapper">
            <div className="content-grid">
              {/* Photo Section */}
              <div className="photo-section">
                {content.photos.map((photo, idx) => (
                  <div
                    className="glass-card photo-card"
                    key={photo.id}
                    style={idx === 1 ? { margin: '32px 0' } : undefined}
                  >
                    <div className="photo-placeholder">
                      <img
                        src={photo.imageUrl || PLACEHOLDER_IMAGE}
                        alt={photo.caption}
                        className="photo-image"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Letter Section */}
              <div className="letter-section">
                <div className="glass-card">
                  <div className="letter-content">
                    <p className="greeting">{content.greeting}</p>

                    {content.paragraphs.map((text, i) => (
                      <p key={i}>{text}</p>
                    ))}

                    <p className="closing-greeting">{content.closing}</p>

                    <p className="signature">{content.signature}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>{content.footerText}</p>
        </footer>
      </div>
    </div>
  );
}
