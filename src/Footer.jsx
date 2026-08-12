import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer({ setView }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (

    <footer className="w-full border-t border-slate-900 bg-slate-950 pt-12 pb-0 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm font-sans text-slate-500">
        
        {/* Spalte 1 */}
        <div className="space-y-2.5">
          <h5 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            // RECHTLICHES
          </h5>
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setView('terms')}
                className="hover:text-cyan-400 transition-colors"
              >
                Nutzungsbedingungen
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('privacy')}
                className="hover:text-cyan-400 transition-colors"
              >
                Datenschutzerklärung
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('impressum')}
                className="hover:text-cyan-400 transition-colors"
              >
                Impressum
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('agb')}
                className="hover:text-cyan-400 transition-colors"
              >
                AGB
              </button>
            </li>
          </ul>
        </div>

        {/* Spalte 2 */}
        <div className="space-y-2.5">
          <h5 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            // NETZWERK & INFOS
          </h5>
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setView('whatIsGigsda')}
                className="hover:text-cyan-400 transition-colors"
              >
                Was ist gigsda
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('eventlocation')}
                className="hover:text-cyan-400 transition-colors"
              >
                Events & Locations
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('searchprotocol')}
                className="hover:text-cyan-400 transition-colors"
              >
                Sucher-Protokoll
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('tutorial')}
                className="hover:text-cyan-400 transition-colors"
              >
                Tutorials
              </button>
            </li>            
          </ul>
        </div>

        {/* Spalte 3 */}
        <div className="space-y-2.5">
          <h5 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            // SICHERHEIT
          </h5>
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setView('security')}
                className="hover:text-cyan-400 transition-colors"
              >
                Richtlinien & Sicherheit
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('payment')}
                className="hover:text-cyan-400 transition-colors"
              >
                Zahlungsarten
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('escrowprotection')}
                className="hover:text-cyan-400 transition-colors"
              >
                Treuhand-Schutz
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('faq')}
                className="hover:text-cyan-400 transition-colors"
              >
                FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Spalte 4 */}
        <div className="space-y-2.5">
          <h5 className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            // GIGDATA GMBH
          </h5>
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setView('about')}
                className="hover:text-cyan-400 transition-colors"
              >
                Über uns
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('contact')}
                className="hover:text-cyan-400 transition-colors"
              >
                Kontakt
              </button>
            </li>
            <li>
              <button
                onClick={() => setView('career')}
                className="hover:text-cyan-400 transition-colors"
              >
                Karriere
              </button>
            </li>
            <li className="text-[11px] font-mono text-slate-700 pt-2">© 2026 GIGDATA GmbH</li>
          </ul>
        </div>
      </div>

      {/* TOP BUTON */}
      <div className="flex justify-center py-4">
        <button 
          type="button" 
          onClick={scrollToTop}
          className="
            p-2 bg-slate-900 border border-slate-800 
            hover:border-emerald-400 rounded-xl text-slate-400 
            hover:text-white transition-all shadow-md 
            group flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold
            "
          >
          <span>
            Top
          </span>
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
      
    </footer>
  );
}
