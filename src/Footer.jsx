import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-900 mt-20 pt-8 pb-6 bg-slate-950 font-sans text-xs tracking-wide">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* OBERFOOTER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-500 font-medium">
          <div className="space-y-2">
            <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1">Rechtliches</h5>
            <span className="block hover:text-slate-300 cursor-pointer">Nutzungsbedingungen</span>
            <span className="block hover:text-slate-300 cursor-pointer">Datenschutzerklärung</span>
            <span className="block hover:text-slate-300 cursor-pointer">AGB</span>
          </div>
          <div className="space-y-2">
            <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1">Sicherheit & Hilfe</h5>
            <span className="block hover:text-slate-300 cursor-pointer">Richtlinien & Sicherheit</span>
            <span className="block hover:text-slate-300 cursor-pointer">FAQ</span>
            <span className="block hover:text-slate-300 cursor-pointer">Tutorials</span>
          </div>
          <div className="space-y-2">
            <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1">Unternehmen</h5>
            <span className="block hover:text-slate-300 cursor-pointer">Über uns</span>
            <span className="block hover:text-slate-300 cursor-pointer">Zahlungsarten</span>
            <span className="block hover:text-slate-300 cursor-pointer">Sponsoren</span>
          </div>
          
          <div className="space-y-3 flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
            <div className="space-y-2 w-full">
              <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1">Kontakt</h5>
              <span className="block hover:text-slate-300 cursor-pointer">Impressum</span>
              <span className="block hover:text-slate-300 cursor-pointer">Kontakt-Support</span>
            </div>
            
            <button 
              type="button" 
              onClick={scrollToTop}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-emerald-400 rounded-xl text-slate-400 hover:text-white transition-all shadow-md group flex items-center gap-1.5 font-mono text-[9px] uppercase font-bold"
            >
              <span>Top</span> <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* UNTERFOOTER */}
        <div className="border-t border-t-slate-900 pt-4 flex justify-between items-center text-slate-600 text-[11px]">
          <p>Copyright © 2026 GIGDATA GmbH // All Rights Reserved.</p>
          <p className="text-[10px] text-slate-700 font-mono">gigsda Ökosystem v2.0</p>
        </div>

      </div>
    </footer>
  );
}
