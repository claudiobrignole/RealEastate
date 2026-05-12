'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClass = 'max-w-4xl'
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md sm:p-lg">
      <div 
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className={cn(
          "relative bg-surface-container-lowest w-full max-h-[90vh] flex flex-col shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden rounded-xl",
          maxWidthClass
        )}
      >
        <div className="flex items-center justify-between px-md py-md border-b border-outline-variant bg-surface-bright">
          <div>
            <h2 className="font-h3 text-h3 text-primary">{title}</h2>
            {subtitle && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{subtitle}</p>
            )}
          </div>
          <button 
            aria-label="Close modal" 
            onClick={onClose}
            className="p-xs sm:p-base rounded-full hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-md sm:p-lg bg-surface">
          {children}
        </div>

        {footer && (
          <div className="px-md py-md border-t border-outline-variant bg-surface-bright">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
