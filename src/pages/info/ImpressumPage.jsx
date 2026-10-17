import React from "react";

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
            Angaben gemäß § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz (MedienG):
          </p>
          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            (Stand: Oktober 2026)
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Betreiber der Plattform (Medieninhaber & Herausgeber)
            </h2>
            <h3 className="text-2xl font-bold text-white mb-4">
              GIGSDA (Gesellschaft bürgerlichen Rechts – GesbR)
            </h3>

            <div className="space-y-2 text-slate-400">
              <p>Vertreten durch die Gesellschafter:</p>
              <p>Herbert Jud</p>
              <p>Stadtplatz 24, 5280 Braunau am Inn</p>
              <p>Österreich</p>
              <p>Daniel Klingesberger</p>
              <p>Talstrasse 1, 5280 Braunau am Inn</p>
              <p>Österreich</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Kontakt
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>E-Mail: support@gigsda.com</p>
              <p>Telefon: +43 676 475 5522</p>
              <p>Web: www.gigsda.com</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Unternehmensgegenstand & Ausrichtung des Mediums (Blattlinie)
            </h2>

            <p className="text-slate-400">
              Unternehmensgegenstand: Betrieb einer digitalen Vermittlungs- und Netzwerkplattform für Künstler, Veranstalter, Event-Locations, Dienstleister (z. B. Techniker, Verleiher, Security) und Event-Besucher.
            </p>
            <p className="text-slate-400">
              Blattlinie: Information über das Angebot der Plattform GIGSDA, Vernetzung von Akteuren der Event- und Musikbranche sowie Bereitstellung von digitalen Tools zur Event-Planung und Abwicklung.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Anwendbare Rechtsvorschriften
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>Gewerbe- und Berufsrecht: Gewerbeordnung (GewO), E-Commerce-Gesetz (ECG), Mediengesetz (MedienG). Abrufbar unter www.ris.bka.gv.at.</p>
              <p>Aufsichtsbehörde / Gewerbebehörde: Bezirkshauptmannschaft Braunau am Inn (bzw. die jeweils zuständige BH/Magistrat).</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              EU-Streitbeilegung
            </h2>

            <div className="space-y-2 text-slate-400">
              <p>Verbraucher haben die Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der EU zu richten: https://ec.europa.eu/consumers/odr.</p>
              <p>Sie können allfällige Beschwerden auch an die oben angeführte E-Mail-Adresse richten.</p>
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

    </div>
  );
}