import Link from 'next/link';
import { getProjects } from '@/lib/actions/projects';
import { getLeadCountsByProject } from '@/lib/actions/leads';
import ProjectsListClient from './ProjectsListClient';

export default async function ProjectsPage() {
  const [result, leadCounts] = await Promise.all([getProjects(), getLeadCountsByProject()]);
  const projects = result.success ? result.data : [];

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg space-y-md md:space-y-0">
        <div>
          <h2 className="font-h1 text-h1 text-primary">Progetti & Landing</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-2xl">
            Gestisci le landing page immobiliari e monitora i lead per progetto.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-primary text-on-primary font-data-point text-data-point px-lg py-sm rounded-DEFAULT hover:bg-inverse-surface transition-colors"
        >
          Nuovo Progetto
        </Link>
      </div>

      <ProjectsListClient projects={projects || []} leadCounts={leadCounts} />
    </div>
  );
}
