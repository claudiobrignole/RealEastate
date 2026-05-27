import Link from 'next/link';
import { getAppointments, getTodayAppointments } from '@/lib/actions/appointments';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  BellRing,
  Award
} from 'lucide-react';
import AppointmentsClientWrapper, { NewAppointmentButton } from './AppointmentsClientWrapper';
import AppointmentConfirmActions from './AppointmentConfirmActions';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  // Resolve Next.js 15 searchParams promise
  const resolvedParams = await searchParams;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  const year = typeof resolvedParams.year === 'string' ? parseInt(resolvedParams.year, 10) : currentYear;
  const month = typeof resolvedParams.month === 'string' ? parseInt(resolvedParams.month, 10) : currentMonth;

  // Fetch from Firestore
  const [appointmentsRes, todayRes] = await Promise.all([
    getAppointments(year, month),
    getTodayAppointments()
  ]);

  const appointments = appointmentsRes.success && appointmentsRes.data ? appointmentsRes.data : [];
  const todayAppointments = todayRes.success && todayRes.data ? todayRes.data : [];

  // Month navigation calculations
  const prevYearVal = month === 1 ? year - 1 : year;
  const prevMonthVal = month === 1 ? 12 : month - 1;
  const nextYearVal = month === 12 ? year + 1 : year;
  const nextMonthVal = month === 12 ? 1 : month + 1;

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  const currentMonthName = monthNames[month - 1];

  // Calculate Calendar Grid Days
  // Find first day of the desired month
  const firstDayOfThisMonth = new Date(year, month - 1, 1);
  const firstDayIndexRaw = firstDayOfThisMonth.getDay(); // 0 = Sun, 1 = Mon ...
  // Convert Sunday (0) to index 6, Monday (1) to index 0
  const startingDayIndex = firstDayIndexRaw === 0 ? 6 : firstDayIndexRaw - 1;

  // Number of total days in this current month
  const totalDaysInMonth = new Date(year, month, 0).getDate();

  // Prev month ending days context
  const prevMonthDateBound = new Date(year, month - 1, 0);
  const totalDaysInPrevMonth = prevMonthDateBound.getDate();

  // Construct Calendar Grid Cells
  const cells: { dayNum: number; isCurrentMonth: boolean; dateStr: string; label: string }[] = [];

  // 1. Pad with previous month ending days
  const tempPrevYear = month === 1 ? year - 1 : year;
  const tempPrevMonth = month === 1 ? 12 : month - 1;
  const prevMonthStr = tempPrevMonth < 10 ? `0${tempPrevMonth}` : `${tempPrevMonth}`;
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dNum = totalDaysInPrevMonth - i;
    const dStr = dNum < 10 ? `0${dNum}` : `${dNum}`;
    cells.push({
      dayNum: dNum,
      isCurrentMonth: false,
      dateStr: `${tempPrevYear}-${prevMonthStr}-${dStr}`,
      label: 'prev'
    });
  }

  // 2. Add current month's days
  const currentMonthStr = month < 10 ? `0${month}` : `${month}`;
  for (let dNum = 1; dNum <= totalDaysInMonth; dNum++) {
    const dStr = dNum < 10 ? `0${dNum}` : `${dNum}`;
    cells.push({
      dayNum: dNum,
      isCurrentMonth: true,
      dateStr: `${year}-${currentMonthStr}-${dStr}`,
      label: 'current'
    });
  }

  // 3. Complete cell padding to multiple of 7
  const remainingCellsCount = cells.length % 7;
  if (remainingCellsCount > 0) {
    const padCount = 7 - remainingCellsCount;
    const tempNextYear = month === 12 ? year + 1 : year;
    const tempNextMonth = month === 12 ? 1 : month + 1;
    const nextMonthStr = tempNextMonth < 10 ? `0${tempNextMonth}` : `${tempNextMonth}`;
    for (let dNum = 1; dNum <= padCount; dNum++) {
      const dStr = dNum < 10 ? `0${dNum}` : `${dNum}`;
      cells.push({
        dayNum: dNum,
        isCurrentMonth: false,
        dateStr: `${tempNextYear}-${nextMonthStr}-${dStr}`,
        label: 'next'
      });
    }
  }

  // Filter out any pending approval appointments for the month sidebar
  const pendingAppointments = appointments.filter((app: any) => app.status === 'pending');

  const getDayNamesAbbr = () => ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-12 px-margin pb-margin max-w-7xl mx-auto w-full min-h-screen" id="appointments-page-root">
      {/* Page Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-lowest p-6 border border-outline-variant rounded-xl gap-4 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            href={`/admin/appointments?year=${prevYearVal}&month=${prevMonthVal}`}
            className="p-2 hover:bg-surface-container border border-outline-variant rounded-lg transition-all flex items-center justify-center text-primary hover:scale-[1.02] active:scale-[0.98]"
            title="Mese precedente"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-56 text-center">
            <h3 className="font-bold text-xl text-primary leading-tight">{currentMonthName}</h3>
            <span className="text-xs font-mono font-bold text-on-surface-variant/70 tracking-wider uppercase mt-0.5 block">{year}</span>
          </div>
          <Link 
            href={`/admin/appointments?year=${nextYearVal}&month=${nextMonthVal}`}
            className="p-2 hover:bg-surface-container border border-outline-variant rounded-lg transition-all flex items-center justify-center text-primary hover:scale-[1.02] active:scale-[0.98]"
            title="Mese successivo"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Calendar View Filter (Visual Only tabs for visual richness) */}
        <div className="flex bg-surface-container rounded-lg p-1 shrink-0">
          <button className="px-4 py-1.5 rounded-md bg-surface-container-lowest shadow-sm font-semibold text-xs text-primary">Mese</button>
          <button className="px-4 py-1.5 rounded-md text-on-surface-variant font-semibold text-xs hover:bg-surface-container-lowest/50 transition-colors">Settimana</button>
          <button className="px-4 py-1.5 rounded-md text-on-surface-variant font-semibold text-xs hover:bg-surface-container-lowest/50 transition-colors">Giorno</button>
        </div>

        {/* Trigger App Wrapper button */}
        <div className="flex items-center gap-2">
          <NewAppointmentButton />
        </div>
      </div>

      {/* Main content grid split (Calendar + Sidebar) */}
      <AppointmentsClientWrapper appointments={appointments}>
        {/* Calendar Box */}
        <div className="flex-[3] flex flex-col gap-6" id="appointments-grid-aside-pair">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Weekday headers list */}
            <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low/60 text-center font-bold text-xs text-on-surface-variant uppercase tracking-widest py-3">
              {getDayNamesAbbr().map(day => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            {/* Calendar grid wrapper */}
            <div className="grid grid-cols-7 auto-rows-fr bg-outline-variant/10 divide-x divide-y divide-outline-variant/30">
              {cells.map((cell, idx) => {
                const dayApps = appointments.filter((app: any) => app.dateStr === cell.dateStr);
                const isToday = cell.dateStr === todayStr;
                const isCurrentMonth = cell.isCurrentMonth;

                // Sort appointments inside this day by startTime
                dayApps.sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));

                return (
                  <div 
                    key={`${cell.dateStr}-${idx}`}
                    className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors bg-surface-container-lowest/70 ${
                      !isCurrentMonth ? 'opacity-40 bg-surface-container-low/10' : ''
                    } ${isToday ? 'bg-primary/[0.02]' : ''}`}
                    id={`calendar-cell-${cell.dateStr}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-primary text-on-primary font-black shadow-smScale' 
                          : isCurrentMonth ? 'text-primary' : 'text-on-surface-variant/60'
                      }`}>
                        {cell.dayNum}
                      </span>
                      {dayApps.length > 0 && isCurrentMonth && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-primary/10 text-primary font-bold rounded-lg border border-primary/10">
                          {dayApps.length} app
                        </span>
                      )}
                    </div>

                    {/* Badge container */}
                    <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[85px] scrollbar-thin">
                      {dayApps.map((app: any) => {
                        const isConfirmed = app.status === 'confirmed';
                        const isPending = app.status === 'pending';
                        const isCancelled = app.status === 'cancelled';
                        
                        let badgeBg = 'bg-surface-container';
                        let badgeBorder = 'border-l-2 border-outline-variant';
                        let badgeText = 'text-on-surface';
                        
                        if (isConfirmed) {
                          badgeBg = 'bg-emerald-50';
                          badgeBorder = 'border-l-2 border-emerald-500';
                          badgeText = 'text-emerald-800';
                        } else if (isPending) {
                          badgeBg = 'bg-amber-50';
                          badgeBorder = 'border-l-2 border-amber-500';
                          badgeText = 'text-amber-800';
                        } else if (isCancelled) {
                          badgeBg = 'bg-rose-50';
                          badgeBorder = 'border-l-2 border-rose-450';
                          badgeText = 'text-rose-800 line-through opacity-80';
                        }

                        return (
                          <div
                            key={app.id}
                            className={`px-1.5 py-1 rounded text-[11px] leading-tight font-semibold truncate cursor-pointer hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex flex-col gap-0.5 ${badgeBg} ${badgeBorder} ${badgeText}`}
                            title={`${app.startTime} - ${app.endTime}: ${app.title} (${app.type})`}
                          >
                            <div className="flex justify-between items-center text-[9px] font-mono leading-none opacity-80">
                              <span>{app.startTime}</span>
                              <span className="uppercase text-[8px] tracking-wider truncate max-w-[50px]">{app.type}</span>
                            </div>
                            <div className="truncate font-medium">{app.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar panels */}
        <aside className="flex-[1.2] flex flex-col gap-6" id="appointments-sidebar">
          {/* Calendar Sidebar section: Oggi */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-outline-variant pb-3">
              <h3 className="font-bold text-base text-primary flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Oggi
              </h3>
              <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            {/* List block */}
            <div className="flex flex-col gap-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((app: any) => {
                  const isConfirmed = app.status === 'confirmed';
                  const isCancelled = app.status === 'cancelled';
                  const isPending = app.status === 'pending';

                  let borderLeft = 'bg-outline-variant';
                  let statusBg = 'bg-surface-container text-on-surface-variant';
                  let statusLabel = 'In attesa';

                  if (isConfirmed) {
                    borderLeft = 'bg-emerald-500';
                    statusBg = 'bg-emerald-50 text-emerald-700';
                    statusLabel = 'Confermato';
                  } else if (isPending) {
                    borderLeft = 'bg-amber-400';
                    statusBg = 'bg-amber-50 text-amber-700';
                    statusLabel = 'In attesa';
                  } else if (isCancelled) {
                    borderLeft = 'bg-rose-400';
                    statusBg = 'bg-rose-50 text-rose-700';
                    statusLabel = 'Annullato';
                  }

                  const initials = app.leadName 
                    ? app.leadName.substring(0, 2).toUpperCase() 
                    : 'AP';

                  return (
                    <div 
                      key={app.id} 
                      className="border border-outline-variant bg-surface rounded-xl p-4 relative cursor-pointer hover:shadow-sm hover:border-primary/20 transition-all overflow-hidden flex flex-col gap-2"
                    >
                      <div className={`absolute top-0 left-0 w-1.2 h-full ${borderLeft} rounded-l`}></div>
                      
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-mono text-xs font-black text-primary block">
                            {app.startTime} - {app.endTime}
                          </span>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5 block">
                            {app.type}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBg}`}>
                          {statusLabel}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-sm text-primary leading-tight">{app.title}</h4>
                      {app.description && <p className="text-xs text-on-surface-variant leading-relaxed font-medium line-clamp-2">{app.description}</p>}

                      {app.leadName && (
                        <div className="flex items-center gap-2.5 mt-2 pt-2 border-t border-outline-variant/50 bg-transparent">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary">
                            {initials}
                          </div>
                          <div className="bg-transparent">
                            <div className="font-bold text-[11px] text-primary leading-none">{app.leadName}</div>
                            <span className="text-[9px] text-on-surface-variant font-medium mt-0.5 block">Cliente Relazionato</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-outline-variant/70 rounded-xl bg-surface-container-low/20">
                  <Clock className="w-8 h-8 text-on-surface-variant/40 mb-3" />
                  <p className="text-sm font-bold text-primary">Nessun appuntamento per oggi</p>
                  <p className="text-xs text-on-surface-variant max-w-[200px] mt-1 leading-relaxed">
                    Goditi la giornata libera o programma visite guidate con i lead.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Reviews block */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-primary mb-4 flex items-center justify-between border-b border-outline-variant pb-3">
              <span className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-500 shrink-0" />
                Da Confermare
              </span>
              <span className="bg-amber-150 text-amber-800 border border-amber-200 font-mono font-black text-xs px-2 py-0.5 rounded-full">
                {pendingAppointments.length}
              </span>
            </h3>

            <div className="divide-y divide-outline-variant/50 max-h-[350px] overflow-y-auto scrollbar-thin">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((app: any) => (
                  <div key={app.id} className="py-3 first:pt-0 last:pb-0 font-medium">
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0 bg-transparent text-xs leading-normal">
                        <div className="font-bold text-primary font-mono bg-transparent">
                          {app.dateStr} @ {app.startTime}
                        </div>
                        <div className="font-bold text-sm text-primary mt-0.5 truncate bg-transparent">
                          {app.title}
                        </div>
                        <div className="text-on-surface-variant truncate mt-0.5 bg-transparent">
                          {app.type} {app.leadName ? `con ${app.leadName}` : ''}
                        </div>
                        {/* Dynamic confirmation actions component */}
                        <AppointmentConfirmActions appointmentId={app.id} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-outline-variant/50 rounded-xl bg-surface-container-low/20">
                  <Award className="w-7 h-7 text-emerald-500/50 mb-2" />
                  <p className="text-xs text-on-surface-variant font-medium">Nessun appuntamento da confermare</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </AppointmentsClientWrapper>
    </div>
  );
}
