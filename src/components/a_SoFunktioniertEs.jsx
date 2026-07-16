import React from 'react';

export default function ASoFunktioniertEs() {

const cards = [
  {
    image: '/2026/landing/standort_waehlen.png',
    alt: 'Standort wählen',
    label: 'Standort wählen',
    color: 'cyan'
  },
  {
    image: '/2026/landing/gig_finden.png',
    alt: 'Gig finden',
    label: 'Gig finden',
    color: 'purple'
  },
  {
    image: '/2026/landing/dabei_sein.png',
    alt: 'Dabei sein',
    label: 'Dabei sein',
    color: 'pink'
  }
];

  return (
    <section>       
    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6">
      // SO FUNKTIONIERT ES
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cards.map((card, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/">
            {/* HIER WAR VORHER NUR {card.image} */}
            <img src={card.image} alt={card.alt} className="w-full h-auto object-cover" />
        </div>
        ))}
    </div>
    </section>
  );
}