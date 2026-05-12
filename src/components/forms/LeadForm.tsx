'use client';

import React, { useActionState } from 'react';
import { createLead } from '@/lib/actions/leads';

interface LeadFormProps {
  projectId: string;
  variant?: 1 | 2 | 3 | 4;
}

export default function LeadForm({ projectId, variant = 1 }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(createLead, null);

  if (state?.success) {
    return (
      <div className={`p-lg rounded shadow-sm text-center ${variant === 3 ? 'bg-[#111] border border-outline/20' : 'bg-surface-container border border-outline-variant'}`}>
        <svg className={`w-12 h-12 mx-auto mb-sm ${variant === 3 ? 'text-tertiary-fixed' : 'text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className={`font-h3 text-h3 mb-xs ${variant === 3 ? 'text-on-primary' : 'text-primary'}`}>Richiesta Inviata</h3>
        <p className={`font-body-sm text-body-sm ${variant === 3 ? 'text-surface-dim' : 'text-on-surface-variant'}`}>Il nostro team ti contatterà al più presto.</p>
      </div>
    );
  }

  // Common button text based on status
  const buttonText = isPending ? 'Invio in corso...' : 'Request Details';

  if (variant === 4) {
    return (
      <form action={formAction} className="space-y-sm flex flex-col">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="text" name="name" required placeholder="Full Name" className="bg-surface border border-outline-variant px-sm py-sm rounded focus:outline-none focus:border-primary" />
        <input type="email" name="email" required placeholder="Email" className="bg-surface border border-outline-variant px-sm py-sm rounded focus:outline-none focus:border-primary" />
        <input type="tel" name="phone" placeholder="Phone" className="bg-surface border border-outline-variant px-sm py-sm rounded focus:outline-none focus:border-primary" />
        {state?.error && <p className="text-error text-sm">{state.error}</p>}
        <button type="submit" disabled={isPending} className="mt-xs bg-primary text-on-primary py-3 rounded font-label-caps text-label-caps uppercase tracking-wider hover:bg-tertiary transition-colors disabled:opacity-50">
          {buttonText}
        </button>
      </form>
    );
  }

  if (variant === 3) {
    return (
      <form action={formAction} className="text-left space-y-md">
        <input type="hidden" name="projectId" value={projectId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div>
            <input type="text" name="firstName" required className="w-full bg-[#111] border border-outline/20 p-md text-on-primary focus:outline-none focus:border-tertiary-fixed transition-colors font-body-sm" placeholder="First Name" />
          </div>
          <div>
            <input type="text" name="lastName" className="w-full bg-[#111] border border-outline/20 p-md text-on-primary focus:outline-none focus:border-tertiary-fixed transition-colors font-body-sm" placeholder="Last Name" />
          </div>
        </div>
        <div>
          <input type="email" name="email" required className="w-full bg-[#111] border border-outline/20 p-md text-on-primary focus:outline-none focus:border-tertiary-fixed transition-colors font-body-sm" placeholder="Email Address" />
        </div>
        <div>
          <textarea name="message" className="w-full bg-[#111] border border-outline/20 p-md h-32 text-on-primary focus:outline-none focus:border-tertiary-fixed transition-colors font-body-sm resize-none" placeholder="Message or Preference..."></textarea>
        </div>
        {state?.error && <p className="text-error text-sm">{state.error}</p>}
        <button type="submit" disabled={isPending} className="w-full bg-tertiary-fixed text-on-tertiary-fixed py-md font-label-caps uppercase tracking-[0.2em] hover:bg-tertiary transition-all duration-300 mt-md disabled:opacity-50">
          {buttonText}
        </button>
      </form>
    );
  }

  if (variant === 2) {
    return (
      <form action={formAction} className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-md">
        <input type="hidden" name="projectId" value={projectId} />
        <input type="text" name="name" required className="border-b border-outline bg-transparent py-sm focus:outline-none focus:border-tertiary transition-colors" placeholder="Full Name" />
        <input type="email" name="email" required className="border-b border-outline bg-transparent py-sm focus:outline-none focus:border-tertiary transition-colors" placeholder="Email Address" />
        <input type="tel" name="phone" className="border-b border-outline bg-transparent py-sm focus:outline-none focus:border-tertiary transition-colors" placeholder="Phone Number" />
        {state?.error && <p className="text-error text-sm">{state.error}</p>}
        <button type="submit" disabled={isPending} className="mt-md bg-primary text-on-primary py-4 rounded-full font-label-caps uppercase tracking-widest hover:bg-tertiary transition-colors disabled:opacity-50">
          {buttonText}
        </button>
      </form>
    );
  }

  // Variant 1
  return (
    <form action={formAction} className="bg-surface text-on-surface p-xl rounded border border-outline/20 text-left shadow-lg">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
        <div className="flex flex-col">
          <label className="font-label-caps text-on-surface-variant mb-xs">First Name</label>
          <input type="text" name="firstName" required className="border border-outline bg-surface-container-lowest p-sm focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" placeholder="Your name" />
        </div>
        <div className="flex flex-col">
          <label className="font-label-caps text-on-surface-variant mb-xs">Last Name</label>
          <input type="text" name="lastName" className="border border-outline bg-surface-container-lowest p-sm focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" placeholder="Your surname" />
        </div>
      </div>
      <div className="flex flex-col mb-md">
        <label className="font-label-caps text-on-surface-variant mb-xs">Email Address</label>
        <input type="email" name="email" required className="border border-outline bg-surface-container-lowest p-sm focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" placeholder="your@email.com" />
      </div>
      <div className="flex flex-col mb-lg">
        <label className="font-label-caps text-on-surface-variant mb-xs">Message (Optional)</label>
        <textarea name="message" className="border border-outline bg-surface-container-lowest p-sm h-32 focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary" placeholder="How can we help you?"></textarea>
      </div>
      {state?.error && <p className="text-error text-sm mb-md">{state.error}</p>}
      <button type="submit" disabled={isPending} className="w-full bg-primary text-on-primary py-md font-label-caps uppercase tracking-widest hover:bg-tertiary transition-colors disabled:opacity-50">
        {buttonText}
      </button>
    </form>
  );
}
