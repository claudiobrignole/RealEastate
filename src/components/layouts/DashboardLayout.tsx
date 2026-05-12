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
  Mail,
  MessageSquare,
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

  return (
    <div className="text-on-surface antialiased flex min-h-screen bg-background">
      {/* SideNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-primary-container h-screen w-72 flex flex-col fixed left-0 top-0 border-r border-outline-variant dark:border-primary-fixed-dim/10 z-50">
        <div className="flex flex-col py-lg px-md gap-md h-full">
          <div className="mb-lg">
            <h1 className="font-h3 text-h3 font-semibold tracking-tighter text-primary dark:text-primary-fixed">
              UnitLeads
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              Luxury Real Estate CRM
            </p>
          </div>
          
          <div className="flex flex-col gap-sm flex-grow">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-sm py-sm pl-4 transition-all duration-300 ease-in-out font-body-md text-body-md",
                    isActive 
                      ? "text-primary dark:text-primary-fixed border-l-2 border-secondary font-semibold"
                      : "text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container-low hover:text-primary border-l-2 border-transparent"
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
              className="flex items-center gap-sm py-sm text-on-surface-variant dark:text-on-primary-container pl-4 hover:bg-surface-container-low dark:hover:bg-surface-variant/5 hover:text-primary transition-all duration-300 ease-in-out font-body-md text-body-md border-l-2 border-transparent"
            >
              <Settings className="w-5 h-5" />
              <span>Impostazioni</span>
            </Link>
            
            <div className="mt-auto pt-lg border-t border-outline-variant flex items-center space-x-sm cursor-pointer hover:bg-surface-container-low p-sm rounded-DEFAULT transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0 relative">
                <div className="absolute inset-0 bg-surface-variant z-[-1]" />
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcSBsYsWqXucJAIlGNziLJRMJZw1GGl0bLaYGSdYEspPfUb8k41OzYGHtSb03D6YSypa92eZLG9vNkGeTtX1cmT8yM78jNrunVGgp6MfyJl4DQ-c0pB20hut8iZ3EGwPEchSjKPV3CEotpj-SZ9IrsJ2lXhRxvxsZuewfjgFTyy46qOBDDTIM_SSKG8fKKjvspO2NGEmu7JADb8ValislbSyH051Due6tIxsOzAJ3B0lpmM2cQa2M4eUKoIIyteNieE187lZ38yZY" 
                  alt="A. Laurent" 
                  className="w-full h-full object-cover" 
                />
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
      <div className="flex-1 ml-72 min-h-screen pt-20">
        {/* TopAppBar */}
        <header className="bg-surface-bright/90 backdrop-blur-md dark:bg-surface-container-high/90 fixed top-0 right-0 h-20 z-40 border-b border-outline-variant dark:border-primary-fixed-dim/10 flex justify-between items-center w-[calc(100%-18rem)] px-lg transition-all duration-200">
          <div className="flex items-center">
            <span className="font-h3 text-h3 font-semibold text-primary dark:text-primary-fixed hidden md:block">
              UnitLeads Workspace
            </span>
          </div>
          
          <div className="flex items-center gap-md">
            <div className="flex gap-sm">
              <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </button>
              <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
