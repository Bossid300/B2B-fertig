import React from "react";

export default function Roadmap() {
  return (
    <div className="w-full border border-cyan-500/20 rounded-3xl bg-slate-950/60 backdrop-blur-md p-6">

      <div className="mb-6">
        <h2 className="text-cyan-400 text-xl font-black uppercase tracking-widest">
          🚀 Building Gigsda In Public
        </h2>

        <p className="text-slate-400 text-sm mt-2">
          Live Entwicklungsstand der Plattform.
        </p>
      </div>

      <div className="space-y-6">

        <div>
          <h3 className="text-green-400 font-black uppercase text-xs tracking-widest mb-2">
            ✅ Foundation
          </h3>


<ul className="text-slate-300 text-sm space-y-1">
  <li>Crew-System</li>
  <li>Event-Radar</li>
  <li>Search-Explorer</li>
  <li>Matrix-Suche</li>
  <li>Community Chat</li>
  <li>Crew-Historie</li>
  <li>Crew Lifecycle</li>
  <li>Rollen & Zugriffe</li>
  <li>Persistenter Chat</li>
  <li>Hero Video Feed</li>
  <li>Navigation Refresh</li>
  <li>Portfolio V2</li>
  <li>↓</li>
  <li>GIGSDA Pass</li>
</ul>


        </div>

        <div>
          <h3 className="text-yellow-400 font-black uppercase text-xs tracking-widest mb-2">
            🔄 In Progress
          </h3>


<ul className="text-slate-300 text-sm space-y-1">
  <li>🔴 Notification Engine</li>
  <li>💬 WhatsApp-Style Konversationen</li>
  <li>🎛️ Rider & Gewerke Erweiterung</li>
  <li>📡 Projektkommunikation 2.0</li>
</ul>

        </div>

        <div>
          <h3 className="text-cyan-400 font-black uppercase text-xs tracking-widest mb-2">
            🎯 Next Milestones
          </h3>


<ul className="text-slate-300 text-sm space-y-1">
  <li>🔴 Echte Ungelesen-Logik</li>
  <li>💬 Direktnachrichten V2</li>
  <li>📄 Projektchronik</li>
  <li>📦 Veranstalter-Export</li>
  <li>🔒 Chat nach Event readonly</li>
  <li>📎 Datei- & Rider-Austausch im Chat</li>
</ul>

        </div>

        <div>
          <h3 className="text-purple-400 font-black uppercase text-xs tracking-widest mb-2">
            🌌 Vision
          </h3>

          <p className="text-slate-300 text-sm leading-relaxed">
            Eine Plattform für Veranstalter, Crews, Künstler und
            Dienstleister – von der Suche über die Planung bis zum
            Projektabschluss.
          </p>
        </div>

<div>
  <h3 className="text-cyan-400 font-black uppercase text-xs tracking-widest mb-2">
    ☕ Last Update
  </h3>

  <ul className="text-slate-300 text-sm space-y-1">
    <li>✅ Crew History</li>
    <li>✅ Removed & Rehire Workflow</li>
    <li>✅ Persistent Chat</li>
    <li>✅ Hero Video Feed</li>
    <li>✅ Navigation Refresh</li>
    <li>✅ Chat V1 Complete</li>
    <li>✅ Notification UI</li>
   
    <li>✅ Portfolio V2 Foundation</li>
    <li>✅ Artist Portfolio Dynamic Data</li>
    <li>✅ Media Showcase Integration</li>
    <li>✅ Technical Rider Integration</li>
    <li>✅ GIGSDA Pass Component</li>
    <li>✅ QR Access Prototype</li>

  </ul>
</div>


      </div>
    </div>
  );
}