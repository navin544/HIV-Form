
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="bg-white rounded-lg mb-3 shadow-sm overflow-hidden">
      <div 
        className="bg-slate-700 text-white cursor-pointer px-5 py-4 font-semibold select-none flex justify-between items-center hover:bg-slate-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      {isOpen && (
        <div className="p-5 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </section>
  );
};
