import { Camera } from 'lucide-react';
import { LetterContent, PLACEHOLDER_IMAGE } from '../../types';

export default function SunsetTheme({ content }: { content: LetterContent }) {
  return (
    <div className="theme-sunset">
      <div className="cloud cloud-1"></div>
      <div className="cloud cloud-2"></div>
      <div className="cloud cloud-3"></div>
      <div className="cloud cloud-4"></div>
      <div className="cloud cloud-5"></div>
      <div className="cloud cloud-6"></div>

      <div className="content-wrapper">
        <div className="main-card">
          <div className="header">
            <h1 className="headline">
              💌
              <br />
              {content.title}
            </h1>
            <p className="subtitle">{content.subtitle}</p>
          </div>

          <div className="content-grid">
            <div className="letter-section">
              <div className="letter-text">
                <h2>{content.greeting}</h2>
                {content.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                <p>
                  <i>{content.closing}</i>
                </p>
                <h3>{content.signature}</h3>
              </div>
            </div>

            <div className="cards-section">
              {content.photos.map((photo) => (
                <div className="aesthetic-card" key={photo.id}>
                  <div className="card-icon">
                    <Camera size={22} />
                  </div>
                  <img
                    src={photo.imageUrl || PLACEHOLDER_IMAGE}
                    alt={photo.caption}
                    className="photo-image"
                  />
                  <p className="card-content">{photo.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
