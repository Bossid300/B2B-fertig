import React from 'react';
import { Mail, CheckCircle2, ArrowUpRight, DollarSign } from 'lucide-react';

export default function IncomingMessages() {
  // Statische Beispiel-Deals (Bereit für den LocalStorage-Einzug im zweiten Schritt)
  const incomingDeals = [
    {
      id: "INC-901",
      event: "Stadtpark OpenAir",
      sender: "Bundy (Drums)",
      type: "CREW-ZUSAGE",
      text: "✓ Hat die Einladung für die Show am 15. Aug angenommen.",
      badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-900/30",
      actionText: "Crew einsehen"
    },
    {
      id: "INC-902",
      event: "Winston Jud - Live & Unplugged",
      sender: "Club Matrix, Linz",
      type: "GAGEN-OFFER",
      text: "💰 Neues Gagen-Angebot eingegangen: 2.400,00 € Festgage.",
      badgeColor: "text-purple-400 bg-purple-950/40 border-purple-900/30",
      actionText: "Deal Verhandeln"
    },
    {
      id: "INC-903",
      event: "Rock Night Salzburg",
      sender: "System Dispatcher",
      type: "RIDER-ALARM",
      text: "⚠️ Der technische Rider wurde vom Local-Tech abgelehnt (Strombedarf!).",
      badgeColor: "text-amber-400 bg-amber-950/40 border-amber-900/30",
      actionText: "Rider öffnen"
    }
  ];

  return (
    <div className="mt-6 space-y-4 animate-fade-in font-mono text-xs text-slate-300">
      
      {/* HEADER-TRENNLINIE */}
      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-3">
        <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest font-black">
          <Mail className="w-3 h-3 text-purple-400" /> // Incoming Request-Pipeline
        </div>
        <span className="text-[9px] text-purple-500 font-bold bg-purple-950/20 border border-purple-900/30 px-1.5 py-0.5 rounded">
          {incomingDeals.length} Dringend
        </span>
      </div>

      {/* REIHUNG DER ANFRAGEN */}
      <div className="space-y-3">
        {incomingDeals.map((deal) => (
          <div 
            key={deal.id}
            className="bg-slate-950/80 backdrop-blur-md border border-slate-900 p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-slate-800 transition-colors group overflow-hidden"
          >
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border ${deal.badgeColor}`}>
                  {deal.type}
                </span>
                <span className="text-[9px] text-slate-600 font-bold">
                  {deal.id}
                </span>
                <span className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">
                  • {deal.event}
                </span>
              </div>
              <div className="text-white font-black uppercase text-[11px] tracking-tight">
                {deal.sender}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {deal.text}
              </p>
            </div>

            {/* AKTION-BUTTON */}
            <div className="shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => alert(`Aktion '${deal.actionText}' wird mit LocalStorage verknüpft.`)}
                className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              >
                {deal.actionText} <ArrowUpRight className="w-3 h-3 text-purple-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
