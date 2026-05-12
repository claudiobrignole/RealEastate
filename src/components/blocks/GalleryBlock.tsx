"use client";

import { ImageIcon } from 'lucide-react';

export default function GalleryBlock({ data }: { data: any }) {
  const count = data?.imageCount || 6;
  const layout = data?.layout || 'grid';

  const placeholders = Array.from({ length: count });

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

      <div
        className={
          layout === 'masonry'
            ? 'columns-2 md:columns-3 gap-sm space-y-sm'
            : 'grid grid-cols-2 md:grid-cols-3 gap-sm'
        }
      >
        {placeholders.map((_, i) => (
          <div
            key={i}
            className={`
              relative bg-surface-container-low border border-outline-variant 
              rounded-DEFAULT overflow-hidden flex items-center justify-center
              ${layout === 'masonry' 
                ? (i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]')
                : 'aspect-[4/3]'
              }
              ${i === 0 && layout === 'grid' ? 'col-span-2 md:col-span-2 aspect-[16/9]' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-sm text-on-surface-variant/40">
              <ImageIcon className="w-8 h-8" />
              <span className="font-label-caps text-label-caps uppercase tracking-wider">
                Foto {i + 1}
              </span>
            </div>
            {/* Upload verrà abilitato con Firebase Storage */}
          </div>
        ))}
      </div>

      <p className="mt-md font-label-caps text-label-caps text-on-surface-variant/40 uppercase tracking-wider text-center">
        Upload immagini disponibile a breve
      </p>
    </section>
  );
}
