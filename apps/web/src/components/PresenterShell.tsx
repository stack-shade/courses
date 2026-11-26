'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Download,
  ExternalLink,
  FlipHorizontal2,
  RotateCcw,
  Square,
  Circle as CircleIcon,
} from 'lucide-react';
import { withBasePath } from '@/lib/paths';

export function PresenterShell({
  courseSlug,
  deckSlug,
  deckTitle,
  lessonSlug,
  downloadHtmlPath,
}: {
  courseSlug: string;
  deckSlug: string;
  deckTitle: string;
  lessonSlug: string | null;
  downloadHtmlPath: string;
}) {
  const [camActive, setCamActive] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [shape, setShape] = useState<'circle' | 'rounded'>('circle');
  const [mirrored, setMirrored] = useState(true);
  const [size, setSize] = useState(184);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const toggleCamera = async () => {
    if (camActive) {
      stopCamera();
      return;
    }
    setCamError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Camera API unavailable in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCamActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setCamError('Camera permission denied or no device found.');
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - size - 8, e.clientX - dragRef.current.dx)),
      y: Math.max(56, Math.min(window.innerHeight - size - 8, e.clientY - dragRef.current.dy)),
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const iframeSrc = withBasePath(downloadHtmlPath);

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] flex-col bg-[#0f141d] text-[#f1f5f9]">
      {/* Slim Presenter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252f42] bg-[#161c28] px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <Link
            href={lessonSlug ? `/courses/${courseSlug}/learn/${lessonSlug}/` : `/courses/${courseSlug}/`}
            className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2.5 py-1 hover:border-[#a3e635]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Lesson</span>
          </Link>
          <span className="font-semibold text-[#a3e635]">{deckTitle}</span>
          <span className="hidden text-[#94a3b8] sm:inline">({deckSlug})</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleCamera}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1 font-semibold ${
              camActive
                ? 'bg-[#a3e635] text-[#0f141d]'
                : 'border border-[#252f42] bg-[#0f141d] text-[#f1f5f9] hover:border-[#a3e635]'
            }`}
          >
            {camActive ? <CameraOff className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />}
            <span>{camActive ? 'Turn Camera Off' : 'Enable Webcam Bubble'}</span>
          </button>

          {camActive && (
            <>
              <button
                type="button"
                onClick={() => setShape((s) => (s === 'circle' ? 'rounded' : 'circle'))}
                className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2 py-1 hover:border-[#a3e635]"
                title="Toggle circle / rounded rectangle"
              >
                {shape === 'circle' ? <Square className="h-3.5 w-3.5" /> : <CircleIcon className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setMirrored((m) => !m)}
                className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2 py-1 hover:border-[#a3e635]"
                title="Mirror camera"
              >
                <FlipHorizontal2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setSize((s) => (s >= 240 ? 152 : s + 32))}
                className="rounded border border-[#252f42] px-2 py-1 hover:border-[#a3e635]"
                title="Cycle webcam size"
              >
                {size}px
              </button>
              <button
                type="button"
                onClick={() => setPos(null)}
                className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2 py-1 hover:border-[#a3e635]"
                title="Reset position"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          <a
            href={iframeSrc}
            download
            className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2.5 py-1 hover:border-[#a3e635]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .html</span>
          </a>
          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded border border-[#252f42] px-2.5 py-1 hover:border-[#a3e635]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Standalone</span>
          </a>
        </div>
      </div>

      {camError && (
        <div className="bg-[#7f1d1d] px-4 py-1.5 text-center text-xs text-white" role="status">
          {camError} (Camera preview runs locally in your browser only.)
        </div>
      )}

      {/* Embedded Same-Origin Animated HTML Deck */}
      <iframe
        src={iframeSrc}
        title={deckTitle}
        className="h-full w-full flex-1 border-0 bg-[#0f141d]"
      />

      {/* Local-Only Draggable Webcam Overlay (sits cleanly above slide layer for OBS capture) */}
      {camActive && (
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: pos ? `${pos.x}px` : undefined,
            top: pos ? `${pos.y}px` : undefined,
            right: pos ? undefined : '24px',
            bottom: pos ? undefined : '72px',
          }}
          className={`fixed z-50 cursor-grab overflow-hidden border-[3px] border-[#a3e635] bg-black shadow-xl active:cursor-grabbing ${
            shape === 'circle' ? 'rounded-full' : 'rounded-2xl'
          }`}
          aria-label="Local instructor camera preview (drag to move)"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${mirrored ? '-scale-x-100' : ''}`}
          />
        </div>
      )}
    </div>
  );
}
