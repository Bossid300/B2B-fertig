import React from 'react';
import Footer from "../../Footer";

export default function AboutPage({ setView }) {

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => setView('landing')}
          className="mb-8 text-cyan-400 hover:text-cyan-300 transition"
        >
          ← Zurück zur Startseite
        </button>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Über GIGSDA
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Musik. Veranstaltungen. Dabei sein.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Was ist GIGSDA?
          </h2>

          <p className="text-slate-300 leading-relaxed">
            GIGSDA ist eine digitale Plattform für Künstler,
            Techniker, Veranstalter, Locations und Dienstleister
            der Eventbranche. Unser Ziel ist es, Menschen zu
            verbinden, Teams aufzubauen und Veranstaltungen
            professionell organisieren zu können.
          </p>
        </section>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Warum GIGSDA entstanden ist
          </h2>

          <p className="text-slate-300 leading-relaxed">
            Viele Veranstaltungen werden heute noch über
            Messenger, Telefon, E-Mails, PDFs und
            Tabellen organisiert. GIGSDA bringt diese
            Abläufe in einer gemeinsamen Plattform zusammen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Was GIGSDA heute kann
          </h2>

          <ul className="text-slate-300 space-y-2">
            <li>• Profile & Portfolios</li>
            <li>• Crew-Aufbau & Teammanagement</li>
            <li>• Eventplanung</li>
            <li>• Rider & Verträge</li>
            <li>• Promotion & Event-Radar</li>
            <li>• Community Chat</li>
            <li>• Favoriten & Netzwerk</li>
            <li>• Billing & Subscription</li>
            <li>• GIGSDA Pass</li>
          </ul>
        </section>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 mb-8">

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Unser Ansatz
          </h2>

          <p className="text-slate-300 leading-relaxed">
            GIGSDA versteht sich nicht als klassisches
            soziales Netzwerk. Der Fokus liegt auf
            Zusammenarbeit, Organisation, Qualität
            und Verlässlichkeit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            Unsere Vision
          </h2>

          <p className="text-slate-300 leading-relaxed">
            Wir möchten eine Plattform schaffen,
            auf der Veranstaltungen nicht nur präsentiert,
            sondern gemeinsam geplant, organisiert
            und erfolgreich umgesetzt werden können.
          </p>
        </section>
        
        </div>


          <div className="relative">
            <div className="absolute -inset-[2px] bg-gradient-to-br from-cyan-400 via-pink-500 to-purple-500 
                rounded-2xl blur-[2px] opacity-75 animate-[borderGlow_5s_linear_infinite] bg-[length:300%_300%]" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/2026/profiles/die_architekten_der_musik.png"
                  alt="GIGSDA Event Revolution Vision"
                  className="w-full max-w-full h-auto"
                />
              {/* Optionaler Overlay-Gradient für bessere Lesbarkeit falls Text drüber stünde */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 
              via-transparent to-transparent" 
              />
              
              {/* Optional: Ein kleiner Text-Badge im Bild */}
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border 
                  border-cyan-400/20 text-cyan-300 text-xs font-[Space_Grotesk]">
                  Live-Innovation in Echtzeit
              </div>
            </div>
          </div>
        </div>



      <Footer setView={setView} />

    </div>
  );
}