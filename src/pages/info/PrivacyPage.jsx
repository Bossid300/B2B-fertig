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
            <h2 className="text-2xl font-bold text-white mb-4">
              1. Datenschutz auf einen Blick
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Allgemeine Hinweise:
            </p>
            <p className="text-slate-400 leading-relaxed">
              Die folgenden Hinweise geben einen einfachen Überblick 
darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere 
Website GIGSDA (abrufbar unter [www.gigsda.com](https://www.gigsda.com) sowie über 
zugehörige mobile Applikationen) besuchen oder nutzen. Personenbezogene Daten sind alle Daten, mit denen 
Sie persönlich identifiziert werden können.Datenerfassung auf unserer WebsiteWer ist verantwortlich für 
die Datenerfassung auf dieser Website?Die Datenverarbeitung auf dieser Website erfolgt durch die Betreiber 
der Plattform GIGSDA (siehe Abschnitt 2 dieser Datenschutzerklärung).Wie erfassen wir Ihre Daten?Ihre Daten 
werden einerseits dadurch erhoben, dass Sie uns diese mitteilen (z. B. bei der Erstellung eines Nutzerprofils, 
der Nutzung von Buchungs- oder Absicherungsfunktionen, Anfragen per Kontaktformular oder E-Mail).
Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme 
erfasst (z. B. technische Daten wie Internetbrowser, Betriebssystem, IP-Adresse oder Uhrzeit des Seitenaufrufs).
Wofür nutzen wir Ihre Daten?Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website und 
der Plattformfunktionen (Netzwerk-Vermittlung, Erstellung von Künstler-/Venue-/Dienstleister-Profilen, Interaktionen 
wie „Deal absichern“) zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens oder zur Kontaktaufnahme verwendet werden.
Welche Rechte haben Sie bezüglich Ihrer Daten?Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und 
Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem das Recht, die Berichtigung, Sperrung oder Löschung 
dieser Daten zu verlangen sowie erteilte Einwilligungen jederzeit zu widerrufen.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              2. Verantwortliche
            </h2>

            <p className="text-slate-400 leading-relaxed">
              StelleVerantwortlich für die 
Datenverarbeitung auf dieser Plattform im Sinne der Datenschutz-Grundverordnung (DSGVO) und sonstiger nationaler Datenschutzgesetze sind:
GIGSDA (GesbR)
Daniel Klingesberger, 
Talstrasse 1, 5280 Braunau am Inn, 
ÖsterreichHerbert Jud, 
Stadtplatz 24,, 5280 Braunau am Inn, 
Österreich
E-Mail: support@gigsda,com, 
z. B. datenschutz@gigsda.com](nachfolgend gemeinsam als „Betreiber“ oder „GIGSDA“ bezeichnet).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Datenerfassung und Datenverarbeitung auf GIGSDA
            </h2>

            <p className="text-slate-400 leading-relaxed">
              a) Bereitstellung der Website und Erstellung von LogfilesBei jedem Aufruf unserer Website erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners.
Erfasste Daten: IP-Adresse, Browsertyp/-version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung und IT-Sicherheit der Website).
            </p>
            <p className="text-slate-400 leading-relaxed">
              b) Registrierung und Erstellung von NutzerprofilenUm Funktionen auf GIGSDA zu nutzen (z. B. Erstellung von Profilen für Künstler, Bands, Veranstalter, Locations, Techniker, Verleiher, Security, Veröffentlichung von Events), müssen Sie sich registrieren.
Erfasste Daten: Name / Künstlername / Firmenname, E-Mail-Adresse, Passwort, Adress- oder Standortdaten, Profilbilder, Audio-/Video-Links, Beschreibungs- und Kontaktdaten sowie von Ihnen bereitgestellte Veranstaltungsdaten.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Nutzungsvertrages).
            </p>
            <p className="text-slate-400 leading-relaxed">
              c) Nutzung von Interaktions- und Deal-Tools („Deal absichern“, „Zusage-Deal“)Bei der Nutzung von Interaktionsschaltflächen und Projektwerkzeugen verarbeiten wir die von Ihnen eingegebenen Rahmenbedingungen und Statusmeldungen (z. B. vereinbarte Termine, Gagenrahmen, Auftritts- und Sicherheitsdetails).
