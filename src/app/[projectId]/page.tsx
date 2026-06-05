import { notFound } from 'next/navigation';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPublicProject } from '@/lib/actions/projects';
import ThemeVariant1 from '@/components/themes/ThemeVariant1';

export const dynamic = 'force-dynamic';

type Lang = 'it' | 'en' | 'fr' | 'de';

export default async function PublicProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { projectId } = await params;
  const { lang: queryLang } = await searchParams;

  const projectData = await getPublicProject(projectId);
  if (!projectData) {
    notFound();
  }

  let lang = (queryLang || 'it') as Lang;
  if (!['it', 'en', 'fr', 'de'].includes(lang)) {
    lang = 'it';
  }

  const blocks = (projectData.blocks as unknown[]) || [];
  const accentColor =
    (projectData.themeColors as { accent?: string })?.accent ||
    (projectData.accentColor as string) ||
    undefined;

  if (blocks.length > 0) {
    return (
      <BlockRenderer
        blocks={blocks as import('@/types/blocks').PageBlock[]}
        lang={lang}
        projectId={(projectData.id as string) || projectId}
        accentColor={accentColor}
      />
    );
  }

  const content = (projectData.content as Record<Lang, { title: string; subtitle: string; content: string }>)?.[lang] || {
    title: '',
    subtitle: '',
    content: '',
  };

  return (
    <main className="min-h-screen bg-surface">
      <ThemeVariant1
        data={{
          ...content,
          projectId: (projectData.id as string) || projectId,
        }}
      />
    </main>
  );
}
