'use client';

import React, { useState } from 'react';
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
  Plus,
  Menu,
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentNavItem = navItems.find((item) => 
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );
  const breadcrumb = currentNavItem ? currentNavItem.label : 'Dashboard';

  return (
    <div className="text-on-surface antialiased flex min-h-screen bg-background">
      {/* SideNavBar */}
      <nav className={`bg-surface-container-lowest h-screen w-72 ${sidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col fixed right-0 top-0 lg:left-0 lg:right-auto border-r border-outline-variant z-50 overflow-y-auto`}>
        <div className="flex flex-col pt-[12px] pb-md px-md gap-xs h-full">
          <button
            className="lg:hidden self-end p-xs text-on-surface-variant hover:text-on-surface mb-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-label-caps text-label-caps tracking-widest text-on-surface">
              AURELIAN
            </h1>
            <h2 className="font-label-caps text-label-caps tracking-widest text-secondary">
              RESERVE
            </h2>
            <hr className="border-t-[1px] border-outline-variant mt-md mb-md" />
          </div>
          
          <div className="flex flex-col gap-[2px] flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-sm py-[10px] pl-4 transition-all duration-300 ease-in-out font-body-md text-body-md",
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
              className="flex items-center gap-sm py-[10px] text-on-surface-variant pl-4 hover:bg-surface-container-low hover:text-on-surface transition-all duration-300 ease-in-out font-body-md text-body-md border-l-[3px] border-transparent"
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 w-full lg:ml-72 min-h-screen pt-16 px-[12px] md:px-[24px] lg:px-margin">
        {/* TopAppBar */}
        <header className="bg-surface-bright/90 backdrop-blur-md fixed top-0 right-0 h-20 z-40 border-b border-outline-variant flex justify-between items-center w-full lg:w-[calc(100%-18rem)] px-3 md:px-md lg:px-lg transition-all duration-200">
          <span className="font-label-caps text-label-caps tracking-widest text-on-surface uppercase">
            {breadcrumb}
          </span>

          {/* Azioni destra */}
          <div className="flex items-center gap-md">
            <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
            {/* Hamburger — solo mobile/tablet */}
            <button
              className="lg:hidden p-xs text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
