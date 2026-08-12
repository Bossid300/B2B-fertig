import React from 'react';
import Footer from "../../Footer";

export default function ContactPage({ setView }) {
  return (
    <div className="min-h-screen bg-[#070913] text-white">

      <div className="max-w-5xl mx-auto px-6 py-12">

        <button
          onClick={() => setView('landing')}
          className="mb-8 text-cyan-400 hover:text-cyan-300 transition"
        >
          ← Zurück zur Startseite
        </button>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">
          <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs mb-3">
            // KONTAKT
          </p>

          <h1 className="text-4xl font-black mb-4">
            Kontakt & Support
          </h1>

          <p className="text-slate-300 leading-relaxed max-w-3xl">
            Du hast Fragen zu GIGSDA, benötigst Unterstützung
            bei deinem Profil, einem Event oder möchtest uns
            Feedback geben? Dann freuen wir uns auf deine Nachricht.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Allgemeine Anfragen
            </h2>

            <div className="space-y-3 text-slate-300">
              <p>
                Fragen zur Plattform, Funktionen oder
                Kooperationen.
              </p>

              <p>
                📧 support@gigsda.com
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-4">
              Technischer Support
            </h2>

            <div className="space-y-3 text-slate-300">
              <p>
                Probleme mit Login, Profilen,
                Events oder Rechnungen.
              </p>

              <p>
                🛠️ tech@gigsda.com
              </p>
            </div>
          </div>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">
            GIGDATA GmbH
          </h2>

          <div className="text-slate-300 space-y-2">
            <p>
              GIGDATA GmbH
            </p>

            <p>
              Musik. Veranstaltungen. Dabei sein.
            </p>

            <p>
              Österreich / Deutschland
            </p>
          </div>
        </div>

      </div>
      <Footer setView={setView} />

    </div>
  );
}