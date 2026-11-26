import { withBasePath } from './paths';

const WAITERS: Array<() => void> = [];
let loading = false;

export function ensureWidgetsLoaded(cb: () => void): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { StackShadeVisuals?: { mountAll: (scope?: HTMLElement | Document) => void } };
  if (w.StackShadeVisuals) {
    cb();
    return;
  }
  WAITERS.push(cb);
  if (loading) return;
  loading = true;

  const existing = document.getElementById('ss-widgets-script') as HTMLScriptElement | null;
  const flush = () => {
    loading = false;
    while (WAITERS.length) {
      const fn = WAITERS.shift();
      fn?.();
    }
  };

  if (existing) {
    existing.addEventListener('load', flush, { once: true });
    return;
  }
  const s = document.createElement('script');
  s.id = 'ss-widgets-script';
  s.src = withBasePath('/visuals/widgets.js');
  s.onload = flush;
  s.onerror = () => {
    loading = false;
  };
  document.body.appendChild(s);
}
