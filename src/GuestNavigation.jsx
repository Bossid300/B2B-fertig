import React from 'react';

export default function GuestNavigation({ view, setView }) {
  return (
    <div className="flex items-center gap-6 font-mono text-[10px] font-black tracking-wider uppercase ml-auto shrink-0 select-none">
      
      {/* BUTTON 1: WAS IST GIGSDA */}
      <button
        type="button"
        onClick={() => typeof setView === 'function' && setView('whatIsGigsda')}
        className={`hover:text-white transition-all duration-200 cursor-pointer ${
          view === 'whatIsGigsda' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        🎵 Was ist gigsda?
      </button>

      {/* BUTTON 2: EVENTS-RADAR */}
      <button
        type="button"
        onClick={() => typeof setView === 'function' && setView('guestEvents')}
        className={`hover:text-white transition-all duration-200 cursor-pointer ${
          view === 'guestEvents' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        🏃 Events-Radar
      </button>

      {/* BUTTON 3: SEARCH-EXPLORER */}
      <button
        type="button"
        onClick={() => typeof setView === 'function' && setView('radar')}
        className={`hover:text-white transition-all duration-200 cursor-pointer ${
          view === 'radar' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        🗣️ Search-Explorer
      </button>

      {/* 🚀 DER CYBERPUNK-NEON-LOGIN-BUTTON (REAKTIV IN DIE NAVIBAR INTEGRIERT!) */}
      <div className="shrink-0 pl-4 border-l border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            // Zündet Daniels echten Login-Masken-Wechsler im Router
            if (typeof setView === 'function') {
              setView('login');
            }
          }}
          className="px-5 py-1.5 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-slate-950 hover:text-white font-mono font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Login
        </button>
      </div>

    </div>
  );
}
