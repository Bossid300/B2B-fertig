import React from "react";
import Footer from "../../Footer";

export default function CareerPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // GIGDATA GMBH
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            KARRIERE BEI GIGSDA
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 text-lg leading-relaxed">
            Wir bauen eine Plattform für Künstler, Veranstalter,
            Techniker, Locations, Dienstleister und die gesamte
            Eventbranche. Unsere Mission ist es, Menschen,
            Projekte und Möglichkeiten miteinander zu verbinden.
          </p>
        </div>

        {/* STATUS */}
        <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Aktueller Stand
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Derzeit sind keine offenen Stellen ausgeschrieben.
            GIGSDA befindet sich weiterhin im Ausbau und viele
            Bereiche der Plattform entwickeln sich laufend weiter.
          </p>
        </div>

        {/* INITIATIV */}
        <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Initiativbewerbungen willkommen
          </h2>

          <p className="text-slate-400 leading-relaxed mb-6">
            Du glaubst an die Zukunft der Musik- und Eventbranche
            und möchtest deine Erfahrungen, Ideen oder Fähigkeiten
            einbringen? Dann freuen wir uns über eine Nachricht.
          </p>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-black/20 rounded-2xl p-4 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2">
                💻 Entwicklung
              </div>
              <div className="text-slate-500 text-sm">
                Frontend, Backend, Datenbanken, Automatisierung
              </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2">
                🎨 Design
              </div>
              <div className="text-slate-500 text-sm">
                UX, UI, Grafiken und Markenauftritt
              </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2">
                🎪 Eventbranche
              </div>
              <div className="text-slate-500 text-sm">
                Veranstalter, Techniker, Locations und Partner
              </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 border border-slate-800">
              <div className="text-cyan-400 font-bold mb-2">
                📣 Community
              </div>
              <div className="text-slate-500 text-sm">
                Netzwerkaufbau, Support und Kommunikation
              </div>
            </div>

          </div>
        </div>

        {/* VISION */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-black text-white mb-6">
            Die Zukunft entsteht jetzt.
          </h2>

          <p className="max-w-3xl mx-auto text-slate-300 leading-relaxed">
            GIGSDA ist mehr als eine Plattform. Wir bauen ein
            Netzwerk für die Menschen hinter den Events. Für
            Künstler. Für Veranstalter. Für Techniker. Für
            Locations. Für alle, die Live-Momente möglich machen.
          </p>

          <div className="mt-8 text-cyan-400 font-bold uppercase tracking-widest text-sm">
            Musik. Events. Netzwerk.
          </div>
        </div>

      </div>

      <Footer setView={setView} />

    </div>
  );
}
