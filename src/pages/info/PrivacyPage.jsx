import React from "react";

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
          <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">
            (Stand: Oktober 2026)
          </p>
        </div>

        <div className="space-y-8">

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    1. Datenschutz auf einen Blick
  </h2>

  <div className="space-y-6 text-slate-400 leading-relaxed">
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Allgemeine Hinweise
      </h3>
      <p>
        Die folgenden Hinweise geben einen einfachen Überblick darüber,
        was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere
        Website GIGSDA (abrufbar unter{" "}
        <a
          href="https://www.gigsda.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300"
        >
          www.gigsda.com
        </a>{" "}
        sowie über zugehörige mobile Applikationen) besuchen oder nutzen.
        Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
        identifiziert werden können.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Datenerfassung auf unserer Website
      </h3>

      <h4 className="font-medium text-slate-300 mb-1">
        Wer ist verantwortlich für die Datenerfassung?
      </h4>
      <p className="mb-4">
        Die Datenverarbeitung auf dieser Website erfolgt durch die Betreiber
        der Plattform GIGSDA. Nähere Informationen finden Sie in Abschnitt 2
        dieser Datenschutzerklärung.
      </p>

      <h4 className="font-medium text-slate-300 mb-1">
        Wie erfassen wir Ihre Daten?
      </h4>
      <p className="mb-4">
        Ihre Daten werden einerseits dadurch erhoben, dass Sie uns diese
        mitteilen, beispielsweise bei der Erstellung eines Nutzerprofils,
        bei der Nutzung von Buchungs- oder Absicherungsfunktionen oder bei
        Anfragen per Kontaktformular bzw. E-Mail.
      </p>

      <p className="mb-4">
        Andere Daten werden automatisch oder nach Ihrer Einwilligung beim
        Besuch der Website durch unsere IT-Systeme erfasst. Dabei handelt es
        sich vor allem um technische Daten wie Browsertyp, Betriebssystem,
        IP-Adresse oder die Uhrzeit des Seitenaufrufs.
      </p>

      <h4 className="font-medium text-slate-300 mb-1">
        Wofür nutzen wir Ihre Daten?
      </h4>
      <p className="mb-4">
        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung
        der Website und der Plattformfunktionen zu gewährleisten. Dazu zählen
        insbesondere die Netzwerk-Vermittlung, die Erstellung von Künstler-,
        Venue- und Dienstleisterprofilen sowie Interaktionen wie das
        „Absichern von Deals“.
      </p>

      <p className="mb-4">
        Weitere Daten können zur Analyse Ihres Nutzerverhaltens oder zur
        Kontaktaufnahme verwendet werden.
      </p>

      <h4 className="font-medium text-slate-300 mb-1">
        Welche Rechte haben Sie bezüglich Ihrer Daten?
      </h4>
      <p>
        Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
        Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu
        erhalten. Außerdem haben Sie das Recht auf Berichtigung, Einschränkung
        der Verarbeitung oder Löschung dieser Daten sowie das Recht,
        erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft zu
        widerrufen.
      </p>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    2. Verantwortliche
  </h2>

  <div className="text-slate-400 leading-relaxed space-y-4">
    <p>
      Verantwortlich für die Datenverarbeitung auf dieser Plattform im Sinne
      der Datenschutz-Grundverordnung (DSGVO) sowie sonstiger nationaler
      Datenschutzgesetze sind:
    </p>

    <div>
      <p className="font-semibold text-white">GIGSDA (GesbR)</p>

      <div className="mt-3 space-y-3">
        <div>
          <p className="font-medium text-slate-300">
            Daniel Klingesberger
          </p>
          <p>Talstraße 1</p>
          <p>5280 Braunau am Inn</p>
          <p>Österreich</p>
        </div>

        <div>
          <p className="font-medium text-slate-300">
            Herbert Jud
          </p>
          <p>Stadtplatz 24</p>
          <p>5280 Braunau am Inn</p>
          <p>Österreich</p>
        </div>
      </div>
    </div>

    <div>
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
        Datenschutz:{" "}
        <a
          href="mailto:datenschutz@gigsda.com"
          className="text-cyan-400 hover:text-cyan-300"
        >
          datenschutz@gigsda.com
        </a>
      </p>
    </div>

    <p>
      Nachfolgend gemeinsam als <strong>„Betreiber“</strong> oder{" "}
      <strong>„GIGSDA“</strong> bezeichnet.
    </p>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    3. Datenerfassung und Datenverarbeitung auf GIGSDA
  </h2>

  <div className="space-y-8 text-slate-400 leading-relaxed">
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        a) Bereitstellung der Website und Erstellung von Logfiles
      </h3>

      <p className="mb-4">
        Bei jedem Aufruf unserer Website erfasst unser System automatisiert
        Daten und Informationen vom Computersystem des aufrufenden Rechners.
      </p>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-slate-300">
            Erfasste Daten:
          </span>{" "}
          IP-Adresse, Browsertyp und Browserversion, verwendetes
          Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners
          sowie Uhrzeit der Serveranfrage.
        </p>

        <p>
          <span className="font-medium text-slate-300">
            Rechtsgrundlage:
          </span>{" "}
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der
          Bereitstellung und IT-Sicherheit der Website).
        </p>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        b) Registrierung und Erstellung von Nutzerprofilen
      </h3>

      <p className="mb-4">
        Um Funktionen auf GIGSDA zu nutzen, beispielsweise die Erstellung
        von Profilen für Künstler, Bands, Veranstalter, Locations,
        Techniker, Verleiher oder Security-Dienstleister sowie die
        Veröffentlichung von Events, ist eine Registrierung erforderlich.
      </p>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-slate-300">
            Erfasste Daten:
          </span>{" "}
          Name, Künstlername oder Firmenname, E-Mail-Adresse, Passwort,
          Adress- oder Standortdaten, Profilbilder, Audio- und Video-Links,
          Beschreibungen, Kontaktdaten sowie bereitgestellte
          Veranstaltungsdaten.
        </p>

        <p>
          <span className="font-medium text-slate-300">
            Rechtsgrundlage:
          </span>{" "}
          Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Nutzungsvertrags).
        </p>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        c) Nutzung von Interaktions- und Deal-Tools
      </h3>

      <p className="mb-4">
        Bei der Nutzung von Funktionen wie „Deal absichern“,
        „Zusage-Deal“ oder ähnlichen Projekt- und Kommunikationswerkzeugen
        verarbeiten wir die von Ihnen eingegebenen Rahmenbedingungen und
        Statusmeldungen.
      </p>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-slate-300">
            Verarbeitete Informationen:
          </span>{" "}
          Vereinbarte Termine, Gagenrahmen, Auftrittsdetails,
          Sicherheitsinformationen sowie weitere projektbezogene Angaben.
        </p>

        <p>
          <span className="font-medium text-slate-300">
            Zweck:
          </span>{" "}
          Technische Dokumentation und Bereitstellung der Kommunikations-
          und Absicherungsfunktionen für die beteiligten Nutzer.
        </p>

        <p>
          <span className="font-medium text-slate-300">
            Rechtsgrundlage:
          </span>{" "}
          Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw.
          Durchführung vorvertraglicher Maßnahmen).
        </p>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        d) Standortdaten und Kartendienste
      </h3>

      <p className="mb-4">
        Zur Darstellung von Veranstaltungsorten, Venues und regionalen
        Netzwerkkontakten nutzt GIGSDA Kartendienste, beispielsweise
        Google Maps.
      </p>

      <p className="mb-4">
        Zur Nutzung dieser Kartenfunktionen kann es erforderlich sein,
        Ihre IP-Adresse an die Server des jeweiligen Kartenanbieters
        zu übertragen.
      </p>

      <div className="space-y-2">
        <p>
          <span className="font-medium text-slate-300">
            Zweck:
          </span>{" "}
          Darstellung von Veranstaltungsorten und Unterstützung bei der
          Auffindbarkeit von Event-Standorten.
        </p>

        <p>
          <span className="font-medium text-slate-300">
            Rechtsgrundlage:
          </span>{" "}
          Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei Nutzung der
          Kartenfunktion) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einer benutzerfreundlichen Standortdarstellung).
        </p>
      </div>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    4. Weitergabe von Daten an Dritte
  </h2>

  <div className="space-y-4 text-slate-400 leading-relaxed">
    <p>
      Eine Übermittlung Ihrer personenbezogenen Daten an Dritte zu anderen
      als den nachfolgend aufgeführten Zwecken findet nicht statt.
    </p>

    <p>
      Wir geben Ihre personenbezogenen Daten nur dann an Dritte weiter,
      wenn mindestens einer der folgenden Fälle vorliegt:
    </p>

    <ul className="list-disc list-inside space-y-3 text-slate-400">
      <li>
        Sie Ihre ausdrückliche Einwilligung dazu erteilt haben
        <span className="text-slate-300">
          {" "}(Art. 6 Abs. 1 lit. a DSGVO)
        </span>.
      </li>

      <li>
        Die Weitergabe für die Erfüllung oder Abwicklung von
        Vertragsverhältnissen mit Ihnen erforderlich ist
        <span className="text-slate-300">
          {" "}(Art. 6 Abs. 1 lit. b DSGVO)
        </span>.
      </li>

      <li>
        Eine gesetzliche Verpflichtung zur Weitergabe besteht
        <span className="text-slate-300">
          {" "}(Art. 6 Abs. 1 lit. c DSGVO)
        </span>.
      </li>

      <li>
        Die Weitergabe an externe Dienstleister erfolgt, beispielsweise
        Hosting-Anbieter, Serverbetreiber oder lizenzierte
        Zahlungsdienstleister im Rahmen von Treuhand- und
        Zahlungsabwicklungen.
        <span className="text-slate-300">
          {" "}Dies erfolgt auf Grundlage von Art. 28 DSGVO
          (Auftragsverarbeitung).
        </span>
      </li>
    </ul>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    5. Cookies und Analyse-Tools
  </h2>

  <div className="space-y-6 text-slate-400 leading-relaxed">
    <p>
      Unsere Website verwendet Cookies. Cookies sind kleine Textdateien,
      die Ihr Webbrowser auf Ihrem Endgerät speichert.
    </p>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        Technisch notwendige Cookies
      </h3>

      <p className="mb-3">
        Diese Cookies sind erforderlich, um die grundlegenden Funktionen
        der Plattform bereitzustellen und einen sicheren Betrieb zu
        gewährleisten.
      </p>

      <p className="mb-3">
        Dazu gehören beispielsweise die Speicherung des Login-Status,
        die Session-Verwaltung sowie sicherheitsrelevante Funktionen.
      </p>

      <p>
        <span className="font-medium text-slate-300">
          Rechtsgrundlage:
        </span>{" "}
        Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
        sicheren und funktionierenden Bereitstellung der Plattform).
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        Optionale Analyse- und Komfort-Cookies
      </h3>

      <p className="mb-3">
        Analyse- oder Komfort-Cookies werden ausschließlich nach Ihrer
        ausdrücklichen Einwilligung eingesetzt.
      </p>

      <p className="mb-3">
        Diese Cookies helfen uns dabei, die Nutzung unserer Website
        besser zu verstehen und unser Angebot kontinuierlich zu
        verbessern.
      </p>

      <p className="mb-3">
        Die Speicherung erfolgt erst nach Zustimmung über unser
        Cookie-Banner.
      </p>

      <p>
        <span className="font-medium text-slate-300">
          Rechtsgrundlage:
        </span>{" "}
        Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
      </p>
    </div>

    <div className="border-l-4 border-cyan-500/40 pl-4">
      <p>
        Sie können eine bereits erteilte Einwilligung jederzeit mit
        Wirkung für die Zukunft über die Cookie-Einstellungen auf der
        Website widerrufen oder anpassen.
      </p>
    </div>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    6. Speicherdauer
  </h2>

  <div className="space-y-4 text-slate-400 leading-relaxed">
    <p>
      Soweit in dieser Datenschutzerklärung keine spezielle Speicherdauer
      genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns,
      bis der Zweck für die Datenverarbeitung entfällt.
    </p>

    <p>
      Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
      erteilte Einwilligung zur Datenverarbeitung widerrufen, werden Ihre
      personenbezogenen Daten gelöscht, sofern keine gesetzlichen
      Aufbewahrungspflichten oder andere rechtlich zulässige Gründe für
      die weitere Speicherung bestehen.
    </p>

    <p>
      Hiervon können insbesondere steuer- oder handelsrechtliche
      Aufbewahrungsfristen betroffen sein.
    </p>
  </div>
