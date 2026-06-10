import React from 'react';

export default function GuestNavigation({ setView, view }) {
  return (
    <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider text-slate-400">
      <button 
        type="button" 
        onClick={() => setView('whatIsGigsda')} 
        className={`hover:text-white transition-colors cursor-pointer ${view === 'whatIsGigsda' ? 'text-cyan-400 font-bold' : ''}`}
      >
        🎵 Was ist gigsda?
      </button>
      <button 
        type="button" 
        onClick={() => setView('guestEvents')} 
        className={`hover:text-white transition-colors cursor-pointer ${view === 'guestEvents' ? 'text-cyan-400 font-bold' : ''}`}
      >
        📡 Events-Radar
      </button>
      <button 
        type="button" 
        onClick={() => setView('radar')} 
        className={`hover:text-white transition-colors cursor-pointer ${view === 'radar' ? 'text-cyan-400 font-bold' : ''}`}
      >
        🔍 Search-Explorer
      </button>
    </div>
  );
}
