import { serverDb } from '@/lib/firebase-server';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore/lite';
import { notFound } from 'next/navigation';
import ThemeVariant1 from '@/components/themes/ThemeVariant1';
import ThemeVariant2 from '@/components/themes/ThemeVariant2';
import ThemeVariant3 from '@/components/themes/ThemeVariant3';
import ThemeVariant4 from '@/components/themes/ThemeVariant4';

const themes: Record<string, React.ComponentType<any>> = {
  'landing_variant_1': ThemeVariant1,
  'landing_variant_2': ThemeVariant2,
  'landing_variant_3': ThemeVariant3,
  'landing_variant_4': ThemeVariant4,
};

export const dynamic = 'force-dynamic';

export default async function PublicProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { projectId } = await params;
  const { lang: queryLang } = await searchParams;
  
  let projectData: any = null;
  
  try {
    const q = query(collection(serverDb, 'projects'), where('slug', '==', projectId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      projectData = snapshot.docs[0].data();
    } else {
      const docRef = doc(serverDb, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        projectData = docSnap.data();
      }
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }

  if (!projectData) {
    notFound();
  }

  let lang = queryLang || 'it';
  if (!['it', 'en', 'fr', 'de'].includes(lang)) {
    lang = 'it';
  }

  const themeId = projectData.themeId || 'landing_variant_1';
  const ThemeComponent = themes[themeId] || ThemeVariant1;

  const content = projectData.content?.[lang] || { title: '', subtitle: '', content: '' };

  return (
    <main className="min-h-screen bg-surface">
      <ThemeComponent data={{...content, projectId, blocks: projectData.blocks || []}} />
    </main>
  );
}

