import React, { useState, useEffect} from 'react';
import { getPendingOrders } from '../services/apiService';
import { getInvoices } from '../services/apiService';
import { subscriptionService } from '../../moduls/subscriptions/subscriptionService';


export default function BillingCenter() {

const [pendingOrders, setPendingOrders] =
  useState([]);
const [invoices, setInvoices] =
  useState([]);
const [selectedInvoice, setSelectedInvoice] =
  useState(null);


  useEffect(() => {

  const profileId =
    localStorage.getItem(
      'gigsda_profile_id'
    );

  if (!profileId) return;

    getPendingOrders(profileId)

    .then(result => {

      if (result?.success) {

        setPendingOrders(
          result.orders || []
        );

      }

    })

    .catch(console.error);

    getInvoices(profileId)

    .then(result => {

        if (result?.success) {

        setInvoices(
            result.invoices || []
        );

        }

    })

    .catch(console.error);

}, []);

  return (

    <div className="max-w-6xl mx-auto p-6 text-white font-mono">

      <h1 className="text-4xl text-emerald-400 mb-6">
        BILLING CENTER
      </h1>

      {/* AKTUELLER TARIF */}

      <div className="mb-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/50">

        <div className="text-cyan-400 text-xs uppercase mb-2">
          Aktiver Tarif
        </div>

        <div className="text-xl font-black">
        💎 {subscriptionService.getPlan()}
        </div>

      </div>

      {/* OFFENE BESTELLUNGEN */}

      <div className="mb-4 p-4 rounded-xl border border-amber-500/20 bg-slate-900/50">

        <div className="text-amber-400 text-xs uppercase mb-3">
          {pendingOrders.length === 0 ? (

            <div>
                Keine offenen Bestellungen
            </div>

        ) : (

        pendingOrders.map(order => (

            <div
            key={order.id}
            className="p-3 rounded-xl border border-slate-800 mb-2"
            >

            <div>
                {order.plan}
            </div>

            <div>
                {order.price} €
            </div>

            <div>
                {order.status}
            </div>

            </div>

        ))

        )}
        </div>

      </div>

      {/* RECHNUNGEN */}

      <div className="mb-4 p-4 rounded-xl border border-cyan-500/20 bg-slate-900/50">

        <div className="text-cyan-400 text-xs uppercase mb-3">
          Rechnungen
        </div>

        <div className="p-3 rounded-xl border border-slate-800">

            {invoices.map(invoice => (

            <div
                key={invoice.id}
                className="p-3 rounded-xl border border-slate-800 mb-2"
            >

                <div>
                {invoice.invoice_number}
                </div>

                <div>
                {invoice.plan}
                </div>

                <div>
                {invoice.amount} €
                </div>

                <button
                type="button"
                className="mt-2 px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs"
                onClick={() => {
                    setSelectedInvoice(invoice);

                    window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                    });
                }}
                >
                ANSEHEN
                </button>
            </div>

            ))}

        </div>

      </div>

      {/* RECHNUNGSVIEWER */}
        {selectedInvoice && (
        <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950">
            
            <div className="text-cyan-400 text-xs uppercase mb-3">
            Rechnung Details
            </div>

            <div>
            Nummer: {selectedInvoice?.invoice_number}
            </div>

            <div>
            Status:
            <span className="text-emerald-400 ml-2">
            BEZAHLT
            </span>
            </div>

            <div>
            Kunde: {selectedInvoice?.profile_id}
            </div>

            <div>
            Plan: {selectedInvoice?.plan}
            </div>

            <div>
            Betrag: {selectedInvoice?.amount} €
            </div>

            <div>
            Leistung: GIGSDA {selectedInvoice?.plan} Mitgliedschaft
            </div>

            <div>Netto: {(selectedInvoice.amount / 1.2).toFixed(2)} €</div>
            <div>MwSt: {(selectedInvoice.amount - (selectedInvoice.amount / 1.2)).toFixed(2)} €</div>
            <div>Brutto: {selectedInvoice.amount} €</div>

            <button
                type="button"
                className="mt-4 px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase"
                onClick={() => {

                const printWindow =
                    window.open(
                    '',
                    '_blank'
                    );

                printWindow.document.write(`
                    <html>
                    <head>
                        <title>
                        ${selectedInvoice.invoice_number}
                        </title>
                        <style>
                        body{
                            font-family: Arial, sans-serif;
                            max-width: 800px;
                            margin: 40px auto;
                            padding: 20px;
                        }

                        h1{
                            color:#0ea5e9;
                        }

                        .section{
                            margin-top:25px;
                        }

                        .total{
                            font-size:18px;
                            font-weight:bold;
                        }
                        </style>
                    </head>

                    <body>

                        <h1>GIGSDA</h1>

                        <h2>
                        Rechnung
                        ${selectedInvoice.invoice_number}
                        </h2>

                        <hr>

                        <p>
                        Rechnungsempfänger:
                        ${selectedInvoice.profile_id}
                        </p>

                        <p>
                        Leistung:
                        ${selectedInvoice?.plan ? `GIGSDA ${selectedInvoice.plan} Mitgliedschaft` : 'Unbekannte Leistung'}
                        </p>

                        <p>
                        Status:
                        ${selectedInvoice?.status || 'BEZAHLT'}
                        </p>

                        <p>
                        Netto:
                        ${(selectedInvoice.amount / 1.2).toFixed(2)} €
                        </p>

                        <p>
                        MwSt:
                        ${(selectedInvoice.amount - (selectedInvoice.amount / 1.2)).toFixed(2)} €
                        </p>

                        <p>
                        Brutto:
                        ${selectedInvoice.amount} €
                        </p>

                        <p>
                        Datum:
                        ${selectedInvoice.created_at}
                        </p>

                    </body>
                    </html>
                `);

                printWindow.document.close();

                printWindow.print();

                }}
            >
                📄 RECHNUNG DRUCKEN
            </button>

        </div>
        )}
    </div>

  );

}