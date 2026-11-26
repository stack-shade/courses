'use client';

import React, { useEffect, useRef } from 'react';
import { ensureWidgetsLoaded } from '@/lib/visuals';

export function LiveVisual({
  animIds,
  className = '',
}: {
  animIds: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || animIds.length === 0) return;
    ensureWidgetsLoaded(() => {
      const w = window as Window & {
        StackShadeVisuals?: { mountAll: (scope?: HTMLElement | Document) => void };
      };
      w.StackShadeVisuals?.mountAll(el);
    });
  }, [animIds]);

  if (animIds.length === 0) return null;

  return (
    <div ref={ref} className={`space-y-4 ${className}`}>
      {animIds.map((id) => (
        <div key={id} data-stackshade-anim={id} />
      ))}
    </div>
  );
}
