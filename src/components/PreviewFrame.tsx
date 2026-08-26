import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

interface Props {
  /** lebar viewport yang disimulasikan, dalam px */
  width: number;
  /** tinggi viewport yang disimulasikan, dalam px */
  height: number;
  children: ReactNode;
  /** dipanggil saat dokumen iframe siap, dipakai untuk Export HTML */
  onDocument?: (doc: Document | null) => void;
}

const BLANK = '<!DOCTYPE html><html><head></head><body></body></html>';

/**
 * Preview dirender di dalam <iframe>, bukan di-scale dengan transform di
 * dokumen utama. Dua alasan:
 *
 * 1. Media query tema membaca lebar viewport iframe, bukan lebar browser.
 *    Jadi preview mobile/tablet benar-benar memicu breakpoint asli tema
 *    (mis. `max-width: 480px` milik Sunset) — bukan sekadar tampak kecil.
 * 2. Isolasi CSS. Style builder tidak bisa merembes ke tema, dan sebaliknya.
 *
 * Semua <style> dan <link rel=stylesheet> dokumen induk dikloning ke dalam
 * iframe supaya Tailwind + CSS tema tersedia di sana.
 */
export default function PreviewFrame({
  width,
  height,
  children,
  onDocument,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Simpan <body> iframe, bukan dokumennya. srcdoc mengganti dokumen iframe
  // setelah mount, dan referensi dokumen lama bisa punya body null — itu yang
  // membuat createPortal melempar "Target container is not a DOM element".
  const [body, setBody] = useState<HTMLElement | null>(null);
  const [styleVersion, setStyleVersion] = useState(0);
  const [scale, setScale] = useState(1);

  const attach = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    setBody(doc?.body ?? null);
  }, []);

  useEffect(() => {
    attach();
  }, [attach]);

  // Salin stylesheet dokumen induk ke dalam iframe.
  useEffect(() => {
    if (!body) return;
    const doc = body.ownerDocument;
    if (!doc.head) return;

    doc.head.replaceChildren();

    const meta = doc.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0';
    doc.head.appendChild(meta);

    document
      .querySelectorAll('style, link[rel="stylesheet"]')
      .forEach((node) => doc.head.appendChild(node.cloneNode(true)));

    const reset = doc.createElement('style');
    reset.textContent = 'html,body{margin:0;padding:0;}';
    doc.head.appendChild(reset);

    body.style.margin = '0';

    onDocument?.(doc);
  }, [body, styleVersion, onDocument]);

  // Vite menyuntik ulang <style> saat HMR — ikut sinkronkan.
  useEffect(() => {
    const observer = new MutationObserver(() => setStyleVersion((v) => v + 1));
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  // Skala turun kalau lebar container lebih kecil dari lebar device.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const update = () => {
      const available = wrap.clientWidth;
      setScale(available > 0 ? Math.min(1, available / width) : 1);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden">
      <div style={{ height: height * scale }}>
        <iframe
          ref={iframeRef}
          onLoad={attach}
          title="Preview halaman"
          srcDoc={BLANK}
          style={{
            width,
            height,
            border: '0',
            display: 'block',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
      {body ? createPortal(children, body) : null}
    </div>
  );
}
