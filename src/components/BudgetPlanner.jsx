import React, { useState, useEffect } from 'react';
import { saveBudgetPlan, getBudgetPlans, deleteBudgetPlan } from '../services/apiService';

export default function BudgetPlanner({ currentProfileId, setView }) {

  const [planTitle, setPlanTitle] = useState('');
  const [tickets, setTickets] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [sponsors, setSponsors] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  const [customCosts, setCustomCosts] = useState([]);

  function addCustomCost() {
    setCustomCosts(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        amount: ''
      }
    ]);
  }

  const [capital, setCapital] = useState('');

  const [costs, setCosts] = useState({
      location: '',
      technology: '',
      artists: '',
      crew: '',
      security: '',
      catering: '',
      logistics: '',
      marketing: '',
      other: ''
  });

  const ticketRevenue =
    Number(tickets || 0) *
    Number(ticketPrice || 0);

  const totalIncome =
    Number(capital || 0) +
    Number(sponsors || 0) +
    Number(otherIncome || 0) +
    ticketRevenue;

  const customCostsTotal =
    customCosts.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  const totalCosts =
    Object.values(costs).reduce(
      (sum, value) => sum + Number(value || 0),
      0
    ) + customCostsTotal;

  const buffer =
    Number(capital || 0) -
    totalCosts;


  const reserve = totalIncome - totalCosts;

  const breakEvenVisitors =
    ticketPrice > 0
      ? Math.ceil(totalCosts / ticketPrice)
      : 0;
        
  const visitorRatio =
    breakEvenVisitors > 0
      ? tickets / breakEvenVisitors
      : 0;
      
  const visitorDifference =
    Number(tickets || 0) -
    breakEvenVisitors;

      let rating = '';

      if (visitorRatio >= 2) {
        rating = '✅ Sehr realistisch';
      }
      else if (visitorRatio >= 1) {
        rating = '⚠ Knapp kalkuliert';
      }
      else {
        rating = '❌ Hohes Risiko';
      }

  
  const labels = {
      location: '🏢 Location',
      technology: '🎛 Technik',
      artists: '🎤 Künstler',
      crew: '👷 Crew',
      security: '🛡 Security',
      catering: '🍔 Catering',
      logistics: '🚚 Logistik',
      marketing: '📢 Marketing',
      other: '📦 Sonstiges'
  };

  const [notes, setNotes] = useState('');

  function openPlan(plan) {

    const data =
      JSON.parse(plan.plan_json);

    setPlanTitle(plan.title);

    setCapital(data.capital || '');
    setTickets(data.tickets || '');
    setTicketPrice(data.ticketPrice || '');
    setSponsors(data.sponsors || '');
    setOtherIncome(data.otherIncome || '');

    setCosts(data.costs || {});

    setCustomCosts(
      data.customCosts || []
    );

    setNotes(data.notes || '');

  }

  const [savedPlans, setSavedPlans] =
    useState([]);

    useEffect(() => {
      loadPlans();
    }, []);

    async function loadPlans() {

      const result =
        await getBudgetPlans(
          currentProfileId
        );

      if (result.success) {
        setSavedPlans(
          result.plans || []
        );
      }

    }

    async function removePlan(id) {

    const result =
      await deleteBudgetPlan(id);

    if (result.success) {
      await loadPlans();
    }

  }

  async function savePlan() {

    if (!planTitle.trim()) {
      alert('Bitte zuerst einen Planungsnamen eingeben.');
      return;
    }

    const budgetPlan = {
      id: Date.now(),
      title: planTitle,
      ownerId: currentProfileId,
      capital,
      tickets,
      ticketPrice,
      sponsors,
      otherIncome,
      costs,
      customCosts,
      notes,
      reserve,
      breakEvenVisitors,
      createdAt: Date.now()
    };

    const result =
      await saveBudgetPlan(
        budgetPlan
      );

    console.log(result);

    if (result.success) {
      alert('Budgetplanung gespeichert');

      await loadPlans();
    }

  }
  return (
      <div className="max-w-6xl mx-auto p-6 text-slate-200">

          <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-cyan-400">
                  💰 Budget Planner
              </h1>

              <div className="mb-6">
                <label className="block mb-2 text-cyan-400 font-bold">
                  📄 Planungsname
                </label>

                <input
                  type="text"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="z.B. Clubshow Braunau 2027"
                  className="w-full p-2 rounded bg-slate-900 border border-slate-800"
                />
              </div>

              <button
                  onClick={() => setView('projects')}
                  className="bg-slate-800 px-4 py-2 rounded-xl"
              >
                  Zurück
              </button>
          </div>

          {/*  LINKE SEITE   [key]: Number(e.target.value)  */}
          <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-xl mb-4">
              Finanzierung
            </h2>
            <div className="flex items-center justify-between gap-4 mb-3">
              <label className="min-w-[170px]">
                💰 Verfügbares Kapital
              </label>

              <input
                type="number"
                value={capital}
                onChange={(e) =>
                  setCapital(Number(e.target.value))
                }
                className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
              <label className="min-w-[170px]">
                🎟 Erwartete Besucher
              </label>

              <input
                type="number"
                value={tickets}
                onChange={(e) =>
                  setTickets(Number(e.target.value))
                }
                className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
              <label className="min-w-[170px]">
                🎫 Ticketpreis (€)
              </label>

              <input
                type="number"
                value={ticketPrice}
                onChange={(e) =>
                  setTicketPrice(Number(e.target.value))
                }
                className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
              <label className="min-w-[170px]">
                🤝 Sponsoren
              </label>

              <input
                type="number"
                value={sponsors}
                onChange={(e) =>
                  setSponsors(Number(e.target.value))
                }
                className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
              />
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <label className="min-w-[170px]">
                💵 Sonstige Einnahmen
              </label>

              <input
                type="number"
                value={otherIncome}
                onChange={(e) =>
                  setOtherIncome(Number(e.target.value))
                }
                className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
              />
            </div>
            <h2 className="text-xl mb-4 mt-6">
              Standardkosten
            </h2>

            {Object.keys(costs).map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 mb-3"
              >
                <label className="min-w-[170px]">
                  {labels[key]}
                </label>

                <input
                  type="number"
                  value={costs[key]}
                  onChange={(e) =>
                    setCosts({
                      ...costs,
                      [key]: Number(e.target.value)
                    })
                  }
                  className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
                />
              </div>
            ))}
            <div className="border-t border-slate-800 mt-6 pt-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={addCustomCost}
                  className="mt-5 w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl"
                >
                  ➕ Hinzufügen
                </button>
              </div>

              {customCosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 mb-3"
                >
                  <input
                    type="text"
                    placeholder="Neue Position"
                    value={item.name}
                    onChange={(e) =>
                      setCustomCosts(
                        customCosts.map((c) =>
                          c.id === item.id
                            ? { ...c, name: e.target.value }
                            : c
                        )
                      )
                    }
                    className="flex-1 p-2 rounded bg-slate-900"
                  />
                  <button
                    onClick={() =>
                      setCustomCosts(
                        customCosts.filter(
                          c => c.id !== item.id
                        )
                      )
                    }
                    className="text-red-500 hover:text-red-300 px-2"
                  >
                    ✕
                  </button>
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        setCustomCosts(
                          customCosts.map((c) =>
                            c.id === item.id
                              ? {
                                  ...c,
                                  amount: Number(e.target.value)
                                }
                              : c
                          )
                        )
                      }
                      className="w-32 p-2 rounded bg-slate-900 text-right no-spinner"
                    />
                </div>
              ))}
            </div>
          </div>

          {/*  RECHTE SEITE   [key]: Number(e.target.value)  */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

              <div className="border-b border-slate-800 pb-4 mb-4">

                <h3 className="text-cyan-400 font-bold mb-3">
                  💰 Kapital & Finanzierung
                </h3>

                <div className="flex justify-between">
                  <span>Startbudget</span>
                  <span>{Number(capital || 0).toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between">
                  <span>Sponsoren</span>
                  <span>{Number(sponsors || 0).toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between">
                  <span>Sonstige Einnahmen</span>
                  <span>{Number(otherIncome || 0).toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between font-bold pt-2">
                  <span>Verfügbare Mittel</span>
                  <span>
                    {(
                      Number(capital || 0) +
                      Number(sponsors || 0) +
                      Number(otherIncome || 0)
                    ).toLocaleString('de-DE')} €
                  </span>
                </div>

              </div>


              <div className="border-b border-slate-800 pb-4 mb-4">

                <h3 className="text-cyan-400 font-bold mb-3">
                  🎟 Event-Ertrag
                </h3>

                <div className="flex justify-between">
                  <span>Ticketumsatz</span>
                  <span>{ticketRevenue.toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between">
                  <span>Break-Even Besucher</span>
                  <span>{breakEvenVisitors}</span>
                </div>

                <div className="flex justify-between">
                  <span>Geplant</span>
                  <span>{Number(tickets || 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Besucherpuffer</span>
                  <span>{visitorDifference}</span>
                </div>

              </div>


              <div>

                <h3 className="text-cyan-400 font-bold mb-3">
                  📊 Ergebnis & Risiko
                </h3>

                <div className="flex justify-between">
                  <span>Gesamtkosten</span>
                  <span>{totalCosts.toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between">
                  <span>Event-Ergebnis</span>
                  <span>
                    {(ticketRevenue - totalCosts).toLocaleString('de-DE')} €
                  </span>
                </div>

                <div className="pt-2 font-bold">
                  {rating}
                </div>

                <div className="flex justify-between text-xl font-bold border-t border-slate-800 mt-3 pt-3">
                  <span>Sicherheits-Puffer</span>
                  <span>{buffer.toLocaleString('de-DE')} €</span>
                </div>

                <div className="flex justify-between text-xl font-bold border-t border-slate-800 mt-3 pt-3">
                  <span>Kapital nach Event</span>
                  <span>{reserve.toLocaleString('de-DE')} €</span>
                </div>

              </div>







              <div className="space-y-4">
                <div className="space-y-3">


                  <div className="pt-2">
                    {reserve >= 0 ? (
                      <div className="text-green-400">
                        ✅ Event wirtschaftlich machbar
                      </div>
                    ) : (
                      <div className="text-red-400">
                        ❌ Budget überschritten
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                  className="mt-8 w-full border border-cyan-500 rounded-xl py-3"
              >
                  ✅ Veranstaltungs-Checkliste
                  <div className="text-xs text-slate-500">
                      Coming Soon
                  </div>
              </button>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Eigene Notizen zur Budgetplanung..."
                className="mt-8 w-full h-52 p-3 rounded bg-slate-900 border border-slate-800 resize-none"
              />
              <button
                onClick={savePlan}
                className="mt-5 w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl"
              >
                💾 Planung speichern
              </button>

          </div>
        <div className="mt-8">
          <h3 className="text-cyan-400 font-bold mb-3">
            📂 Gespeicherte Planungen
          </h3>

          {savedPlans.map(plan => (
            <div
              key={plan.id}
              className="bg-slate-900 rounded-lg p-3 mb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">
                    {plan.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {plan.id}
                  </div>

                </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPlan(plan)}
                      className="text-cyan-400"
                    >
                      📂
                    </button>
                    <button
                      onClick={() => removePlan(plan.id)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}