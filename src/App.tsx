import { useCallback, useEffect, useState } from 'react';
import Builder from './pages/Builder';
import PublishedPageView from './pages/PublishedPage';
import { slugify } from './types';

/**
 * Router minimal berbasis History API.
 *   /            -> builder
 *   /<slug>      -> halaman yang sudah dipublish
 *
 * Vite dev server memakai appType 'spa' secara default, jadi request ke
 * /untuk-ama tetap dilayani index.html dan router ini yang menanganinya.
 * Untuk hasil `npm run build`, host statis perlu rewrite semua path ke
 * index.html (lihat public/_redirects untuk Netlify).
 */
export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  const slug = slugify(decodeURIComponent(path.replace(/^\/+|\/+$/g, '')));

  if (!slug) {
    document.title = 'Custom Web Generator';
    return <Builder onNavigate={navigate} />;
  }

  return <PublishedPageView slug={slug} onNavigate={navigate} />;
}
