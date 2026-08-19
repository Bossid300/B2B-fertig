import React from 'react';
import { useState } from 'react';

import { PLAN_CONFIG }
from '../moduls/subscriptions/subscriptionPlans';
import { PROMOTION_PLANS }
from '../moduls/subscriptions/promotionPlans';
import { subscriptionService }
from '../moduls/subscriptions/subscriptionService';
import {
  updateSubscriptionPlan,
  updateSubscriptionOrderStatus
} from './services/apiService';


export default function PricingPage({
  setView
}) {
  
  const currentPlan =
    subscriptionService.getPlan();

  const [showOrderSuccess, setShowOrderSuccess] =
    useState(false);

  const [selectedPlanName, setSelectedPlanName] =
    useState('');
  
  
  return (
    
    <div className="max-w-6xl mx-auto px-6 py-12 ">
      <div className="mb-12">
        <h1 className="text-cyan-400 text-3xl font-black uppercase tracking-wider font-mono flex items-center gap-4">
          💎 GIGSDA MODEL
        </h1>
        <p className="text-slate-500 mt-4 font-mono">
          Vom Entdecken bis zur eigenen Event-Organisation.
        </p>
      </div>

      {/* PREISTABELLE */}

      <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(PLAN_CONFIG).map(([key, plan]) => {
          const isCurrentPlan =
            currentPlan === key;

          const borderColor =
            plan.color === 'cyan'
              ? 'border-cyan-500/30'
              : plan.color === 'pink'
              ? 'border-pink-500/30'
              : 'border-yellow-500/30';

          const titleColor =
            plan.color === 'cyan'
              ? 'text-cyan-400'
              : plan.color === 'pink'
              ? 'text-pink-400'
              : 'text-yellow-400';

          return (

            <div
              key={key}
              className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff08ea)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box"
              }}
            >

              {plan.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[12px] font-black tracking-widest uppercase font-mono">
                  {plan.badge}
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[12px] font-black tracking-widest uppercase font-mono">
                  DEIN PLAN
                </div>
              )}
              <h2
                className={`${titleColor} text-3xl font-black uppercase mb-2 font-mono`}
              >
                {plan.title}
              </h2>

              <div
                className={`${titleColor} text-5xl font-black mb-1 font-mono`}
              >
                {plan.price}
              </div>

              <div className="text-slate-500 text-xs uppercase tracking-widest mb-8 font-mono">
                pro Monat
              </div>

              <div className="space-y-3 text-slate-300 font-mono">

                {plan.displayFeatures?.map((feature) => (
                  <div key={feature}>
                    ✓ {feature}
                  </div>
                ))}

                {plan.lockedFeatures?.length > 0 && (
                  <>
                    <div className="border-t border-slate-800 pt-4 mt-4"></div>

                    {plan.lockedFeatures.map((feature) => (
                      <div
                        key={feature}
                        className="text-red-300"
                      >
                        ✗ {feature}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {currentPlan === key ? (
                <div className="mt-8">
                  <div className="w-full py-3 rounded-xl bg-cyan-500 text-slate-900 text-center font-black uppercase tracking-widest">
                    ✅ DEIN PLAN
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <button
                    className="w-full py-3 rounded-xl font-black uppercase tracking-widest bg-slate-700 text-slate-300 hover:bg-cyan-500/20"
                    onClick={async () => {
                      setSelectedPlanName(key);
                      setShowOrderSuccess(true);
                    }}
                  >
                    PLAN WECHSELN
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>



      {/* PROMOTION+ */}

      <div className="mt-16 bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-8 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]">

        <h2 className="text-cyan-400 text-2xl font-black uppercase mb-4 font-mono">
          🚀 PROMOTION+
        </h2>

        <p className="text-slate-400 font-mono mb-8">
          Erweiterte Vermarktungsoptionen für mehr Reichweite.
        </p>

        <div className="grid md:grid-cols-3 gap-4">

          {PROMOTION_PLANS.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02]"
              style={{
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #00f2fe, #ff08ea)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box"
              }}
            >

              <div className="text-cyan-300 font-black mb-2 font-mono">
                {item.icon} {item.title}
              </div>

              <div className="text-slate-400 text-sm font-mono">
                {item.description}
              </div>

              <div className="text-pink-400 font-black mt-4 font-mono">
                {item.price}
              </div>
            </div>

          ))}
        </div>
      </div>

      {/* TESTPHASE */}

      <div className="mt-12 text-center">

        <div className="text-pink-400 uppercase tracking-widest font-black mb-3 font-mono animate-pulse">
          🚧 Testphase
        </div>

        <div className="text-slate-500 text-sm font-mono">
          Alle Preise dienen aktuell der internen Entwicklung
          und können sich bis zum offiziellen Start ändern.
        </div>


      </div>

      {showOrderSuccess && (

        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center">

          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-slate-950 p-8 font-mono">

            <div className="text-cyan-400 text-xl font-black mb-4 uppercase">
              🚀 Upgrade bestätigen
            </div>

            <div className="text-slate-300 mb-6">

              Du bist dabei auf

              <span className="text-cyan-400 font-bold">
                {' '}{selectedPlanName}{' '}
              </span>

              zu wechseln.

            </div>

            <div className="space-y-2 text-xs text-slate-400 mb-8">

              <div>✓ Bestellung anlegen</div>
              <div>✓ Zahlungsart auswählen</div>
              <div>✓ Zahlung bestätigen</div>
              <div>✓ Abo sofort aktivieren</div>

            </div>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowOrderSuccess(false)
                }
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300"
              >
                ABBRECHEN
              </button>

              <button
                type="button"
                onClick={async () => {

                  const profileId =
                    localStorage.getItem(
                      'gigsda_profile_id'
                    );

                  await updateSubscriptionPlan(
                    profileId,
                    selectedPlanName
                  );
                  setShowOrderSuccess(false);
                  setView('billing');
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black"
              >
                BESTELLEN
              </button>

            </div>

          </div>

        </div>

      )}
      
    </div>
  );
}