import React from 'react';
import { DollarSign, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export default function ManagerOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in font-mono text-xs text-slate-300">
      
      {/* 💳 KACHEL 1: FINANZ-MONITORING */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-4 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">// LIQUIDITÄT & BUDGETS</div>
          <DollarSign className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">VERFÜGBAR:</span>
            <span className="text-cyan-400 font-bold">14.500,00 €</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">GEBUNDEN:</span>
            <span className="text-purple-400 font-bold">8.320,00 €</span>
          </div>
          <div className="flex justify-between border-t border-slate-900/50 pt-1">
            <span className="text-slate-400">PIPELINE (TOTAL):</span>
            <span className="text-white font-bold">22.820,00 €</span>
          </div>
        </div>
      </div>

      {/* 🚨 KACHEL 2: CRITICAL HOT-ZONE */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-4 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">// NEXT ACTION REQUIRED</div>
          <AlertTriangle className="w-3 h-3 text-amber-500" />
        </div>
        <div className="space-y-1">
          <div className="text-white font-bold uppercase tracking-tight truncate">
            Winston Jud - Live & Unplugged
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-amber-500">ENGPASS:</span>
            <span className="text-slate-400 uppercase">1. Crew-Shortlist (0%)</span>
          </div>
          <div className="text-[9px] text-slate-500 italic mt-1">
            ⚠️ 3 Musiker-Anfragen warten auf Rückmeldung!
          </div>
        </div>
      </div>

      {/* 📈 KACHEL 3: PERFORMANCE-TICKER */}
      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-4 rounded-2xl shadow-xl flex flex-col justify-between space-y-3">
        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black">// LIVE COUNTER & METRICS</div>
          <TrendingUp className="w-3 h-3 text-purple-400" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-900/40 p-1.5 rounded-xl border border-slate-900/50">
            <div className="text-lg font-black text-white">4</div>
            <div className="text-[8px] text-slate-500 uppercase font-bold">Aktive Events</div>
          </div>
          <div className="bg-slate-900/40 p-1.5 rounded-xl border border-slate-900/50">
            <div className="text-lg font-black text-purple-400">2</div>
            <div className="text-[8px] text-slate-500 uppercase font-bold">Zusage-Deals</div>
          </div>
        </div>
      </div>

    </div>
  );
}
