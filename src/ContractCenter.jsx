import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, ArrowRight, Download } from 'lucide-react';
import FahrplanMetrics from './FahrplanMetrics';

export default function ContractCenter({ onBack, progress, onNavigateToStep, onContractSigned, activeEvent }) {
  const [dealStatus, setDealStatus] = useState('pending'); // pending, processing, signed

  const handleSignContract = () => {
    setDealStatus('processing');
    setTimeout(() => {
      setDealStatus('signed');
      if (typeof onContractSigned === 'function') {
        onContractSigned(); // Schaltet Stufe 3 im Fahrplan auf 100%
      }
    }, 1500);
  };

  // 📥 DAS INTERAKTIVE GIGSDA-RECHNUNGS-PDF-MODUL
  const handleDownloadInvoice = () => {
    if (!activeEvent) return;

    const eventTitle = activeEvent.title || "Gigsda Live Show";
    const eventDate = activeEvent.date || "2026";
    const eventVenue = activeEvent.venue || "Stadtpark Wiese, Braunau";
    const invoiceNumber = "INV-" + activeEvent.id;

    // Erstellt ein virtuelles Druckfenster mit sauberem CSS-Styling
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Gigsda Honorarnote // ${invoiceNumber}</title>
          <style>
            body { font-family: monospace; background: #020617; color: #f1f5f9; padding: 40px; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #1e293b; padding: 30px; border-radius: 20px; background: #0f172a; }
            .header { border-bottom: 2px solid #22d3ee; padding-bottom: 20px; margin-bottom: 20px; flex-direction: row; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: 900; color: #ffffff; }
            .meta { font-size: 11px; color: #94a3b8; line-height: 1.6; }
            .details { margin: 30px 0; font-size: 12px; }
            .table { w-full; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; border-bottom: 1px solid #334155; color: #22d3ee; padding: 10px 0; }
            td { padding: 12px 0; border-bottom: 1px solid #1e293b; color: #e2e8f0; }
            .total-section { text-align: right; margin-top: 30px; font-size: 14px; font-weight: bold; }
            .highlight { color: #10b981; font-size: 18px; }
            .footer { margin-top: 50px; text-align: center; font-size: 9px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; }
            @media print {
              body { background: #ffffff; color: #000000; padding: 20px; }
              .invoice-box { border: none; background: none; padding: 0; }
              .title { color: #000000; }
              th { color: #000000; border-bottom: 2px solid #000000; }
              td { border-bottom: 1px solid #e2e8f0; color: #000000; }
              .highlight { color: #000000; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="title">GIGSDA // HONORARNOTE</div>
                <div class="meta" style="margin-top: 5px;">Dezentrales Buchungs- & Gage-Protokoll</div>
              </div>
              <div class="meta" style="text-align: right;">
                <strong>Rechnungs-Nr:</strong> ${invoiceNumber}<br/>
                <strong>Datum:</strong> 04. Juni 2026<br/>
                <strong>Status:</strong> TREUHAND-VERRIEGELT 🔒
              </div>
            </div>

            <div class="details">
              <strong style="color: #22d3ee;">// VERTRAGSPARTNER:</strong><br/>
              Gigsda Protocol Operator (Winston Jud)<br/>
              Location: ${eventVenue}
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr>
                  <th style="text-align: left;">POSITION / BESCHREIBUNG</th>
                  <th style="text-align: right;">BETRAG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Live-Performance & Booking-Gage: <strong>${eventTitle}</strong><br/><span style="font-size: 10px; color: #64748b;">Veranstaltungsdatum: ${eventDate}</span></td>
                  <td style="text-align: right;">1.500,00 EUR</td>
                </tr>
                <tr>
                  <td>Systemtechnik-Pauschale (FOH Licht & Ton Daniel K.)</td>
                  <td style="text-align: right;">350,00 EUR</td>
                </tr>
              </tbody>
            </table>

            <div class="total-section">
              GESAMTSUMME: <span class="highlight">1.850,00 EUR</span>
            </div>

            <div class="footer">
              GIGSDA PROTOCOL V2.6 // DIGITAL VERSIEGELT ÜBER DIE BLOCKCHAIN-SCHNITTSTELLE // RECHTLICH BINDEND
            </div>
          </div>
          <script>
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          </script>

        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 text-xs text-slate-300 font-mono animate-fade-in">
      
      {/* GLOBALER FAHRPLAN */}
      <FahrplanMetrics progress={progress} activeStep="contract" onNavigate={onNavigateToStep} />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
        <div>
          {activeEvent ? (
            <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block mb-1.5">
              📍 Aktives Event: {activeEvent.title} ({activeEvent.date})
            </span>
          ) : (
            <span className="text-[10px] text-cyan-400 font-bold block mb-1">// Ebene 03: Zusage-Deal</span>
          )}
          <h2 className="text-xl font-bold text-white mt-0.5">Miet- & Bookingvertrag verriegeln</h2>
          <p className="text-slate-400 text-[11px]">Rechtliche Absicherung und Gagen-Hinterlegung über das Treuhand-System.</p>
        </div>
        <button type="button" onClick={onBack} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
          ‹ Zurück
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* RECHTLICHER TEXT */}
        <div className="md:col-span-8 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-cyan-400" /> Digitaler Konzert- & Bookingvertrag
          </h3>
          <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 h-48 overflow-y-auto text-[11px] text-slate-400 font-sans space-y-3 leading-relaxed">
            <p className="font-bold font-mono text-cyan-400 text-[10px]">// PROTOKOLL-AUSZUG rolls-ready //</p>
            <p>Zwischen dem Veranstalter des Events und den in Ebene 01 ausgewählten Crew-Mitgliedern wird folgende Vereinbarung getroffen: Der Künstler Winston Jud verpflichtet sich zu einer Live-Performance am vereinbarten Datum.</p>
            <p>Die vereinbarte Gage wird mit Abschluss dieses digitalen Vertrages auf das dezentrale Gigsda-Treuhandkonto übertragen und dort bis zum erfolgreichen Abschluss der Show (Ebene 06) gesperrt.</p>
          </div>
        </div>

        {/* CONTROLS & DOWNLOAD BOX */}
        <div className="md:col-span-4 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl gap-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Gagen-Absicherung
            </h3>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
              <span className="text-[10px] text-slate-500 block uppercase">Hinterlegte Summe:</span>
              <span className="text-lg font-black text-white">1.850,00 EUR</span>
            </div>
            
            {/* DER DYNAMISCHE PDF BUTTON (Ergänzung für Richtung 1) */}
            {dealStatus === 'signed' && (
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-[9px] uppercase tracking-wider h-9 rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 transition-all shadow-md cursor-pointer animate-fade-in"
              >
                <Download className="w-3.5 h-3.5" /> Honorarnote als PDF 📥
              </button>
            )}
          </div>

          <button
            type="button"
            disabled={dealStatus !== 'pending'}
            onClick={handleSignContract}
            className={`w-full font-black text-[10px] uppercase tracking-wider h-10 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
              dealStatus === 'signed'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-not-allowed'
                : dealStatus === 'processing'
                ? 'bg-slate-950 border border-slate-900 text-slate-600 cursor-wait'
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
            }`}
          >
            {dealStatus === 'signed' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Deal verriegelt
              </>
            ) : dealStatus === 'processing' ? (
              'Signiere Vertrag...'
            ) : (
              'Vertrag digital signieren ✍️'
            )}
          </button>
        </div>

      </div>

      {/* WEITER ZUM TEAM-VOTING */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigateToStep && onNavigateToStep('voting')}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-mono font-black text-[10px] uppercase tracking-wider px-6 h-11 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          Nächster Meilenstein: Team-Voting <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
