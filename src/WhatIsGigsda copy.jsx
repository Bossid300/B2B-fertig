import React from 'react';
import { Award, Layers, CheckCircle2, Eye, ShieldAlert, ArrowRight } from 'lucide-react';

export default function WhatIsGigsda() {
  return (
    <div className="max-w-5xl mx-auto my-8 p-6 space-y-8 text-slate-100 font-sans antialiased select-none animate-fade-in">
      
      {/* HEADER-TITELBLÖCKE */}
      <div className="border-b border-slate-900 pb-4">
        <span className="text-sm text-slate-500 uppercase tracking-widest font-mono font-bold">
          // WAS IST GIGSDA?
        </span>
        <h2 className="text-4xl font-black text-white uppercase tracking-tight mt-1">
          Konzept & Funktionsweise
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-sans">
          Die klare Trennung zwischen Information und Aktion auf gigsda.com
        </p>
      </div>

      {/* DAS GIGSDA-PRINZIP: 3 SÄULEN DER EVENT-REVOLUTION */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-emerald-400 uppercase tracking-wide flex items-center gap-2">
            ⚙️ Das gigsda-Prinzip: Wie es funktioniert
          </h3>
          <span className="text-sm text-slate-600 font-mono uppercase block tracking-wider">
            INFORMATIONSEBENE // DIE 3 SÄULEN DER EVENT-REVOLUTION
          </span>
        </div>

        {/* Die 3 Spalten Kacheln */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xm">
          {/* Säule 1 */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-2 hover:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <Layers className="w-4 h-4 text-cyan-400" /> 
              1. Digitaler Rider
            </div>
            <p className="text-slate-500 text-xm font-sans leading-relaxed">
              Keine veralteten PDF-Dateien mehr. Sämtliche technische Daten fließen live in euer Portfolio.
            </p>
          </div>
          {/* Säule 2 */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-2 hover:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <Eye className="w-4 h-4 text-emerald-400" /> 
              2. Realtime-Radar
            </div>
            <p className="text-slate-500 text-xm font-sans leading-relaxed">
              Finden statt ewig Suchen. Booker filtern Acts nach Region, CEE-Stromanschluss oder Mindestgage.
            </p>
          </div>
          {/* Säule 3 */}
          <div className="bg-slate-950/40 border border-purple-500/20 rounded-2xl p-4 space-y-2 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> 
              3. Der Zusage-Deal
            </div>
            <p className="text-slate-500 text-xm font-sans leading-relaxed">
              Rechtssicherheit per Klick. Verträge und Rider-Freigaben werden digital unzerstörbar besiegelt.
            </p>
          </div>
        </div>
      </div>

      {/* FOKUS BOX: DER ZUSAGE DEAL */}
      <div className="bg-slate-950/60 border border-slate-900 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
        <div className="space-y-1">
          <span className="text-xm text-purple-400 font-mono uppercase block">
            // FOKUS: 3. DER ZUSAGE-DEAL
          </span>
          <p className="text-slate-400 text-xm leading-relaxed font-sans max-w-2xl">
            Sobald die Verhandlung im integrierten Chat abgeschlossen ist, generiert das System eine digitale Direktvereinbarung. Gage, Uhrzeiten und Lärmschutzauflagen werden per digitaler Signatur unverzüglich rechtssicher besiegelt.
          </p>
        </div>
        <div className="flex justify-between items-center border-t border-slate-900/60 pt-3 text-xm">
          <span className="text-slate-600 font-mono">
            Möchtest du dieses Tool live in deinem eigenen Dashboard nutzen?
          </span>
          <button type="button" className="text-white font-bold flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer">
            Werkzeug freischalten ➔
          </button>
        </div>
      </div>

      {/* AKTIONSEBENE: GÄSTE VS MITGLIEDER */}
      <div className="space-y-4 pt-2">
        <div className="text-right">
          <span className="text-xm bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 font-mono uppercase tracking-widest px-2 py-0.5 rounded">
            Aktionsebene
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sl">
          
          {/* Linker Block: Unangemeldete Besucher */}
          <div className="space-y-4 bg-slate-950/20 border border-slate-900 p-5 rounded-3xl">
            <div className="space-y-1">
              <h4 className="text-xm font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" /> 
                1. Unangemeldete Besucher (Gäste)
              </h4>
              <span className="text-sm text-slate-600 font-mono uppercase block">
                // DIE REINE INFORMATIONSEBENE</span>
            </div>
            <p className="text-slate-500 font-sans leading-relaxed">
              Als Gast bist du stiller Beobachter des Ökosystems. Du hast vollen Einblick in die Transparenz-Daten der Plattform, um dich von der Qualität zu überzeugen, bevor du Daten von dir preisgibt.
            </p>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">➔</span> 
                <span><strong className="text-slate-300">Öffentliche Portfolios einsehen:</strong> 
                Betrachte verifizierte Acts, Bands und Musiker-Präsenzen (wie op-winston.html).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">➔</span> 
                <span><strong className="text-slate-300">Regionaler Event-Kalender:</strong> 
                Sieh ein, welche Gigs, Open-Airs und Hallen-Konzerte in deiner Umgebung geplant sind.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">➔</span> 
                <span><strong className="text-slate-300">Infrastruktur prüfen:</strong> 
                Überzeuge dich im Sucher von der Dichte an Technikern und Verleihern in deiner PLZ-Region.
                </span>
              </li>
            </ul>
          </div>

          {/* Rechter Block: Registrierte Mitglieder */}
          <div className="space-y-4 bg-slate-950/20 border border-slate-900 p-5 rounded-3xl">
            <div className="space-y-1">
              <h4 className="text-xm font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> 
                2. Registrierte Mitglieder (Acts, Clubs, Crew)
              </h4>
              <span className="text-sm text-slate-600 font-mono uppercase block">
                // DAS VOLLAKTIVE KONTROLLZENTRUM
              </span>
            </div>
            <p className="text-slate-500 font-sans leading-relaxed">
              Erst mit einem kostenlosen Account erwacht gigsda zum Leben. Du verlässt die passive Zuschauerrolle und steuerst Events aktiv über dezentrale, automatisierte Tools.
            </p>
            <ul className="space-y-2 text-slate-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">⚡</span> <span><strong className="text-slate-300">Interaktive Eingabemasken (op-input):</strong> Verwalte Gagen, CEE-Strombedarf, Backline-Listen und lade Medien bis zu 500 MB hoch.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">⚡</span> <span><strong className="text-slate-300">Direkte Verhandlung & Zusage:</strong> Nutze den Echtzeit-Chat mit Locations und versiegele Gagen rechtssicher per digitalem Klick-Vertrag.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">⚡</span> <span><strong className="text-slate-300">Demokratische Abstimmungen:</strong> Stimme im internen Crew-Voting über Wunschtermine ab, um unkompliziert den Sack zuzumachen.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION AREA */}
      <div className="pt-6 text-center space-y-4 border-t border-slate-900 max-w-xl mx-auto">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Bereit, die Event-Organisation zu revolutionieren?
          </h3>
          <p className="text-slate-500 text-sm font-sans">
            Egal ob du Musiker bist, der nach Gigs sucht, eine Bühne besitzt oder als Techniker den Sound mischt — gigsda schließt den Kreis.
          </p>
        </div>
        <button 
          type="button" 
          className="bg-emerald-500 text-slate-950 font-black h-11 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xl inline-flex items-center gap-2 hover:bg-emerald-400"
        >
          Jetzt kostenloses Konto erstellen ➔
        </button>
      </div>

    </div>
  );
}
