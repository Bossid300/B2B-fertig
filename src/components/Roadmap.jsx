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

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* FERTIG */}
  <div className="bg-slate-900/30 border border-emerald-500/20 rounded-3xl p-6">
    <h3 className="text-emerald-400 font-black text-lg mb-4">
      ✅ Stabil & Erledigt
    </h3>


<div className="space-y-2 text-sm text-slate-300">

  <p>✅ Crew-System</p>
  <p>✅ Event-Radar</p>
  <p>✅ Search-Explorer</p>
  <p>✅ Matrix-Suche</p>
  <p>✅ Community Chat</p>
  <p>✅ Crew Lifecycle</p>
  <p>✅ Portfolio V2</p>
  <p>✅ GIGSDA Pass</p>
  <p>✅ Portfolio Referenzen</p>
  <p>✅ Auto Referenzen</p>
  <p>✅ QR Access Prototype</p>
  <p>✅ Winston Referenzen repariert</p>
  <p>✅ Requests repariert</p>
  <p>✅ Favorites repariert</p>
  <p>✅ Login → gigsda_profiles</p>
  <p>✅ Registrierung → gigsda_profiles</p>
  <p>✅ Profil löschen getestet</p>
  <p>✅ gigsda_users entfernt</p>

  <p>✅ RiderZentrale</p>
  <p>✅ Rider-Freigabelogik</p>
  <p>✅ Rider-Statussystem</p>
  <p>✅ Rider-Profilnavigation</p>
  <p>✅ Künstler-Rider</p>
  <p>✅ Location-Rider</p>
  <p>✅ Techniker-Rider</p>
  <p>✅ Material / Verleiher Rider</p>
  <p>✅ Fan Support Rider</p>
  <p>✅ Rider-Check Veranstalterübersicht</p>
  <p>✅ Rollenfarben & Statuslogik</p>
  <p>✅ Owner-Konzept statt Veranstalter-Rolle</p>

</div>

  </div>

  {/* IN ARBEIT */}
  <div className="bg-slate-900/30 border border-cyan-500/20 rounded-3xl p-6">
    <h3 className="text-cyan-400 font-black text-lg mb-4">
      🔄 In Entwicklung
    </h3>


<div className="space-y-2 text-sm text-slate-300">

  <p>🔄 Event Planner</p>
  <p>🔄 Event bearbeiten</p>
  <p>🔄 Notification Engine</p>
  <p>🔄 Ungelesen-Logik</p>
  <p>🔄 Direktnachrichten V2</p>
  <p>🔄 WhatsApp Style Chat</p>
  <p>🔄 Projektchronik</p>
  <p>🔄 Veranstalter Export</p>
  <p>🔄 Datei Austausch</p>
  <p>🔄 Media Showcase</p>
  <p>🔄 Gallery</p>
  <p>🔄 Tech Overview</p>
  <p>🔄 Technical Rider</p>
  <p>🔄 Responsive Portfolio</p>
  <p>🔄 Responsive GIGSDA Pass</p>
  <p>🔄 Datenbank statt LocalStorage</p>

</div>

  </div>


  {/* NEXT */}
  <div className="bg-slate-900/30 border border-violet-500/20 rounded-3xl p-6">
    <h3 className="text-fuchsia-400 font-black text-lg mb-4">     
      🎯 Nächste Milestones
    </h3>


<div className="space-y-2 text-sm text-slate-300">

  <p>🎯 Event Planner fertigstellen</p>
  <p>🎯 Event Bearbeitung integrieren</p>
  <p>🎯 Notification Center fertigstellen</p>
  <p>🎯 Read / Unread Logik</p>
  <p>🎯 Datei Upload im Chat</p>
  <p>🎯 Event Timeline</p>
  <p>🎯 Veranstalter Export</p>
  <p>🎯 Mobile Optimierung</p>
  <p>🎯 Datenbank Migration</p>
  <p>🎯 API & Backend Vorbereitung</p>

</div>



  </div>
</div>
    </div>
  );
}