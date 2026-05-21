import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { adminAuth } from '@/lib/firebase-admin';
import { isAiStudio } from '@/lib/is-ai-studio';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = await isAiStudio();
  const cookieStore = await cookies();
  const session = cookieStore.get('__session')?.value;

  if (!isDev) {
    // Strictly enforce auth check on Hostinger / Production
    if (!session) {
      redirect('/login');
    }

    try {
      await adminAuth.verifyIdToken(session);
    } catch (error) {
      console.error('Production admin verification failed:', error);
      redirect('/login');
    }
  } else {
    // AI Studio / Development Environment bypass
    try {
      if (session && session !== 'dev-bypass-token') {
        await adminAuth.verifyIdToken(session);
      }
    } catch (error) {
      // Don't redirect on dev to prevent tedious login loops
      console.log('Dev verification failed, remaining in bypass mode:', error);
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