Zweck: Technische Dokumentation und Bereitstellung der Kommunikations- und Absicherungsfunktionen für die beteiligten Nutzer.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bzw. Durchführung vorvertraglicher Maßnahmen).
            </p>
            <p className="text-slate-400 leading-relaxed">
              d) Standortdaten und Kartendienste (z. B. Google Maps Integration)
Zur Darstellung von Veranstaltungsorten, Venues und regionalen Netzwerkkontakten nutzt GIGSDA Kartendienste (z. B. Google Maps).Zur Nutzung der Funktionen von Google Maps ist es erforderlich, Ihre IP-Adresse zu speichern und an Server des Anbieters (z. B. Google Ireland Limited) zu übertragen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung beim Aufruf von Kartenfunktionen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer leichten Auffindbarkeit von Event-Standorten).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              4. Weitergabe von Daten an Dritte
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den nachstehend aufgeführten Zwecken findet nicht statt. 
Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:Sie Ihre ausdrückliche Einwilligung dazu erteilt haben (Art. 6 Abs. 1 lit. a DSGVO),
   dies für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO),
   eine gesetzliche Verpflichtung zur Weitergabe besteht (Art. 6 Abs. 1 lit. c DSGVO),
   die Weitergabe an externe Dienstleister (z. B. Hosting-Anbieter, lizenzierte Zahlungsdienstleister bei Treuhand-/Zahlungsabwicklungen) im Rahmen einer Auftragsverarbeitung erfolgt (Art. 28 DSGVO).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              5. Cookies und Analyse-Tools
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert.
Technisch notwendige Cookies: Diese sind erforderlich, um Grundfunktionen der Plattform (z. B. Login-Status, Session-Verwaltung) zu gewährleisten (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO).
Optionale / Analyse-Cookies: Werden nur mit Ihrer ausdrücklichen Einwilligung über unser Cookie-Banner gesetzt (Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO). 
Sie können Ihre Einwilligung jederzeit über die Cookie-Einstellungen auf der Website widerrufen. 
            </p>
          </div>

          <div className="bg-slate-900/60 border border-cyan-500/10 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              6. Speicherdauer
            </h2>

            <p className="text-slate-400 leading-relaxed">
              Soweit in dieser Datenschutzerklärung keine spezielle Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. 
Wenn Sie ein berechtigtes Löschersuchen geltend machen oder Ihre Einwilligung zur Datenverarbeitung widerrufen, 
werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung haben 
(z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen).7. Ihre Rechte als betroffene PersonNach der DSGVO 
stehen Ihnen folgende Rechte zu:Auskunftsrecht (Art. 15 DSGVO): Recht auf Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten.
Berichtigungsrecht (Art. 16 DSGVO): 
Recht auf unverzügliche Berichtigung unrichtiger Daten.Löschungsrecht („Recht auf Vergessenwerden“, Art. 17 DSGVO): 
Recht auf Löschung Ihrer gespeicherten Daten.Einschränkung der Verarbeitung (Art. 18 DSGVO): 
Recht auf Einschränkung der Datenverarbeitung.Datenübertragbarkeit (Art. 20 DSGVO): 
Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.Widerrufsrecht (Art. 7 Abs. 3 DSGVO): 
Recht, eine erteilte Einwilligung jederzeit für die Zukunft zu widerrufen.Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO): 
Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, steht Ihnen ein Beschwerderecht bei 
der zuständigen Aufsichtsbehörde zu (in Österreich: Österreichische Datenschutzbehörde, Barichgasse 40-42, 1030 Wien, www.dsb.gv.at).
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

    </div>
  );
}