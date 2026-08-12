import React from "react";
import Footer from "../../Footer";

export default function ImpressumPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // RECHTLICHE INFORMATIONEN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            IMPRESSUM
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Angaben gemäß den geltenden gesetzlichen
            Informationspflichten.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Anbieter
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>GIGDATA GmbH</p>
              <p>Stadtplatz 24/3</p>
              <p>5280 Braunau am Inn</p>
              <p>Österreich</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kontakt
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>E-Mail: info@gigsda.com</p>
              <p>Web: www.gigsda.com</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vertretungsberechtigte Person
            </h2>

            <p className="text-slate-400">
              Herbert J., Daniel K., Winston J.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Firmenbuch / UID
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>Firmenbuchnummer: [ergänzen]</p>
              <p>UID-Nummer: [ergänzen]</p>
              <p>Firmenbuchgericht: [ergänzen]</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Hinweis
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Dieses Impressum befindet sich aktuell im Aufbau.
              Einzelne Angaben werden ergänzt, sobald die
              endgültigen Unternehmens- und Registrierungsdaten
              vorliegen.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}