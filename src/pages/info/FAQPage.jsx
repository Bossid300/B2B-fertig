import React from "react";
import Footer from "../../Footer";

export default function FAQPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // HÄUFIG GESTELLTE FRAGEN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            FAQ
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Antworten auf die häufigsten Fragen rund um GIGSDA,
            die Community und die Eventplattform.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Was ist GIGSDA?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA ist ein Netzwerk für Künstler, Veranstalter,
              Techniker, Locations, Dienstleister und Event-Crews.
              Die Plattform unterstützt bei der Vernetzung,
              Eventplanung und Projektorganisation.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Kostet GIGSDA Geld?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Basisnutzung von GIGSDA ist kostenlos.
              Erweiterte Leistungen und zukünftige Premium-Funktionen
              können kostenpflichtig angeboten werden.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Wie finde ich Crew für mein Event?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Über die Suchfunktionen, das Netzwerk und zukünftige
              Matching-Systeme können geeignete Techniker,
              Helfer und Dienstleister gefunden werden.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Wie erstelle ich ein Event?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Registrierte Nutzer können über die Eventverwaltung
              Veranstaltungen anlegen, verwalten und mit anderen
              Mitgliedern teilen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Was ist der GIGSDA Pass?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Der GIGSDA Pass dient als digitale Identitäts- und
              Netzwerkkarte innerhalb des GIGSDA-Ökosystems.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Wie funktioniert Promotion?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Events, Profile und Projekte können innerhalb des
              Netzwerks sichtbar gemacht werden. Weitere
              Promotion-Funktionen werden laufend erweitert.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Welche Rollen gibt es auf GIGSDA?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Unter anderem Künstler, Veranstalter, Techniker,
              Locations, Catering, Verleiher, Security,
              Logistik und weitere Dienstleister der Eventbranche.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-3">
              Kann ich mein Profil später bearbeiten?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Ja. Profilinformationen, Kontaktdaten,
              Beschreibungen, Skills und weitere Angaben können
              jederzeit aktualisiert werden.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Weitere Fragen?
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Falls deine Frage hier nicht beantwortet wird,
              nutze die Kontaktseite oder wende dich direkt an
              das GIGSDA-Team.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}