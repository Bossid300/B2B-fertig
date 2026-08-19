import React, { useState, useEffect} from 'react';
import {
  getPendingOrders,
  getInvoices,
  updateSubscriptionOrderStatus
} from '../services/apiService';
import { subscriptionService } from '../../moduls/subscriptions/subscriptionService';


export default function BillingCenter() {
const [showPaymentGateway, setShowPaymentGateway] =
  useState(false);

const [selectedOrder, setSelectedOrder] =
  useState(null);

const [selectedProvider, setSelectedProvider] =
  useState('paypal');

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

              <button
                type="button"
                className="mt-2 px-3 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 text-xs"
                onClick={() => {
                  setSelectedOrder(order);
                  setShowPaymentGateway(true);
                }}
              >
                ZAHLUNG ABSCHLIESSEN
              </button>

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

          {invoices
            .slice(0, 5)
            .map(invoice => (

            <div className="flex items-center justify-between">

              <div>

                <div className="font-bold">
                  {invoice.invoice_number}
                </div>

                <div className="text-xs text-slate-400">
                  {invoice.plan} • {invoice.amount} €
                </div>

              </div>

              <button
                type="button"
                className="px-3 py-1 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs"
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

              <div className="text-lg font-black text-white mb-2">
                {selectedInvoice?.invoice_number}
              </div>

              <div className="text-cyan-400 mb-4">
                {selectedInvoice?.plan}
                {' • '}
                {selectedInvoice?.status || 'BEZAHLT'}
              </div>

              <div className="border-t border-slate-800 my-4" />

              <div>Netto: {(selectedInvoice.amount / 1.2).toFixed(2)} €</div>
              <div>MwSt: {(selectedInvoice.amount - (selectedInvoice.amount / 1.2)).toFixed(2)} €</div>

              <div className="border-t border-slate-800 my-4" />
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
                              font-family: Arial,sans-serif;
                              max-width:900px;
                              margin:40px auto;
                              padding:30px;
                              color:#111;
                            }
                            .header{
                              display:flex;
                              justify-content:space-between;
                              align-items:flex-start;
                            }
                            .brand{
                              font-size:32px;
                              font-weight:900;
                              color:#00a5e9;
                            }
                            .subline{
                              font-size:12px;
                              letter-spacing:2px;
                            }
                            .paid{
                              color:#00aa66;
                              font-weight:bold;
                            }
                            hr{
                              margin:25px 0;
                            }
                            h1{
                              margin-bottom:10px;
                            }
                            .invoice-number{
                              font-size:20px;
                              font-weight:bold;
                              margin-bottom:25px;
                            }
                            .section{
                              margin-bottom:25px;
                            }
                            .label{
                              font-size:12px;
                              letter-spacing:2px;
                              color:#666;
                              margin-bottom:8px;
                            }
                            .total-box{
                              border:1px solid #ddd;
                              padding:20px;
                              margin-top:30px;
                            }
                            .row{
                              display:flex;
                              justify-content:space-between;
                              margin-bottom:8px;
                            }
                            .line{
                              border-top:1px solid #ccc;
                              margin:12px 0;
                            }
                            .total{
                              font-size:20px;
                              font-weight:bold;
                            }
                            .footer{
                              margin-top:50px;
                              text-align:center;
                              color:#666;
                              font-size:12px;
                            }
                            .invoice-header{
                              display:flex;
                              justify-content:space-between;
                              align-items:flex-end;
                              margin-bottom:25px;
                            }
                            .invoice-number{
                              font-size:20px;
                              font-weight:bold;
                            }
                            .footer-line{
                              border-top:1px solid #ccc;
                              margin-bottom:20px;
                            }
                          </style>
                      </head>

                      <body>

                        <div class="header">

                          <div class="brand">
                            GIGSDA
                          </div>

                          <div class="subline">
                            EVENT NETWORK
                          </div>

                          <div class="paid">
                            ✔ BEZAHLT
                          </div>

                        </div>

                        <hr>

                        <div class="invoice-header">

                          <h1>RECHNUNG</h1>

                          <div class="invoice-number">
                            ${selectedInvoice.invoice_number}
                          </div>

                        </div>

                        <div class="section">

                          <div class="label">
                            RECHNUNGSDATUM
                          </div>

                          <div>
                            ${new Date(
                              selectedInvoice.created_at
                            ).toLocaleDateString(
                              'de-DE',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              }
                            )}
                          </div>

                        </div>

                        <div class="section">

                          <div class="label">
                            RECHNUNGSEMPFÄNGER
                          </div>

                          <div>
                            ${selectedInvoice.name}<br>
                          </div>
                          <div>
                            ${selectedInvoice.street}<br>
                            ${selectedInvoice.plz} 
                            ${selectedInvoice.city}<br>
                          </div>
                          <div>
                            UID: 
                            ${selectedInvoice.company_uid}<br>
                          </div>
                          <div>                         
                            Steuernummer: 
                            ${selectedInvoice.steuernummer}<br>
                          </div>

                        </div>

                        <div class="section">

                          <div class="label">
                            LEISTUNG
                          </div>

                          <div>
                            GIGSDA ${selectedInvoice.plan} Mitgliedschaft
                          </div>

                        </div>

                        <div class="total-box">

                          <div class="row">
                            <span>NETTO</span>
                            <span>${(selectedInvoice.amount / 1.2).toFixed(2)} €</span>
                          </div>

                          <div class="row">
                            <span>MWST</span>
                            <span>${(
                              selectedInvoice.amount -
                              (selectedInvoice.amount / 1.2)
                            ).toFixed(2)} €</span>
                          </div>

                          <div class="line"></div>

                          <div class="row total">
                            <span>BRUTTO</span>
                            <span>${selectedInvoice.amount} €</span>
                          </div>

                        </div>

                        <div class="footer">

                          <div class="footer-line"></div>

                          <div>
                            GIGSDA EVENT NETWORK
                          </div>

                          <div>
                            DIGITAL BILLING DOCUMENT
                          </div>

                          <div>
                            GENERATED AUTOMATICALLY
                          </div>

                          <div>
                            gigsda.com
                          </div>

                        </div>


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

      {/* PAYPAL */}
        {showPaymentGateway && selectedOrder && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">

            <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/20 rounded-3xl p-6">

              <h3 className="text-cyan-400 font-black mb-4">
                💳 GIGSDA PAYMENT GATEWAY
              </h3>

              <div className="mb-4">
                Plan: {selectedOrder.plan}
              </div>

              <div className="mb-6">
                Betrag: {selectedOrder.price} €
              </div>

              <div className="space-y-2 mb-6">

                <label className="block">
                  <input
                    type="radio"
                    checked={selectedProvider === 'paypal'}
                    onChange={() =>
                      setSelectedProvider('paypal')
                    }
                  />
                  {' '}PayPal
                </label>

                <label className="block">
                  <input
                    type="radio"
                    checked={selectedProvider === 'klarna'}
                    onChange={() =>
                      setSelectedProvider('klarna')
                    }
                  />
                  {' '}Klarna
                </label>

                <label className="block">
                  <input
                    type="radio"
                    checked={selectedProvider === 'sepa'}
                    onChange={() =>
                      setSelectedProvider('sepa')
                    }
                  />
                  {' '}SEPA
                </label>

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowPaymentGateway(false)
                  }
                >
                  ABBRECHEN
                </button>

                <button
                  type="button"
                  onClick={async () => {

                    await updateSubscriptionOrderStatus(
                      selectedOrder.id,
                      'paid'
                    );

                    window.location.reload();

                  }}
                >
                  ZAHLUNG BESTÄTIGEN
                </button>

              </div>

            </div>

          </div>

        )}        
    </div>

  );

}