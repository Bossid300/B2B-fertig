import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function GuestNavigation({ setView, activeView }) {
  // Lokaler Zustand für das mobile Aufklapp-Menü (Burger)
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (viewName) => {
    if (typeof setView === 'function') {
      setView(viewName);
    }
    setIsOpen(false); // Schließt das Menü auf dem Handy nach dem Klick automatisch
  };

  // Dein originaler, flacher Desktop-Look ohne klobige Rahmen
  const desktopBase = "uppercase text-xs font-black tracking-wider transition-all cursor-pointer font-mono";
  const activeClass = "text-purple-400 font-bold";
  const inactiveClass = "text-slate-400 hover:text-white";

  // Der saubere Mobile-Style für die ausgeklappten Punkte untereinander
  const mobileBase = "w-full text-left px-3 py-2 rounded-xl text-[10px] font-mono tracking-widest border border-slate-900 uppercase";

  return (
    <div className="w-full backdrop-blur-md border-slate-900 shadow-xl select-none sticky top-0 z-50 font-mono">
      <div className="w-full max-w-7xl mx-auto px-4 py-1.0 flex items-center justify-between sm:justify-end gap-6">
        
        {/* ── DESKTOP NAVIGATIONS-LINKS (EXAKT DEINE ORIGINALEN PUNKTE VON GITHUB) ── */}
        <div className="hidden sm:flex items-center gap-4 select-none ml-auto shrink-0">
          <button onClick={() => handleNavClick('whatIsGigsda')} 
          className={`${desktopBase} ${activeView === 'whatIsGigsda' ? activeClass : inactiveClass}`}>
            🎵 Was ist gigsda?
          </button>
          <button onClick={() => handleNavClick('guestEvents')} 
          className={`${desktopBase} ${activeView === 'guestEvents' ? activeClass : inactiveClass}`}>
            🏃 Events-Radar
          </button>
          <button onClick={() => handleNavClick('radar')} 
          className={`${desktopBase} ${activeView === 'radar' ? activeClass : inactiveClass}`}>
            🗣 Search-Explorer
          </button>
          <button onClick={() => handleNavClick('artists')}
            className={`${desktopBase} ${activeView === 'artists' ? activeClass : inactiveClass}`}>
            🔍 Matrix-Suche
          </button>

        </div>

        {/* LOGIN */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0 pl-2">
          <button 
            onClick={() => handleNavClick('login')} 
            className="px-5 py-1.5 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-mono font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-md transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            [ Login ]
          </button>

          {/* DIE VIER STRICHE (BURGER-BUTTON): Nur sichtbar auf Handys */}
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)} 
            className="sm:hidden p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {isOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

      </div>

      {/* ── MOBILE DROP-DOWN (KLAPPT SAUBER UNTEREINANDER RECHTSBÜNDIG AUF) ── */}
      {isOpen && (
        <div className="sm:hidden w-full bg-slate-950 border-t border-slate-900 p-3 flex flex-col gap-1.5 animate-fadeIn">
          <button onClick={() => handleNavClick('whatIsGigsda')} className={`${mobileBase} ${activeView === 'whatIsGigsda' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            🎵 Was ist gigsda?
          </button>
          <button onClick={() => handleNavClick('guestEvents')} className={`${mobileBase} ${activeView === 'guestEvents' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            🏃 Events-Radar
          </button>
          <button onClick={() => handleNavClick('radar')} className={`${mobileBase} ${activeView === 'radar' ? "bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold" : "text-slate-400 border-transparent"}`}>
            🗣 Search-Explorer
          </button>
        </div>
      )}
    </div>
  );
}
