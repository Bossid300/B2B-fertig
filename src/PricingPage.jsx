import React from 'react';
import { PLAN_CONFIG }
from '../moduls/subscriptions/subscriptionPlans';
import { PROMOTION_PLANS }
from '../moduls/subscriptions/promotionPlans';
import { subscriptionService }
from '../moduls/subscriptions/subscriptionService';

console.log(PLAN_CONFIG);
console.log(PROMOTION_PLANS);
console.log(subscriptionService);

export default function PricingPage() {

  const currentPlan =
    subscriptionService.getPlan();

  return (
    
    <div className="max-w-7xl mx-auto px-6 py-12 ">
      <div className="mb-12">
        <h1 className="text-cyan-400 text-4xl font-black uppercase tracking-wider font-mono flex items-center gap-4">
          💎 GIGSDA MODEL
        </h1>
        <p className="text-slate-500 mt-4 font-mono">
          Vom Entdecken bis zur eigenen Event-Organisation.
        </p>
      </div>

      {/* PREISTABELLE */}

      <div className="grid md:grid-cols-3 gap-6">
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
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black tracking-widest uppercase font-mono">
                  {plan.badge}
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black tracking-widest uppercase font-mono">
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





{/* DEV TOOLS */}

<div className="mt-8 border border-cyan-500/20 rounded-2xl p-6">

  <h3 className="text-cyan-400 font-black uppercase tracking-widest mb-4 font-mono">
    DEV PLAN SWITCHER
  </h3>

  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => {
        localStorage.setItem('gigsda_plan', 'COMMUNITY');
        window.location.reload();
      }}
      className="px-4 py-2 rounded-xl border border-cyan-500/30"
    >
      COMMUNITY
    </button>

    <button
      onClick={() => {
        localStorage.setItem('gigsda_plan', 'TRIAL');
        window.location.reload();
      }}
      className="px-4 py-2 rounded-xl border border-pink-500/30"
    >
      TRIAL
    </button>

    <button
      onClick={() => {
        localStorage.setItem('gigsda_plan', 'PRO');
        window.location.reload();
      }}
      className="px-4 py-2 rounded-xl border border-pink-500/30"
    >
      PRO
    </button>

    <button
      onClick={() => {
        localStorage.setItem('gigsda_plan', 'AGENCY');
        window.location.reload();
      }}
      className="px-4 py-2 rounded-xl border border-yellow-500/30"
    >
      AGENCY
    </button>

  </div>

</div>





      </div>
    </div>
  );
}