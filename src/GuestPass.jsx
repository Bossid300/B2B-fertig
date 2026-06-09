import React, { useState } from 'react';
import { Ticket } from 'lucide-react';

export default function GuestPass({ onEnterCenter }) {
  const [passValue, setPassValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passValue.trim()) return;
    
    if (typeof onEnterCenter === 'function') {
      onEnterCenter(passValue);
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-5 rounded-2xl shadow-xl space-y-4 font-mono text-xs max-w-sm mx-auto my-4">
      <div className="flex justify-between items-center border-b border-slate-900 pb-2">
        <span className="text-[9px] text-cyan-400 font-bold tracking-widest uppercase">// GIGSDA GAST-PASS ACCES</span>
        <Ticket className="w-3.5 h-3.5 text-cyan-400" />
      </div>
      
      <p className="text-[10px] text-slate-400 leading-relaxed">
        Trage deinen Einlass-Pass oder Ticket-Token ein, um direkt auf das Projekt-Radar zuzugreifen.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={passValue}
          onChange={(e) => setPassValue(e.target.value)}
          placeholder="z.B. WINSTON-JUD-2026"
          className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/40 text-white rounded-xl px-3 py-2 text-xs outline-none transition-colors uppercase tracking-wider font-bold"
        />
        
        <button
          type="submit"
          className="w-full bg-cyan-950/60 border border-cyan-800 hover:border-cyan-500 text-cyan-400 hover:text-white font-black uppercase tracking-widest py-2 rounded-xl text-[10px] transition-all cursor-pointer shadow-lg"
        >
          PASS VALIDIEREN ⚡
        </button>
      </form>
    </div>
    
  );
}