</div>

<div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
  <h2 className="text-2xl font-bold text-white mb-6">
    7. Ihre Rechte als betroffene Person
  </h2>

  <div className="space-y-4 text-slate-400 leading-relaxed">
    <p>
      Nach den Bestimmungen der Datenschutz-Grundverordnung (DSGVO)
      stehen Ihnen folgende Rechte zu:
    </p>

    <ul className="list-disc list-inside space-y-3">
      <li>
        <span className="font-medium text-slate-300">
          Auskunftsrecht (Art. 15 DSGVO):
        </span>{" "}
        Recht auf Auskunft über Ihre von uns verarbeiteten
        personenbezogenen Daten.
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Berichtigungsrecht (Art. 16 DSGVO):
        </span>{" "}
        Recht auf unverzügliche Berichtigung unrichtiger oder
        unvollständiger Daten.
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Löschungsrecht (Art. 17 DSGVO):
        </span>{" "}
        Recht auf Löschung Ihrer gespeicherten personenbezogenen Daten
        („Recht auf Vergessenwerden“).
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):
        </span>{" "}
        Recht, die Verarbeitung Ihrer personenbezogenen Daten
        einschränken zu lassen.
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Recht auf Datenübertragbarkeit (Art. 20 DSGVO):
        </span>{" "}
        Recht, Ihre Daten in einem strukturierten, gängigen und
        maschinenlesbaren Format zu erhalten.
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Widerrufsrecht (Art. 7 Abs. 3 DSGVO):
        </span>{" "}
        Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die
        Zukunft zu widerrufen.
      </li>

      <li>
        <span className="font-medium text-slate-300">
          Beschwerderecht (Art. 77 DSGVO):
        </span>{" "}
        Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen
        geltendes Datenschutzrecht verstößt, können Sie Beschwerde bei der
        zuständigen Aufsichtsbehörde einlegen.
      </li>
    </ul>

    <div className="border-l-4 border-cyan-500/40 pl-4 mt-6">
      <p>
        Zuständige Aufsichtsbehörde in Österreich:
      </p>
      <p className="text-slate-300 font-medium">
        Österreichische Datenschutzbehörde
      </p>
      <p>Barichgasse 40-42</p>
      <p>1030 Wien</p>
      <p>
        <a
          href="https://www.dsb.gv.at"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300"
        >
          www.dsb.gv.at
        </a>
      </p>
    </div>
  </div>
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

    </div>
  );
}