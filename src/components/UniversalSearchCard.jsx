import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ShieldCheck, MapPin, DollarSign, Layers, Volume2 } from 'lucide-react';

export default function UniversalSearchCard({ profile, currentSector, viewMode, setView, onNavigate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayPause = (e, url) => {
    e.stopPropagation();
    if (!url) return;

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current && audioRef.current.currentTime >= 30) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        };
        audioRef.current.onended = () => setIsPlaying(false);
      }).catch(err => console.error(err));
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Verbindet sich direkt mit der übergebenen Zuweisung in App.jsx Zeile 455
  const handleCardClick = () => {
    const targetName = profile.name || profile.display_name || profile.user_name || '';
    if (typeof onNavigate === 'function') {
      onNavigate(targetName);
    }
  };

  const hasEvents = profile.gigsda_events && profile.gigsda_events.length >= 2;
  const isVerified = profile.gigsda_verified === true || hasEvents;
  const isCompact = viewMode === 'compact';

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-[#0b111e] rounded-xl border border-slate-800/40 hover:border-cyan-500/30 transition-all px-2.5 flex items-center justify-between gap-3 cursor-pointer group ${
        isCompact ? 'h-[50px]' : 'h-[80px]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className={`bg-[#070b12] rounded border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center transition-all ${
          isCompact ? 'w-8 h-8' : 'w-14 h-14 rounded-lg'
        }`}>
          {profile.avatarUrl || profile.room1_img ? (
            <img src={profile.avatarUrl || profile.room1_img} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-600 text-xs">{currentSector === 'artists' ? '🎤' : '🏢'}</span>
          )}
        </div>

        <div className="min-w-0 leading-tight">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className={`font-bold text-white uppercase tracking-wide truncate ${isCompact ? 'text-[11px]' : 'text-[13px]'}`}>
              {profile.display_name || profile.name}
            </h3>
            {isVerified && <ShieldCheck size={isCompact ? 10 : 12} className="text-cyan-400 shrink-0" />}
          </div>
          
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 text-cyan-500/60 truncate">
            {profile.role ? `Gigsda ${profile.role}` : (profile.genre || 'Gigsda Member')}
          </p>
          
          {!isCompact && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 truncate">
              {currentSector === 'artists' && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  <span className="flex items-center gap-0.5 text-emerald-400/80">
                    <DollarSign size={10} /> 
                    {profile.gage_min ? `${profile.gage_min} € - ${profile.gage_max || 'open'} €` : 'Auf Anfrage'}
                  </span>
                  {profile.duration_max && (
                    <span className="text-[9px] text-slate-500 font-mono">
                      ⏱️ Max. {profile.duration_max} Min. Show
                    </span>
                  )}
                </div>
              )}

              {currentSector === 'locations' && (
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                  {/* Deine originale, richtige DB-Abfrage bleibt unverändert erhalten */}
                  <span className="flex items-center gap-1 text-purple-400/80">
                    <Layers size={10} /> Max. {profile.room1_steh || profile.capacity || '—'} Pax
                  </span>
                  
                  {/* NEU: B2B Strom-Anzeige */}
                  {profile.room1_power_supply && (
                    <span className="flex items-center gap-1 text-amber-400/90 font-mono bg-amber-950/20 px-1 rounded border border-amber-900/30">
                      ⚡ {profile.room1_power_supply.toUpperCase()}
                    </span>
                  )}

                  {/* NEU: B2B Sperrstunden-Anzeige */}
                  {profile.room1_curfew_time && (
                    <span className="flex items-center gap-1 text-cyan-400/90 font-mono bg-cyan-950/20 px-1 rounded border border-cyan-900/30">
                      ⏱️ {profile.room1_curfew_time} Uhr
                    </span>
                  )}
                </div>
              )}

            {/* Logistik- & Entfernungs-Anzeige für den Booker */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 rounded px-1.5 py-0.5 font-mono">
                📍 {profile.city || 'Umland'}
              </span>
              
              {profile.calculated_distance !== undefined && (
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                  profile.calculated_distance <= 50 
                    ? 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50' // Nahbereich / Keine Fahrtkosten
                    : profile.calculated_distance <= 150 
                      ? 'text-amber-400 bg-amber-950/30 border-amber-900/50' // Mittlerer Umkreis
                      : 'text-rose-400 bg-rose-950/30 border-rose-900/50' // Fernbereich / Hotel benötigt
                }`}>
                  {profile.calculated_distance === 0 ? 'Lokal (0 km)' : `+ ${profile.calculated_distance} km`}
                </span>
              )}
            </div>

            </div>
          )}
        </div>
      </div>

      {currentSector === 'artists' && profile.audio1_url && (
        <div className="flex items-center gap-2 shrink-0">
          {isPlaying && <span className="text-cyan-400 text-[8px] font-mono animate-pulse hidden sm:inline">LIVE</span>}
          <button 
            onClick={(e) => handlePlayPause(e, profile.audio1_url)} 
            className={`rounded-full border flex items-center justify-center shrink-0 transition-all ${
              isCompact ? 'w-5 h-5' : 'w-6 h-6'
            } ${
              isPlaying ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-cyan-500/50 hover:border-cyan-500'
            }`}
          >
            {isPlaying ? <Pause size={isCompact ? 6 : 8} fill="currentColor" /> : <Play size={isCompact ? 6 : 8} className="ml-0.5" fill="currentColor" />}
          </button>
        </div>
      )}
    </div>
  );
}