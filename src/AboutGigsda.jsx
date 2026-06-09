import React from 'react';
import { Shield, Eye, Lock, ArrowRight, CheckCircle2, XCircle, Users, Zap, Calendar } from 'lucide-react';
import WhatIsGigsda from './WhatIsGigsda';

export default function AboutGigsda({ onBack, onTriggerGate, onSwitchToRegister }) {
  return (
    <div className="max-w-5xl mx-auto space-y-12 my-6 p-4 text-xs">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">// Layout.pdf — Seite 4</span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">Konzept & Funktionsweise</h2>
          <p className="text-slate-400 text-[11px] mt-0.5">Die klare Trennung zwischen Information und Aktion auf gigsda.com</p>
        </div>
        <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-[11px] font-bold transition-all shrink-0">
          Zurück zur Startseite
        </button>
      </div>

      {/* DIE 3 SÄULEN ALS BASIS OBEN DRAUF */}
      <WhatIsGigsda onTriggerGate={onTriggerGate} />

      {/* ZWEI-SPALTEN-MATRIX: BESUCHER VS. MITGLIEDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LINKS: WAS KÖNNEN BESUCHER TUN? (INFORMATIONSEBENE) */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl relative">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-black text-white">1. Unangemeldete Besucher (Gäste)</h3>
              <p className="text-[9px] font-mono text-slate-500 uppercase">Die reine Informationsebene</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans">
            Als Gast bist du stiller Beobachter des Ökosystems. Du hast vollen Einblick in die Transparenz-Daten der Plattform, um dich von der Qualität zu überzeugen, bevor du Daten von dir preisgibst.
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Öffentliche Portfolios einsehen:</strong> Betrachte verifizierte Acts, Bands und Musiker-Präsenzen (wie op-winston.html).</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Regionaler Event-Kalender:</strong> Sieh ein, welche Gigs, Open-Airs und Hallen-Konzerte in deiner Umgebung geplant sind.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Infrastruktur prüfen:</strong> Überzeuge dich im Sucher von der Dichte an Technikern und Verleihern in deiner PLZ-Region.</span>
            </div>
          </div>
        </div>

        {/* RECHTS: WELCHEN MEHRWERT HABEN MITGLIEDER? (AKTIONSEBENE) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative">
          <div className="absolute top-0 right-4 -translate-y-1/2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[8px] uppercase px-2 py-0.5 rounded-full font-bold">
            Aktionsebene
          </div>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white">2. Registrierte Mitglieder (Acts, Clubs, Crew)</h3>
              <p className="text-[9px] font-mono text-amber-500 uppercase">Das vollaktive Kontrollzentrum</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans">
            Erst mit einem kostenlosen Account erwacht gigsda zum Leben. Du verlässt die passive Zuschauerrolle und steuerst Events aktiv über dezentrale, automatisierte Tools.
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-start gap-2 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Interaktive Eingabemasken (op-input):</strong> Verwalte Gagen, CEE-Strombedarf, Backline-Listen und lade Medien bis zu 500 MB hoch.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Direkte Verhandlung & Zusage:</strong> Nutze den Echtzeit-Chat mit Locations und versiegele Gagen rechtssicher per digitalem Klick-Vertrag.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Demokratische Abstimmungen:</strong> Stimme im internen Crew-Voting über Wunschtermine ab, um unkompliziert den Sack zuzumachen.</span>
            </div>
          </div>
        </div>

      </div>

      {/* MITGLIEDSCHAFTS-BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-2">
          <h4 className="text-base font-black text-white">Bereit, die Event-Organisation zu revolutionieren?</h4>
          <p className="text-slate-400 leading-normal font-sans">Egal ob du Musiker bist, der nach Gigs sucht, eine Bühne besitzt oder als Techniker den Sound mischt — gigsda schließt den Kreis.</p>
        </div>
        <button 
          type="button" 
          onClick={onSwitchToRegister}
          className="bg-emerald-400 text-slate-950 font-black px-6 h-11 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-1.5"
        >
          Jetzt kostenloses Konto erstellen <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
