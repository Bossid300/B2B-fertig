import React from "react";
import Footer from "../../Footer";

export default function EventsLocationsPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // EVENTS & LOCATIONS
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            EVENTS & LOCATIONS
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Die richtige Veranstaltung beginnt mit den richtigen
            Menschen und dem richtigen Ort. GIGSDA verbindet
            Künstler, Veranstalter, Techniker, Dienstleister,
            Crews und Locations auf einer gemeinsamen Plattform.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Event Radar
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Mit dem Event Radar entdeckst du Veranstaltungen,
              Projekte und Aktivitäten in deiner Region. Finde
              neue Möglichkeiten, knüpfe Kontakte und werde Teil
              einer aktiven Eventlandschaft.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Locations finden
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Ob Club, Bar, Festivalgelände, Eventhalle oder
              Open-Air-Fläche. GIGSDA hilft dabei, passende
              Veranstaltungsorte zu finden und neue Möglichkeiten
              für Projekte und Events zu entdecken.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Künstler entdecken
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Veranstalter und Locations können Künstler,
              Bands, DJs und kreative Projekte finden und
              direkt mit ihnen in Kontakt treten.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Crew & Technik
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Gute Veranstaltungen entstehen nicht alleine.
              Techniker, Stagehands, Verleiher, Security,
              Logistik und weitere Dienstleister können in
              Projektplanungen eingebunden werden.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Vernetzung & Matching
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA entwickelt Werkzeuge, die passende Menschen,
              Projekte und Möglichkeiten zusammenbringen.
              Ziel ist es, die Eventplanung einfacher,
              schneller und effizienter zu gestalten.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-black text-white mb-6">
              Jede große Veranstaltung beginnt mit einer Idee.
            </h2>

            <p className="max-w-3xl mx-auto text-slate-300 leading-relaxed">
              GIGSDA bringt Menschen, Orte und Möglichkeiten
              zusammen. Finde die richtige Bühne, entdecke neue
              Partner und gestalte gemeinsam mit anderen die
              Eventwelt von morgen.
            </p>

            <div className="mt-8 text-cyan-400 font-bold uppercase tracking-widest text-sm">
              Live. Lokal. Vernetzt.
            </div>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}