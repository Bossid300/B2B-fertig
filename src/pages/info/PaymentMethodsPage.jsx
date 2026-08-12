import React from "react";
import Footer from "../../Footer";

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
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              PayPal
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Für schnelle und unkomplizierte Online-Zahlungen
              ist die Unterstützung von PayPal vorgesehen.
              Nutzer profitieren von einer bekannten und weit
              verbreiteten Zahlungsmethode.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              SEPA Banküberweisung
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Überweisungen innerhalb des europäischen
              Zahlungsraums sollen eine zuverlässige Möglichkeit
              für Mitgliedschaften, Dienstleistungen und
              Projektzahlungen bieten.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Klarna
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Die Integration von Klarna wird geprüft, um weitere
              flexible Zahlungsoptionen für Mitglieder
              bereitzustellen.
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
              Der Zahlungsbereich befindet sich aktuell im
              Ausbau. Einzelne Zahlungsmethoden können während
              der Entwicklungsphase simuliert oder schrittweise
              aktiviert werden.
            </p>
          </div>

        </div>

      </div>

      <Footer setView={setView} />
    </div>
  );
}