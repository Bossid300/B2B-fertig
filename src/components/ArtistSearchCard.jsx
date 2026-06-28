import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ShieldCheck, MapPin, DollarSign, Music } from 'lucide-react';

export default function ArtistSearchCard({ artist }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Extrahiert den reinen Songnamen aus der URL
  const getCleanTrackName = (url) => {
    if (!url) return 'Demo-Track';
    try {
      const decoded = decodeURIComponent(url);
      const filename = decoded.substring(decoded.lastIndexOf('/') + 1);
      return (filename.substring(0, filename.lastIndexOf('.')) || filename).replace(/[-_]/g, ' ');
    } catch (e) {
      return 'Audio-Showcase';
    }
  };

  // Steuert den integrierten Mini-Audio-Player (30s Limit)
  const togglePlay = (e) => {
    e.preventDefault(); // Verhindert das Aufrufen des Profil-Links beim Klick auf Play
    
    if (!audioRef.current && artist.audio1_url) {
      audioRef.current = new Audio(artist.audio1_url);
      
      // B2B 30-Sekunden Limit-Überwachung im Suchergebnis
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current && audioRef.current.currentTime >= 30) {
          audioRef.current.pause();
          setIsPlaying(false);
          audioRef.current.currentTime = 0;
        }
      });
      
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Audio-Fehler:", err));
    }
  };

  // Komponente wird verlassen -> Sound killen
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const hasAudio = !!artist.audio1_url;
  const isVerified = artist.gigsda_verified === true || (artist.gigsda_events && artist.gigsda_events.length >= 2);

  return (
    <div className="bg-[#0b111e] rounded-xl border border-slate-800/50 hover:border-cyan-500/30 transition-all duration-200 shadow-lg p-3 flex items-center justify-between gap-4 group">
      
      {/* LINKER BLOCK: AVATAR & AKTUELLE BIOGRAFIEMERKMALE */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        
        {/* Quadratischer Avatar (w-14 h-14) im bündigen Look */}
        <div className="w-14 h-14 bg-[#070b12] rounded-lg border border-slate-800/80 overflow-hidden shrink-0 relative">
          {artist.avatarUrl ? (
            <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700 text-lg">👤</div>
          )}
        </div>

        {/* Core-Daten des Künstlers */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase truncate max-w-[140px] sm:max-w-none">
              {artist.display_name || artist.name || 'Unbekannter Act'}
            </h3>
            {isVerified && (
              <ShieldCheck size={12} className="text-cyan-400 shrink-0" title="Verifizierter Gigsda-Act" />
            )}
          </div>

          {/* Micro-Datenzeile: Genre & Besetzung */}
          <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
            <span className="text-cyan-500/80">{artist.genre || 'Open Genre'}</span>
            <span className="text-slate-700">•</span>
            <span>{artist.act_type || 'Band'}</span>
          </div>

          {/* Standort & Gage */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-0.5"><MapPin size={10} className="text-purple-500/70" /> {artist.city || 'National'}</span>
            <span className="flex items-center gap-0.5"><DollarSign size={10} className="text-emerald-500/70" /> {artist.gage_standard ? `${artist.gage_standard} €` : 'Auf Anfrage'}</span>
          </div>
        </div>
      </div>

      {/* RECHTER BLOCK: BÜNDIGER MINI-PLAYER (AUSRICHTUNG NACH RECHTS) */}
      <div className="shrink-0 flex items-center gap-3 pl-2 border-l border-slate-800/30">
        {hasAudio ? (
          <div className="flex flex-col items-end gap-1 text-right max-w-[120px] sm:max-w-[180px] hidden sm:flex">
            <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-widest flex items-center gap-0.5"><Music size={8} /> Showcase</span>
            <span className="text-[10px] text-slate-400 font-medium truncate w-full">{getCleanTrackName(artist.audio1_url)}</span>
          </div>
        ) : null}

        {/* Circular Play Button */}
        <button
          disabled={!hasAudio}
          onClick={togglePlay}
          className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
            !hasAudio
              ? 'opacity-10 border-slate-800 text-slate-700 cursor-not-allowed'
              : isPlaying
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                : 'bg-slate-950 border-slate-800 text-cyan-500/50 hover:border-cyan-500/80 hover:bg-slate-900'
          }`}
          title={hasAudio ? "Showcase-Snippet abspielen" : "Kein Audio-File hinterlegt"}
        >
          {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-0.5" fill="currentColor" />}
        </button>
      </div>

    </div>
  );
}
