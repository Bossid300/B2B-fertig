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
  <h2 className="text-2xl font-bold text-white mb-2">
    Betreiber der Plattform
  </h2>

  <p className="text-cyan-400 mb-6">
    Medieninhaber & Herausgeber
  </p>

  <div className="mb-6">
    <h3 className="text-xl font-semibold text-white">
      GIGSDA (Gesellschaft bürgerlichen Rechts – GesbR)
    </h3>
  </div>

  <div className="space-y-6 text-slate-400">
    <div>
      <p className="font-medium text-slate-300 mb-3">
        Vertreten durch die Gesellschafter:
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
          <p className="font-semibold text-white">
            Herbert Jud
          </p>
          <p>Stadtplatz 24</p>
          <p>5280 Braunau am Inn</p>
          <p>Österreich</p>
        </div>

        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
          <p className="font-semibold text-white">
            Daniel Klingesberger
          </p>
          <p>Talstraße 1</p>
          <p>5280 Braunau am Inn</p>
          <p>Österreich</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Kontakt
  </h2>

  <div className="space-y-2 text-slate-400 leading-relaxed">
    <p className="font-medium text-white">
      GIGSDA (GesbR)
    </p>

    <p>
      E-Mail:{" "}
      <a
        href="mailto:support@gigsda.com"
        className="text-cyan-400 hover:text-cyan-300"
      >
        support@gigsda.com
      </a>
    </p>

    <p>
      Telefon:{" "}
      <a
        href="tel:+436764755522"
        className="text-cyan-400 hover:text-cyan-300"
      >
        +43 676 475 5522
      </a>
    </p>

    <p>
      Web:{" "}
      <a
        href="https://www.gigsda.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300"
      >
        www.gigsda.com
      </a>
    </p>
  </div>
</div>


<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Unternehmensgegenstand &amp; Ausrichtung des Mediums (Blattlinie)
  </h2>

  <div className="space-y-6 text-slate-400 leading-relaxed">
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Unternehmensgegenstand
      </h3>

      <p>
        Betrieb einer digitalen Vermittlungs- und Netzwerkplattform für
        Künstler, Veranstalter, Event-Locations, Dienstleister
        (insbesondere Techniker, Verleiher und Sicherheitsdienste) sowie
        Event-Besucher.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Blattlinie
      </h3>

      <p>
        Information über das Angebot der Plattform GIGSDA, Förderung der
        Vernetzung von Akteuren der Event-, Kultur- und Musikbranche sowie
        Bereitstellung digitaler Werkzeuge zur Planung, Organisation und
        Durchführung von Veranstaltungen.
      </p>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    Anwendbare Rechtsvorschriften
  </h2>

  <div className="space-y-6 text-slate-400 leading-relaxed">
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Gewerbe- und Berufsrecht
      </h3>

      <p>
        Für die Plattform GIGSDA gelten insbesondere die Bestimmungen der
        Gewerbeordnung (GewO), des E-Commerce-Gesetzes (ECG) sowie des
        Mediengesetzes (MedienG).
      </p>

      <p className="mt-2">
        Die aktuellen Gesetzestexte können im
        Rechtsinformationssystem des Bundes (RIS) eingesehen werden:
      </p>

      <a
        href="https://www.ris.bka.gv.at"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-3 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        www.ris.bka.gv.at
      </a>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Aufsichtsbehörde / Gewerbebehörde
      </h3>

      <p>
        Zuständige Gewerbebehörde ist die
        Bezirkshauptmannschaft Braunau am Inn beziehungsweise die jeweils
        sachlich und örtlich zuständige Behörde.
      </p>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    EU-Streitbeilegung
  </h2>

  <div className="space-y-4 text-slate-400 leading-relaxed">
    <p>
      Verbraucher haben die Möglichkeit, Beschwerden an die
      Online-Streitbeilegungsplattform der Europäischen Kommission zu
      richten.
    </p>

    <p>
      Sie können allfällige Beschwerden auch direkt an die im Impressum
      bzw. in den Kontaktinformationen angeführte E-Mail-Adresse richten.
    </p>

    <p>
      Wir sind nicht verpflichtet und nicht bereit, an einem
      Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
      teilzunehmen.
    </p>
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