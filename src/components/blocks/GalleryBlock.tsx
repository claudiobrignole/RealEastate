"use client";

import { useState, useEffect } from 'react';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalleryBlock({ data }: { data: any }) {
  const count = data?.imageCount || 6;
  const layout = data?.layout || 'grid';

  const [order, setOrder] = useState<number[]>(
    Array.from({ length: count }, (_, i) => i)
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  useEffect(() => {
    setOrder(Array.from({ length: count }, (_, i) => i));
  }, [count]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % count : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + count) % count : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [count]);

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (isNaN(fromIndex) || fromIndex === toIndex) return;
    setOrder(prev => {
      const next = [...prev];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return next;
    });
    setDraggingIndex(null);
  };

  const PlaceholderCell = ({ index, className }: { index: number; className: string }) => (
    <div
      className={`relative bg-surface-container-low border border-outline-variant 
                  rounded-DEFAULT overflow-hidden flex items-center justify-center
                  cursor-grab active:cursor-grabbing select-none transition-opacity
                  ${draggingIndex === index ? 'opacity-40' : 'opacity-100 hover:opacity-90'}
                  ${className}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', String(index));
        setDraggingIndex(index);
      }}
      onDragEnd={() => setDraggingIndex(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index)}
      onClick={() => setLightboxIndex(index)}
    >
      <div className="flex flex-col items-center gap-sm text-on-surface-variant/40">
        <ImageIcon className="w-8 h-8" />
        <span className="font-label-caps text-label-caps uppercase tracking-wider">
          Foto {order[index] + 1}
        </span>
      </div>
    </div>
  );

  return (
    <section className="px-margin py-lg">
      <div className="flex items-center justify-between mb-md">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
          {data?.sectionTitle || 'Galleria'}
        </h2>
        <span className="font-label-caps text-label-caps text-on-surface-variant/50 uppercase tracking-wider">
          {count} foto
        </span>
      </div>

      {layout === 'masonry' ? (
        <div className="columns-2 md:columns-3 gap-sm space-y-sm">
          {order.map((_, i) => (
            <PlaceholderCell 
              key={i}
              index={i}
              className={i % 3 === 0 ? 'aspect-[4/5] w-full inline-block mb-sm' : i % 3 === 1 ? 'aspect-square w-full inline-block mb-sm' : 'aspect-[3/4] w-full inline-block mb-sm'}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
          {count > 0 && (
            <PlaceholderCell 
              index={0} 
              className="w-full aspect-[16/9]" 
            />
          )}

          {count > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
              {order.slice(1).map((_, idx) => (
                <PlaceholderCell 
                  key={idx + 1}
                  index={idx + 1}
                  className="w-full aspect-[4/3]"
                />
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-md font-label-caps text-label-caps text-on-surface-variant/40 uppercase tracking-wider text-center">
        Trascinare per riordinare. Upload immagini disponibile a breve.
      </p>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Contenuto centrale */}
          <div className="relative max-w-5xl w-full px-16" onClick={e => e.stopPropagation()}>
            <div className="aspect-[16/9] bg-surface-container-low border border-outline-variant rounded-DEFAULT flex items-center justify-center">
              <div className="flex flex-col items-center gap-sm text-on-surface-variant/40">
                <ImageIcon className="w-16 h-16" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider">
                  Foto {order[lightboxIndex] + 1} di {count}
                </span>
              </div>
            </div>

            <button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + count) % count)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Foto precedente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % count)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Foto successiva"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white font-label-caps text-label-caps uppercase tracking-wider transition-colors"
            >
              ✕ Chiudi
            </button>

            <div className="flex justify-center gap-xs mt-md">
              {order.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === lightboxIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                  aria-label={`Vai alla foto ${order[i] + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
