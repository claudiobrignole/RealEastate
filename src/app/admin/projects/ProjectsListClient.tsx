'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';

type Project = {
  id: string;
  slug?: string;
  content?: Record<string, { title?: string; subtitle?: string }>;
  blocks?: Array<{ data?: { imageUrl?: string } }>;
};

export default function ProjectsListClient({
  projects,
  leadCounts,
}: {
  projects: Project[];
  leadCounts: Record<string, number>;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const title = p.content?.it?.title?.toLowerCase() || '';
      const subtitle = p.content?.it?.subtitle?.toLowerCase() || '';
      const slug = (p.slug || p.id).toLowerCase();
      return title.includes(q) || subtitle.includes(q) || slug.includes(q);
    });
  }, [projects, query]);

  if (projects.length === 0) {
    return (
      <div className="col-span-full text-center py-xl bg-surface-container-low rounded-lg border border-outline-variant border-dashed">
        <h3 className="font-h3 text-h3 text-primary mb-sm">Nessun progetto trovato</h3>
        <p className="text-on-surface-variant mb-md">Non hai ancora creato alcuna landing page.</p>
        <Link
          href="/admin/projects/new"
          className="inline-block px-lg py-sm bg-primary text-on-primary rounded font-label-caps uppercase hover:bg-tertiary transition-colors"
        >
          Crea il tuo primo progetto
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-sm mb-lg">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full md:w-96 pl-4 pr-sm py-sm bg-surface border border-outline-variant rounded-DEFAULT font-body-sm text-body-sm text-on-surface focus:border-tertiary focus:ring-1 focus:ring-tertiary transition-all outline-none placeholder:text-on-surface-variant"
          placeholder="Cerca progetto o località..."
          type="search"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filtered.map((project) => {
          const defaultContent = project.content?.['it'] || { title: 'Nuovo Progetto' };
          const availableLangs = Object.keys(project.content || {}).filter(
            (k) => project.content?.[k]?.title || project.content?.[k]?.subtitle
          );
          const publicUrl = `/${project.slug || project.id}`;
          const leadCount = leadCounts[project.id] || 0;

          let coverImage =
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAcLyYSfg-vUbyHCe2vvXUuIHM1BMqW4DCucdD3NieVCPo8MbJzyWqogw97yetAfNyXzxUj2vskGIxtNdl99bq2BUGTy-mI-Y7i7fOc_1tXwrNLOluWajIwNojKhkbsBfyDxLZ7_6_i_CinP07xUNiIB29JloatSUNfbob-pdeRiRbwRYjuFM_TL_flleXvYLxTzKgDxMIyzQq7d0NMZA91HrT7Y4Gse5HC-38CQkAPZI-oeQ5CSaoGpqJVYu1w0lnsn6ZQobRnkpQ';
          const imageBlock = project.blocks?.find((b) => b.data?.imageUrl);
          if (imageBlock?.data?.imageUrl) coverImage = imageBlock.data.imageUrl;

          return (
            <div
              key={project.id}
              className="group bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden hover:border-tertiary transition-all duration-300 relative flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <Link href={publicUrl} target="_blank" className="block">
                <div className="h-64 relative overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={defaultContent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={coverImage}
                  />
                </div>
              </Link>
              <div className="p-md flex flex-col flex-1">
                <h3 className="font-h3 text-h3 text-primary">{defaultContent.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md line-clamp-1">
                  {defaultContent.subtitle || 'Nessun sottotitolo'}
                </p>
                <div className="flex items-center justify-between border-t border-outline-variant pt-sm mt-auto">
                  <div className="flex items-center gap-1">
                    {availableLangs.map((langCode) => (
                      <span
                        key={langCode}
                        className="font-label-caps text-[10px] border border-outline-variant px-1 rounded-sm uppercase"
                      >
                        {langCode}
                      </span>
                    ))}
                  </div>
                  <span className="text-body-sm text-on-surface-variant">{leadCount} lead</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="flex-1 text-center py-2 text-xs font-semibold border border-outline-variant rounded hover:border-tertiary flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    Modifica
                  </Link>
                  <Link
                    href={publicUrl}
                    target="_blank"
                    className="flex-1 text-center py-2 text-xs font-semibold bg-primary text-on-primary rounded hover:bg-inverse-surface"
                  >
                    Anteprima
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
