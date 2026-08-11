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
    <section className='pt-8'>
      <div>
        <span className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 z-10 relative">
          // SO FUNKTIOMIERT ES.
        </span>
      </div> 
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 z-10 relative">
        {cards.map((card, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900/ transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            {/* HIER WAR VORHER NUR {card.image} */}
            <img src={card.image} alt={card.alt} className="w-full h-auto object-cover" />
        </div>
        ))}
      </div>
    </section>
  );
}