'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Users,
  Megaphone,
  Calendar,
  BarChart2,
  Settings,
  Bell,
  Menu,
  X,
  Building2,
  ChevronDown,
  LogOut,
  Loader2,
  UserCheck,
  Puzzle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { switchActiveTenant, logoutUser } from '@/lib/actions/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: Layers, label: 'Progetti & Landing' },
  { href: '/admin/leads', icon: Users, label: 'CRM & Leads' },
  { href: '/admin/campaigns', icon: Megaphone, label: 'Campagne Ads' },
  { href: '/admin/appointments', icon: Calendar, label: 'Appuntamenti' },
  { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/admin/settings/users', icon: UserCheck, label: 'Team' },
  { href: '/admin/settings', icon: Puzzle, label: 'Integrazioni' },
];

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'tenant_admin' | 'tenant_user';
  tenantId?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  tenants: any[];
  activeTenantId: string;
  activeTenantName: string;
}

export default function DashboardLayout({
  children,
  user,
  tenants = [],
  activeTenantId,
  activeTenantName
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut fallback:', e);
    }

    try {
      const res = await logoutUser();
      if (res.success) {
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        router.push('/login');
        router.refresh();
      } else {
        alert('Errore durante il logout: ' + res.error);
      }
    } catch (err: any) {
      alert('Impossibile effettuare il logout: Errore del server.');
    } finally {
      setLoggingOut(false);
    }
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.href === '/admin/settings/users') {
      return user.role === 'super_admin' || user.role === 'tenant_admin';
    }
    if (item.href === '/admin/settings') {
      return user.role === 'super_admin' || user.role === 'tenant_admin';
    }
    return true;
  });

  const currentNavItem = filteredNavItems.find((item) => 
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );
  const breadcrumb = currentNavItem ? currentNavItem.label : 'Dashboard';

  const handleTenantSwitch = async (tenantId: string | null) => {
    setSwitching(true);
    setShowTenantDropdown(false);
    const res = await switchActiveTenant(tenantId);
    if (res.success) {
      router.refresh();
      // Forces Next.js to reload data
      window.location.reload();
    } else {
      alert(res.error || 'Errore cambio area di lavoro');
    }
    setSwitching(false);
  };

  const getInitials = (name: string) => {
    if (!name) return 'UN';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getUserRoleLabel = (role: string) => {
    if (role === 'super_admin') return 'Super Admin';
    if (role === 'tenant_admin') return 'Amministratore';
    return 'Membro Team';
  };

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
              ZEROAGENZIA
            </h1>
            <h2 className="font-label-caps text-label-caps tracking-widest text-secondary">
              CASA
            </h2>
            <hr className="border-t-[1px] border-outline-variant mt-md mb-md" />
          </div>
          
          {/* User Profile Block with Dropdown Menu at the Top */}
          <div className="relative mb-4">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              type="button"
              className="w-full flex items-center space-x-sm p-sm rounded-xl hover:bg-surface-container-low transition-colors duration-200 text-left border border-transparent hover:border-outline-variant cursor-pointer group"
              id="user-profile-dropdown-button"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary-container text-on-primary-container font-semibold text-sm group-hover:scale-105 transition-transform">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1 pl-2.5">
                <p className="font-medium text-sm text-on-surface truncate" title={user.name}>{user.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-on-surface-variant truncate">{getUserRoleLabel(user.role)}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-on-surface transition-colors shrink-0" />
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowProfileDropdown(false)} 
                />
                <div className="absolute left-0 right-0 mt-1 bg-surface brightness-105 border border-outline rounded-xl shadow-xl z-50 py-2 animate-fade-in" id="user-profile-dropdown-menu">
                  <Link 
                    href="/admin/profile" 
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Impostazioni Personali</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    type="button"
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50/50 transition-colors text-left cursor-pointer disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>Esci</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <hr className="border-t-[1px] border-outline-variant mb-md" />
          
          <div className="flex flex-col gap-[2px] flex-grow">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
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
        </div>
      </nav>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 w-full lg:ml-72 min-h-screen pt-24 px-[12px] md:px-[24px] lg:px-margin pb-10">
        {/* TopAppBar */}
        <header className="bg-surface-bright/90 backdrop-blur-md fixed top-0 right-0 h-20 z-40 border-b border-outline-variant flex justify-between items-center w-full lg:w-[calc(100%-18rem)] px-3 md:px-md lg:px-lg transition-all duration-200">
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-label-caps tracking-widest text-on-surface uppercase pr-4 border-r border-outline-variant">
              {breadcrumb}
            </span>
            
            {/* Active Workspace Label & Multi-Tenant Dropdown for Super Admin */}
            <div className="relative">
              {user.role === 'super_admin' ? (
                <button
                  onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                  disabled={switching}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-container-high border border-outline-variant rounded-full text-xs font-semibold text-secondary-dim transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Spazio: <strong className="text-primary">{activeTenantName}</strong></span>
                  <ChevronDown className="w-3 h-3 text-on-surface-variant" />
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant rounded-full text-xs font-semibold text-secondary-dim">
                  <Building2 className="w-3.5 h-3.5 text-secondary" />
                  <span>Area: <strong className="text-on-surface">{activeTenantName}</strong></span>
                </div>
              )}

              {/* Tenant Switcher drop list */}
              {showTenantDropdown && user.role === 'super_admin' && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowTenantDropdown(false)} />
                  <div className="absolute left-0 mt-2 w-72 bg-surface brightness-105 border border-outline rounded-xl shadow-xl z-50 py-2">
                    <div className="px-4 py-1.5 border-b border-outline-variant mb-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Seleziona Spazio Cliente</p>
                    </div>
                    
                    {/* Default workspace item */}
                    <button
                      onClick={() => handleTenantSwitch(null)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-surface-container-high transition-colors",
                        activeTenantId === 'dev-super-admin-uid' ? "font-bold text-primary bg-primary/10" : "text-on-surface"
                      )}
                    >
                      <span>ZeroAgenzia Casa HQ (Master)</span>
                      {activeTenantId === 'dev-super-admin-uid' && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>

                    {/* Client Tenants list */}
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleTenantSwitch(t.id)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-surface-container-high transition-colors",
                          activeTenantId === t.id ? "font-bold text-primary bg-primary/10" : "text-on-surface"
                        )}
                      >
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase">{t.plan} Plan ({t.currentUserCount}/{t.maxUsers} utenti)</p>
                        </div>
                        {activeTenantId === t.id && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}

                    {tenants.length === 0 && (
                      <div className="px-4 py-3 text-center text-xs text-on-surface-variant italic">
                        Nessun cliente creato.<br />
                        Creane uno in &quot;Impostazioni &gt; Gestione Membri&quot;.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Azioni destra */}
          <div className="flex items-center gap-md">
            <button className="p-xs text-on-surface-variant hover:text-secondary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              title="Esci"
              className="p-xs text-on-surface-variant hover:text-red-500 rounded-full transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {loggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
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
