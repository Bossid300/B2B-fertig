import React from "react";
import Footer from "../../Footer";

export default function EscrowProtectionPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // TREUHAND-SCHUTZ
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            TREUHAND-SCHUTZ
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            GIGSDA entwickelt Konzepte für sichere Zahlungen
            zwischen Veranstaltern, Künstlern, Technikern,
            Dienstleistern und weiteren Teilnehmern der
            Eventbranche.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Was bedeutet Treuhand-Schutz?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Bei einem Treuhand-System wird eine Zahlung
              zunächst sicher hinterlegt und erst dann an
              den Empfänger freigegeben, wenn die vereinbarte
              Leistung erbracht wurde.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vorteile für Veranstalter
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Veranstalter erhalten zusätzliche Sicherheit,
              da Zahlungen nicht sofort ausgeführt werden
              müssen und vereinbarte Leistungen nachvollziehbar
              abgesichert werden können.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vorteile für Künstler & Dienstleister
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Künstler, Techniker, Verleiher und andere
              Dienstleister profitieren von einer höheren
              Zahlungssicherheit und transparenten Abläufen
              bei Projekten und Veranstaltungen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Transparente Projektabwicklung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Ziel ist es, Vereinbarungen, Leistungen und
              Zahlungsprozesse nachvollziehbar und für alle
              beteiligten Parteien transparent darzustellen.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Entwicklungsstatus
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Der Treuhand-Schutz befindet sich aktuell in der
              Konzept- und Planungsphase. Die dargestellten
              Informationen beschreiben die zukünftige Vision
              einer sicheren Zahlungs- und Projektabwicklung
              innerhalb des GIGSDA-Netzwerks.
            </p>
          </div>

          <div className="bg-black/20 border border-purple-500/10 rounded-3xl p-8 text-center">
            <div className="text-cyan-400 text-sm uppercase tracking-widest mb-3">
              GIGSDA VISION
            </div>

            <p className="text-slate-300 leading-relaxed">
              Menschen sollen sich auf ihre Veranstaltungen,
              ihre Kunst und ihre Projekte konzentrieren können.
              Sichere und nachvollziehbare Prozesse schaffen
              Vertrauen und stärken die gesamte Eventbranche.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}