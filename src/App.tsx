import { useCallback, useEffect, useState } from 'react';
import Builder from './pages/Builder';
import PublishedPageView from './pages/PublishedPage';
import SharedPageView from './pages/SharedPage';
import { slugify } from './types';

/**
 * Router minimal berbasis History API.
 *   /            -> builder
 *   /s#<data>    -> halaman publik (shared via encoded URL)
 *   /<slug>      -> halaman dari IndexedDB lokal
 */
export default function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      setHash(window.location.hash);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(window.location.pathname);
    setHash(window.location.hash);
    window.scrollTo(0, 0);
  }, []);

  const cleanPath = decodeURIComponent(path.replace(/^\/+|\/+$/g, ''));

  // Route: /s#<encoded-data> → shared public page
  if (cleanPath === 's' && hash.length > 1) {
    return <SharedPageView encodedData={hash.slice(1)} onNavigate={navigate} />;
  }

  const slug = slugify(cleanPath);

  if (!slug) {
    document.title = 'Dear Page — Custom Webpage Generator';
    return <Builder onNavigate={navigate} />;
  }

  return <PublishedPageView slug={slug} onNavigate={navigate} />;
}
