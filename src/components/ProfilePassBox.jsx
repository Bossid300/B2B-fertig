import React, { useState, useEffect } from 'react';
import { Link, FileText, ArrowLeft } from 'lucide-react';
import ArtistPortfolio from "./ArtistPortfolio";
import { getProfiles } from '../services/apiService';
import { ArrowUp } from 'lucide-react';

export default function ProfilePassBox({ currentProfileName, profileId, setView, sliderImages = [] }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [referrals, setReferrals] = useState([]);
  useEffect(() => {
    getProfiles().then(allProfiles => {
      const matches = allProfiles.filter(profile => {
        const data =
          profile.profile_json
            ? JSON.parse(profile.profile_json)
            : {};
        return data.referred_by === profileId;
      });
      setReferrals(matches);
    });
  }, [profileId]);

  // Generiert den passenden reaktiven Reflink aus dem Künstlernamen
  const slug = currentProfileName ? currentProfileName.toLowerCase().replace(/\s+/g, '-') : '';
  const refLink =
  `https://www.gigsda.com/2026/?portfolio=${profileId}&ref=${profileId}`;

  // Holt das erste Bild aus dem übergebenen Slider-Array (oder nutzt ein Fallback)
  const firstSliderImage = sliderImages && sliderImages.length > 0 ? sliderImages[0] : '';

  // Löst den nativen Browser-Druck/PDF-Export aus
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 space-y-6">
      
      {/* INJEKTION FÜR DEN FILTER (Zwingt das PDF zum Dark-Design und steuert die Bilder) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* 1. Verhindert, dass der Browser die Seite weiß färbt */
          body, html, #root, .gigsda-page {
            background-color: #050814 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* 2. Blendet störende UI-Elemente wie Navigation und Footer im PDF aus */
          nav, footer, button, .no-print {
            display: none !important;
          }

          /* 3. Slider-Druck-Regel: Versteckt die Slider-Logik und zeigt nur das erste Bild groß an */
          .profile-slider-container {
            display: none !important;
          }
          .print-slider-fallback {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            border-radius: 12px !important;
            border: 1px solid #1e293b !important;
          }
        }
      `}} />

      {/* VERSTECKTE BOX FÜR DAS PDF (Wird nur beim Drucken sichtbar und zeigt das erste Slider-Bild flach an) */}
      {firstSliderImage && (
        <div className="hidden print-slider-fallback mb-6">
          <img 
            src={firstSliderImage} 
            alt="Portfolio Highlight" 
            className="w-full rounded-2xl border border-slate-800 object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* DIE HAUPT-CARD */}
      <div className="bg-[#0b111e] border border-slate-800/80 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Linke Seite: Infos und Reflink */}
        <div className="flex-1 space-y-3">
          <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">
            // Official Portfolio Card
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Gigsda Pass & Reflink-Zentrale
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            Nutze deine verifizierte Mitgliedskarte, um dich via QR-Code oder Direktlink bei Agenturen zu bewerben.
          </p>
          <div className="flex items-center gap-2 pt-1 text-yellow-400 hover:text-yellow-300 transition-colors">
            <button
              className="
                text-yellow-400
                hover:text-yellow-300
                transition-colors
                font-semibold
              "
              onClick={() => {
                navigator.clipboard.writeText(refLink);
                alert('✅ Referral-Link kopiert');
              }}
            >
              🔗 Reflink kopieren
            </button>
          </div>

          <div className="mt-6">
            <p className="text-cyan-400 text-xs font-black uppercase tracking-widest">
              // Referral Center
            </p>

            <p className="text-slate-400 text-xs mt-2">
              Geworbene Mitglieder: {referrals.length}
            </p>

            <div className="mt-3 space-y-2">
              {referrals.map(member => {

                const data = member.profile_json
                  ? JSON.parse(member.profile_json)
                  : member;

                return (
                  <div
                    key={data.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"
                  >
                    ✅ {data.name}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Rechte Seite: Der physische Gigsda Pass */}
        <div className="w-full md:w-auto flex-shrink-0">
          <div className="w-[280px] h-[140px] bg-gradient-to-br from-[#131b2e] via-[#0f1626] to-[#250d3a] border border-slate-800 rounded-2xl p-4 flex justify-between relative shadow-inner overflow-hidden">
            
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col justify-between h-full z-10">
              <div>
                <div className="text-[8px] text-cyan-400 font-bold uppercase tracking-widest font-mono">// Gigsda Pass</div>
                <div className="text-sm font-bold text-white tracking-wide mt-1">{currentProfileName || 'Artist'}</div>
              </div>
              <div className="text-[9px] text-slate-500 font-mono font-semibold tracking-wider">
                ID: #{profileId || 'GIGS-0000'}
              </div>
            </div>

            <div className="flex items-center justify-center z-10">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-700/50">
                <div className="w-10 h-10 flex flex-wrap gap-[2px] p-[2px] bg-white">
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                  <div className="w-[11px] h-[11px] bg-white"></div>
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                  <div className="w-[11px] h-[11px] bg-white"></div>
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                  <div className="w-[11px] h-[11px] bg-white"></div>
                  <div className="w-[11px] h-[11px] bg-black rounded-[2px]"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* DIE AKTIONS-BUTTONS UNTERHALB (Erhalten im PDF automatisch .no-print und verschwinden) */}
      <div className="flex flex-col sm:flex-row gap-4 items-center no-print">
        
        <button
          onClick={handlePrintPdf}
          className="w-full sm:flex-1 h-12 bg-gradient-to-r from-cyan-500 
          via-indigo-500 to-purple-600 hover:opacity-90 text-slate-900 
          font-black text-xs uppercase tracking-widest rounded-xl flex items-center 
          justify-center gap-2 transition-all shadow-lg active:scale-[0.99]
          "
        >
          Profil druck (PDF)
        </button>

        <button
          onClick={handlePrintPdf}
          className="
          w-full sm:flex-1 h-12 bg-gradient-to-r from-cyan-500 
          via-indigo-500 to-purple-600 hover:opacity-90 text-slate-900 
          font-black text-xs uppercase tracking-widest rounded-xl flex items-center 
          justify-center gap-2 transition-all shadow-lg active:scale-[0.99]
          "
        >
          Portfolio druck (PDF)
        </button>

        <button
          onClick={() => {
            localStorage.setItem(
              'gigsda_portfolio_profile',
              profileId
            );
            localStorage.setItem(
              'gigsda_current_view',
              'artistPortfolio'
            );
            window.location.reload();
          }}
          className="
          no-print w-full sm:flex-1 h-12 bg-gradient-to-r from-cyan-500 
          via-indigo-500 to-purple-600 hover:opacity-90 text-slate-900 
          font-black text-xs uppercase tracking-widest rounded-xl flex items-center 
          justify-center gap-2 transition-all shadow-lg active:scale-[0.99]
          "
        >
          Portfolio öffnen
        </button>

        <button
          onClick={() => {
            setView('gigsdaPass');
          }}
          className="
          no-print w-full sm:flex-1 h-12 bg-gradient-to-r from-cyan-500 
          via-indigo-500 to-purple-600 hover:opacity-90 text-slate-900 
          font-black text-xs uppercase tracking-widest rounded-xl flex items-center 
          justify-center gap-2 transition-all shadow-lg active:scale-[0.99]
          "
        >
          Gigsda Pass öffnen
        </button>

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
      </div>
    </div>
  );
}
