import React from "react";
import Footer from "../../Footer";

export default function SecurityPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // RICHTLINIEN & SICHERHEIT
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            SICHERHEIT
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            Eine starke Community basiert auf Vertrauen,
            Transparenz und gegenseitigem Respekt. Diese
            Richtlinien helfen dabei, GIGSDA für alle
            Mitglieder sicher und professionell zu gestalten.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Respektvoller Umgang
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Wir erwarten einen freundlichen, professionellen
              und respektvollen Umgang zwischen allen Mitgliedern
              der Plattform. Beleidigungen, Diskriminierung,
              Belästigung oder gezielte Schädigung anderer Nutzer
              werden nicht toleriert.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Profilprüfung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Nutzer sollten korrekte und aktuelle Angaben in ihren
              Profilen hinterlegen. GIGSDA behält sich vor,
              offensichtlich falsche oder irreführende Profile
              zu überprüfen oder einzuschränken.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Mehrfachaccounts
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Erstellung mehrerer Konten zur Umgehung von
              Sperren, Bewertungen oder Plattformregeln ist
              nicht gestattet. Mehrere Konten für klar getrennte
              geschäftliche Zwecke müssen nachvollziehbar sein.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Missbrauchsschutz
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Spam, Betrugsversuche, Fake-Anfragen, irreführende
              Angebote oder missbräuchliche Kontaktaufnahmen
              können zur Einschränkung oder Sperrung eines
              Benutzerkontos führen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Veranstaltungen & Projekte
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Nutzer sind für die Inhalte ihrer Veranstaltungen,
              Anfragen, Ausschreibungen und Projektinformationen
              selbst verantwortlich. Angaben sollten korrekt und
              nachvollziehbar sein.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Meldesystem
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Verdächtige Aktivitäten, Regelverstöße oder
              problematische Inhalte können an das GIGSDA-Team
              gemeldet werden. Jede Meldung wird geprüft und
              im Rahmen der verfügbaren Informationen bewertet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Datenschutz & Kontosicherheit
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Nutzer sollten sichere Passwörter verwenden und ihre
              Zugangsdaten nicht an Dritte weitergeben. Persönliche
              Daten werden entsprechend der Datenschutzerklärung
              verarbeitet und geschützt.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Gemeinsam für eine starke Community
            </h2>

            <p className="text-slate-300 leading-relaxed">
              GIGSDA verbindet Künstler, Veranstalter,
              Techniker, Locations und Dienstleister.
              Sicherheit entsteht durch Transparenz,
              Fairness und die Bereitschaft, gemeinsam
              Verantwortung für die Community zu übernehmen.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}