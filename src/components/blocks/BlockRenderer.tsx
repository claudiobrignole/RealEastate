'use client';

import type { PageBlock } from '@/types/blocks';
import HeroBlock from '@/components/blocks/HeroBlock';
import EditorialBlock from '@/components/blocks/EditorialBlock';
import FeaturesBlock from '@/components/blocks/FeaturesBlock';
import FormBlock from '@/components/blocks/FormBlock';
import GalleryBlock from '@/components/blocks/GalleryBlock';

type Lang = 'it' | 'en' | 'fr' | 'de';

function localized(value: unknown, lang: Lang): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && lang in (value as Record<string, string>)) {
    return (value as Record<string, string>)[lang] || '';
  }
  return '';
}

export default function BlockRenderer({
  blocks,
  lang,
  projectId,
  accentColor,
}: {
  blocks: PageBlock[];
  lang: Lang;
  projectId: string;
  accentColor?: string;
}) {
  const style = accentColor ? ({ '--block-accent': accentColor } as React.CSSProperties) : undefined;

  return (
    <div className="min-h-screen bg-surface" style={style}>
      {blocks.map((block) => {
        const data = block.data || {};
        switch (block.type) {
          case 'hero':
            return (
              <HeroBlock
                key={block.id}
                data={{
                  ...data,
                  title: localized(data.title, lang),
                  subtitle: localized(data.subtitle, lang),
                  accentColor: data.accentColor || accentColor,
                }}
              />
            );
          case 'editorial':
            return (
              <EditorialBlock
                key={block.id}
                data={{
                  ...data,
                  title: data.title || '',
                  body: localized(data.body, lang),
                  accentColor: data.accentColor || accentColor,
                }}
              />
            );
          case 'features':
            return (
              <FeaturesBlock
                key={block.id}
                data={{ ...data, accentColor: data.accentColor || accentColor }}
              />
            );
          case 'form':
            return (
              <FormBlock
                key={block.id}
                data={{
                  ...data,
                  projectId,
                  title: localized(data.title, lang),
                  submitLabel: localized(data.submitLabel, lang),
                  accentColor: data.accentColor || accentColor,
                }}
              />
            );
          case 'gallery':
            return (
              <GalleryBlock
                key={block.id}
                data={{
                  ...data,
                  title: localized(data.title, lang),
                  accentColor: data.accentColor || accentColor,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
