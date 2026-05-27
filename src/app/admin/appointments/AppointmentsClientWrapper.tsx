'use client';

import { useState, createContext, useContext } from 'react';
import NewAppointmentModal from './NewAppointmentModal';
import { Plus } from 'lucide-react';

const AppointmentsContext = createContext<{
  setShowModal: (show: boolean) => void;
}>({
  setShowModal: () => {}
});

export function useAppointments() {
  return useContext(AppointmentsContext);
}

interface AppointmentsClientWrapperProps {
  children: React.ReactNode;
  appointments?: any[]; // optional prop representing fetched appointments if needed
}

export default function AppointmentsClientWrapper({ children, appointments }: AppointmentsClientWrapperProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppointmentsContext.Provider value={{ setShowModal }}>
      <div className="w-full flex flex-col md:flex-row gap-gutter" id="appointments-wrapper">
        {children}
        
        {showModal && (
          <NewAppointmentModal 
            onClose={() => setShowModal(false)}
            onCreated={() => {}}
          />
        )}
      </div>
    </AppointmentsContext.Provider>
  );
}

// Named export for the "Nuovo Appuntamento" button
export function NewAppointmentButton() {
  const { setShowModal } = useAppointments();

  return (
    <button 
      onClick={() => setShowModal(true)}
      className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/95 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2 shrink-0"
      id="btn-trigger-new-appointment"
      type="button"
    >
      <Plus className="w-4 h-4" />
      Nuovo Appuntamento
    </button>
  );
}
