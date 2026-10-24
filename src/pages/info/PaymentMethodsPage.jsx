import React from "react";

export default function PaymentMethodsPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">

      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="text-center mb-16">
          <div className="text-cyan-400 text-xs uppercase tracking-[0.4em] mb-4">
            // ZAHLUNGSARTEN
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            ZAHLUNGSARTEN
          </h1>

          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            GIGSDA arbeitet an einer sicheren und transparenten
            Zahlungsinfrastruktur für Mitglieder, Projekte,
            Veranstaltungen und zukünftige Premium-Dienste.
          </p>
          <p className="max-w-3xl mx-auto mt-4 text-slate-300 leading-relaxed">
            Die Mitgliedschaftstarife befinden sich derzeit in der
            Entwicklungs- und Testphase. Über Abonnements werden aktuell
            keine Zahlungen eingezogen und keine automatischen Abbuchungen
            ausgelöst. Freiwillige Unterstützungen über den PayPal-Link auf
            der Preisseite sind davon unabhängig und können eine echte
            Zahlung über PayPal auslösen.
          </p>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              PayPal
            </h2>

            <p className="text-slate-400 leading-relaxed">
              PayPal ist aktuell für freiwillige Unterstützungen über den
              Link auf der Preisseite verfügbar. Diese Zahlungen sind
              unabhängig von Mitgliedschaftstarifen und werden über PayPal
              abgewickelt. Als Zahlungsmethode für kostenpflichtige
              Mitgliedschaften ist PayPal noch nicht freigeschaltet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              SEPA Banküberweisung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Überweisungen innerhalb des europäischen
              Zahlungsraums werden als mögliche zukünftige
              Zahlungsmethode geprüft und sind für Mitgliedschaften,
              Dienstleistungen und Projektzahlungen derzeit nicht
              freigeschaltet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Klarna
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Integration von Klarna wird geprüft, um weitere
              flexible Zahlungsoptionen bereitzustellen. Klarna ist
              derzeit nicht als Zahlungsmethode freigeschaltet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sichere Transaktionen
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Zahlungsinformationen werden nicht öffentlich
              angezeigt. Sicherheit, Transparenz und Schutz der
              Beteiligten haben bei allen zukünftigen
              Zahlungsprozessen höchste Priorität.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Entwicklungsstatus
            </h2>

            <p className="text-slate-300 leading-relaxed">
              Die Zahlungsinfrastruktur für Mitgliedschaften und weitere
              Plattformleistungen befindet sich im Aufbau. Tarifauswahlen
              können im Testsystem als offene Aufträge vorgemerkt werden;
              sie lösen keine Abonnementzahlung oder automatische
              Abbuchung aus.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}