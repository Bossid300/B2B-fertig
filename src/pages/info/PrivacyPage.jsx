import React from "react";
import Footer from "../../Footer";

export default function PrivacyPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // DATENSCHUTZ
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            DATENSCHUTZERKLÄRUNG
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Der Schutz deiner persönlichen Daten ist uns wichtig.
            GIGSDA verarbeitet personenbezogene Informationen
            ausschließlich im Rahmen der gesetzlichen Vorschriften
            und zur Bereitstellung der Plattformfunktionen.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welche Daten werden verarbeitet?
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Bei der Nutzung von GIGSDA können Angaben wie Name,
              E-Mail-Adresse, Profildaten, Veranstaltungsdaten,
              Nachrichten und weitere freiwillig bereitgestellte
              Informationen gespeichert werden.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Zweck der Verarbeitung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Datenverarbeitung erfolgt zur Bereitstellung der
              Plattform, zur Verwaltung von Benutzerkonten, zur
              Kommunikation zwischen Mitgliedern sowie zur
              Verbesserung und Weiterentwicklung der angebotenen
              Dienste.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sichtbarkeit von Profilinformationen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Nutzer können verschiedene Bereiche ihres Profils
              selbst verwalten und bestimmen, welche Informationen
              innerhalb des Netzwerks sichtbar sein sollen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Datensicherheit
            </h2>

            <p className="text-slate-400 leading-relaxed">
              GIGSDA setzt technische und organisatorische Maßnahmen
              ein, um Daten vor unbefugtem Zugriff, Verlust oder
              Missbrauch zu schützen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Deine Rechte
            </h2>

            <ul className="space-y-3 text-slate-400">
              <li>• Auskunft über gespeicherte Daten</li>
              <li>• Berichtigung unrichtiger Daten</li>
              <li>• Löschung personenbezogener Daten</li>
              <li>• Einschränkung der Verarbeitung</li>
              <li>• Widerspruch gegen die Verarbeitung</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Hinweis
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Diese Datenschutzerklärung dient aktuell als
              Informationsseite während der Entwicklungsphase von
              GIGSDA. Sie wird vor dem offiziellen Launch um die
              vollständigen rechtlichen Angaben ergänzt.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}