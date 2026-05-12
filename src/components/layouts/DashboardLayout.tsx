'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Users,
  Megaphone,
  Calendar,
  BarChart2,
  Settings,
  Bell,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: Layers, label: 'Progetti & Landing' },
  { href: '/admin/leads', icon: Users, label: 'CRM & Leads' },
  { href: '/admin/campaigns', icon: Megaphone, label: 'Campagne Ads' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appuntamenti' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics Avanzate' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const currentNavItem = navItems.find((item) => 
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );
  const breadcrumb = currentNavItem ? currentNavItem.label : 'Dashboard';

  return (
    <div className="text-on-surface antialiased flex min-h-screen bg-background">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest h-screen w-72 flex flex-col fixed left-0 top-0 border-r border-outline-variant z-50">
        <div className="flex flex-col py-lg px-md gap-md h-full">
          <div>
            <h1 className="font-label-caps text-label-caps tracking-widest text-on-surface">
              AURELIAN
            </h1>
            <h2 className="font-label-caps text-label-caps tracking-widest text-secondary">
              RESERVE
            </h2>
            <hr className="border-t-[1px] border-outline-variant mt-md mb-md" />
          </div>
          
          <div className="flex flex-col gap-sm flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-sm py-sm pl-4 transition-all duration-300 ease-in-out font-body-md text-body-md",
                    isActive 
                      ? "border-l-[3px] border-secondary-fixed-dim bg-secondary-fixed/20 text-on-surface font-semibold"
                      : "border-l-[3px] border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="mt-auto flex flex-col gap-md">
            <Link 
              href="#" 
              className="flex items-center gap-sm py-sm text-on-surface-variant pl-4 hover:bg-surface-container-low hover:text-on-surface transition-all duration-300 ease-in-out font-body-md text-body-md border-l-[3px] border-transparent"
            >
              <Settings className="w-5 h-5" />
              <span>Impostazioni</span>
            </Link>
            
            <div className="mt-auto pt-lg border-t border-outline-variant flex items-center space-x-sm cursor-pointer hover:bg-surface-container-low p-sm rounded-DEFAULT transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-secondary-container text-on-secondary-container font-data-point text-data-point">
                AL
              </div>
              <div className="min-w-0">
                <p className="font-data-point text-data-point text-primary truncate">A. Laurent</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Executive User</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Canvas Area */}
      <div className="flex-1 ml-72 min-h-screen pt-20 px-lg py-lg">
        {/* TopAppBar */}
        <header className="bg-surface-bright/90 backdrop-blur-md fixed top-0 right-0 h-20 z-40 border-b border-outline-variant flex justify-between items-center w-[calc(100%-18rem)] px-lg transition-all duration-200">
          <div className="flex items-center">
            <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant hidden md:block uppercase">
              {breadcrumb}
            </span>
          </div>
          
          <div className="flex items-center gap-md">
            <Link href="/admin/projects/new" className="bg-on-surface text-surface px-md py-sm font-body-sm text-body-sm rounded-DEFAULT hover:bg-secondary transition-colors duration-200 flex items-center gap-xs">
              <Plus className="w-4 h-4" />
              Nuovo Progetto
            </Link>
            <div className="flex gap-sm">
              <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
