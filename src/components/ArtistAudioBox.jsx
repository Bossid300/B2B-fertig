import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Edit3, Check, Plus, Trash2, 
  Disc, Music, Clock, Volume2 
} from 'lucide-react';

export default function ArtistAudioBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [albums, setAlbums] = useState([]);
  
  // Audio-Engine Status
  const [playingTrack, setPlayingTrack] = useState({ albumIdx: null, trackIdx: null });
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef(new Audio());
  const timerRef = useRef(null);
  const fadeRef = useRef(null);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // Hilfsfunktion: Extrahiert einen lesbaren Songtitel aus einer URL
  const getTrackNameFromUrl = (url, fallback) => {
    if (!url) return '';
    try {
      const decodedUrl = decodeURIComponent(url);
      const filename = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
      const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
      // Bereinigt typische Trennzeichen für eine schönere B2B-Anzeige
      return nameWithoutExt.replace(/[-_]/g, ' ');
    } catch (e) {
      return fallback;
    }
  };

  // 1. DATEN-PIPELINE: Lädt deine bestehende DevTools-Struktur
  useEffect(() => {
    if (!targetUser) return;
    
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (storedProfiles) {
      const profiles = JSON.parse(storedProfiles);
      const currentProfile = profiles.find(p => 
        p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
      );

      if (currentProfile) {
        setProfileId(currentProfile.id);
        
        const loadedAlbums = [];
        let index = 1;
        
        // Schleife läuft durch deine Alben
        while (
          index === 1 || // Album 1 laden wir immer (da es auf audio1_url etc. mappt)
          currentProfile[`album${index}_title`] !== undefined || 
          currentProfile[`album${index}_cover`] !== undefined
        ) {
          
          let t1_url = '', t2_url = '', t3_url = '', t4_url = '';
          let t1_name = '', t2_name = '', t3_name = '', t4_name = '';

          if (index === 1) {
            // EXAKTES MAPPING AUF DEINE LIVE-KEYS AUS DEN DEVTOOLS FÜR ALBUM 1
            t1_url = currentProfile[`audio1_url`] || '';
            t2_url = currentProfile[`audio2_url`] || '';
            t3_url = currentProfile[`audio3_url`] || '';
            t4_url = currentProfile[`audio4_url`] || '';
            
            t1_name = currentProfile[`audio1_name`] || getTrackNameFromUrl(t1_url, 'Hörbeispiel 1');
            t2_name = currentProfile[`audio2_name`] || getTrackNameFromUrl(t2_url, 'Hörbeispiel 2');
            t3_name = currentProfile[`audio3_name`] || getTrackNameFromUrl(t3_url, 'Hörbeispiel 3');
            t4_name = currentProfile[`audio4_name`] || getTrackNameFromUrl(t4_url, 'Hörbeispiel 4');
          } else {
            // Erweiterte Keys für dynamisch hinzugefügte Zusatz-Alben (Album 2, 3...)
            t1_url = currentProfile[`album${index}_track1_url`] || '';
            t2_url = currentProfile[`album${index}_track2_url`] || '';
            t3_url = currentProfile[`album${index}_track3_url`] || '';
            t4_url = currentProfile[`album${index}_track4_url`] || '';

            t1_name = currentProfile[`album${index}_track1_name`] || getTrackNameFromUrl(t1_url, `Track 1`);
            t2_name = currentProfile[`album${index}_track2_name`] || getTrackNameFromUrl(t2_url, `Track 2`);
            t3_name = currentProfile[`album${index}_track3_name`] || getTrackNameFromUrl(t3_url, `Track 3`);
            t4_name = currentProfile[`album${index}_track4_name`] || getTrackNameFromUrl(t4_url, `Track 4`);
          }

          loadedAlbums.push({
            index: index,
            title: currentProfile[`album${index}_title`] || (index === 1 ? "Haupt Releases / Demos" : `Zusatz Album ${index}`),
            cover: currentProfile[`album${index}_cover`] || currentProfile[`avatarUrl`] || '', // Fallback auf avatarUrl aus deinen Daten
            limit: parseInt(currentProfile[`album${index}_limit`]) || 30,
            tracks: [
              { name: t1_name, url: t1_url },
              { name: t2_name, url: t2_url },
              { name: t3_name, url: t3_url },
              { name: t4_name, url: t4_url }
            ]
          });
          
          index++;
          // Sicherheitsbremse für Endlosschleifen im LocalStorage
          if (index > 20) break;
        }
        setAlbums(loadedAlbums);
      }
    }
  }, [targetUser, isEditing]);

  // 2. PLAYER LOGIK (30s / 45s Countdown & Fade-out)
  const handlePlayPause = (albumIdx, trackIdx, url) => {
    if (!url) return;

    if (playingTrack.albumIdx === albumIdx && playingTrack.trackIdx === trackIdx) {
      stopAudio();
      return;
    }

    stopAudio();

    const targetAlbum = albums.find(a => a.index === albumIdx);
    const timeLimit = targetAlbum ? targetAlbum.limit : 30;

    audioRef.current.src = url;
    audioRef.current.volume = 1.0;
    
    audioRef.current.play().then(() => {
      setPlayingTrack({ albumIdx, trackIdx });
      
      timerRef.current = setInterval(() => {
        const curTime = audioRef.current.currentTime;
        setCurrentTime(curTime);

        // Sanftes Ausblenden startet 2 Sekunden vor Schluss
        if (curTime >= timeLimit - 2 && !fadeRef.current) {
          startFadeOut(timeLimit);
        }

        // Stoppen beim Erreichen des Limits
        if (curTime >= timeLimit) {
          stopAudio();
        }
      }, 100);
    }).catch(err => console.error("Audio-Playback abgebrochen:", err));
  };

  const startFadeOut = (limit) => {
    fadeRef.current = setInterval(() => {
      if (audioRef.current) {
        let newVol = audioRef.current.volume - 0.15;
        if (newVol <= 0) {
          newVol = 0;
          stopAudio();
        } else {
          audioRef.current.volume = newVol;
        }
      }
    }, 200);
  };

  const stopAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (fadeRef.current) clearInterval(fadeRef.current);
    timerRef.current = null;
    fadeRef.current = null;
    
    audioRef.current.pause();
    setPlayingTrack({ albumIdx: null, trackIdx: null });
    setCurrentTime(0);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // 3. STATE HANDLER
  const handleAlbumChange = (index, field, value) => {
    setAlbums(prev => prev.map(al => al.index === index ? { ...al, [field]: value } : al));
  };

  const handleTrackChange = (albumIndex, trackIndex, field, value) => {
    setAlbums(prev => prev.map(al => {
      if (al.index === albumIndex) {
        const newTracks = [...al.tracks];
        newTracks[trackIndex] = { ...newTracks[trackIndex], [field]: value };
        return { ...al, tracks: newTracks };
      }
      return al;
    }));
  };

  const handleAddAlbum = () => {
    const nextIndex = albums.length > 0 ? Math.max(...albums.map(a => a.index)) + 1 : 1;
    setAlbums([...albums, {
      index: nextIndex,
      title: `Zusatz Release ${nextIndex}`,
      cover: '',
      limit: 30,
      tracks: [{ name: '', url: '' }, { name: '', url: '' }, { name: '', url: '' }, { name: '', url: '' }]
    }]);
  };

  const handleRemoveAlbum = (indexToRemove) => {
    if (window.confirm("Möchtest du dieses Album und alle Verlinkungen löschen?")) {
      stopAudio();
      setAlbums(albums.filter(al => al.index !== indexToRemove));
    }
  };

  // 4. SPEICHERN: Synchronisiert sauber flach zurück in gigsda_profiles
  const handleSave = () => {
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (!storedProfiles || !profileId) return;

    let profiles = JSON.parse(storedProfiles);
    const profileIndex = profiles.findIndex(p => p.id === profileId);

    if (profileIndex !== -1) {
      // Alte Album-Metadaten säubern
      Object.keys(profiles[profileIndex]).forEach(key => {
        if (key.startsWith('album') && (key.includes('_title') || key.includes('_cover') || key.includes('_limit') || key.includes('_track'))) {
          delete profiles[profileIndex][key];
        }
      });

      // Synchronisiert die Alben-Schleife zurück in deine flachen Keys
      albums.forEach((album) => {
        const i = album.index;
        
        profiles[profileIndex][`album${i}_title`] = album.title;
        profiles[profileIndex][`album${i}_cover`] = album.cover;
        profiles[profileIndex][`album${i}_limit`] = album.limit;
        
        if (i === 1) {
          // ZURÜCKSCHREIBEN AUF DEINE LIVE AUDIO-KEYS FÜR ALBUM 1
          profiles[profileIndex][`audio1_url`] = album.tracks[0].url;
          profiles[profileIndex][`audio2_url`] = album.tracks[1].url;
          profiles[profileIndex][`audio3_url`] = album.tracks[2].url;
          profiles[profileIndex][`audio4_url`] = album.tracks[3].url;
          
          profiles[profileIndex][`audio1_name`] = album.tracks[0].name;
          profiles[profileIndex][`audio2_name`] = album.tracks[1].name;
          profiles[profileIndex][`audio3_name`] = album.tracks[2].name;
          profiles[profileIndex][`audio4_name`] = album.tracks[3].name;
        } else {
          // Keys für alle weiteren Alben
          profiles[profileIndex][`album${i}_track1_name`] = album.tracks[0].name;
          profiles[profileIndex][`album${i}_track1_url`] = album.tracks[0].url;
          profiles[profileIndex][`album${i}_track2_name`] = album.tracks[1].name;
          profiles[profileIndex][`album${i}_track2_url`] = album.tracks[1].url;
          profiles[profileIndex][`album${i}_track3_name`] = album.tracks[2].name;
          profiles[profileIndex][`album${i}_track3_url`] = album.tracks[2].url;
          profiles[profileIndex][`album${i}_track4_name`] = album.tracks[3].name;
          profiles[profileIndex][`album${i}_track4_url`] = album.tracks[3].url;
        }
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(profiles));
      setIsEditing(false);
    }
  };

  return (
    // Gesamte Box radikal komprimiert: p-4 statt p-6, mb-4 statt mb-8, flacheres Design
    <div className="bg-[#0b111e] rounded-xl border border-slate-800/60 shadow-xl p-4 mb-4 text-slate-200 font-sans">
      
      {/* Box Header-Zeile: py-2 statt pb-5 für extreme Höhenreduktion */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/40 pb-2 mb-4">
        <div>
          {/* Texte um 50% verkleinert: text-[9px] statt text-xs, weniger Zeilenabstand */}
          <span className="text-[8px] font-bold tracking-widest text-cyan-500 uppercase opacity-60">// DISCOGRAPHY & AUDIO SHOWCASE</span>
          <h2 className="text-xs font-bold text-white tracking-wider mt-0.5 uppercase">RELEASES & SHOWCASE HÖRBEISPIELE</h2>
        </div>

        {canEdit && (
          // Kompakterer Bearbeiten-Button: px-3 py-1 statt px-4 py-2, kleinere Schrift
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
              isEditing 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/30'
            }`}
          >
            {isEditing ? <Check size={11} /> : <Edit3 size={11} />}
            {isEditing ? 'Speichern' : 'Bearbeiten'}
          </button>
        )}
      </div>

      {/* Alben-Schleife: Abstand verringert (space-y-4 statt space-y-10) */}
      <div className="space-y-4 divide-y divide-slate-800/30">
        {albums.map((album) => (
          // items-center zwingt das kleinere Cover und die Zeilen auf eine gemeinsame, flache Achse
          <div key={album.index} className="pt-4 first:pt-0 flex flex-col md:flex-row gap-5 relative items-center">
            
            {isEditing && album.index > 1 && (
              <button 
                onClick={() => handleRemoveAlbum(album.index)}
                className="absolute top-0 right-0 p-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors z-10"
              >
                <Trash2 size={12} />
              </button>
            )}

            {/* LINKE SPALTE: COMPACT COVER & MINI-TEXTE */}
            {/* Das Cover schrumpft von w-48 auf w-36 zusammen, um die Box um 1/3 zu kürzen */}
            <div className="w-full md:w-36 shrink-0 flex flex-col gap-1.5">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40">
                <Disc size={9} className="text-cyan-500" /> RELEASE COVER
              </span>
              
              {/* Ultra-kompakter quadratischer Rahmen (w-36 h-36) */}
              <div className="w-36 h-36 bg-[#070b12] rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden shadow-inner relative mx-auto md:mx-0">
                {album.cover ? (
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="block text-2xl mb-0.5">💿</span>
                    <span className="text-[10px] text-slate-600">Kein Cover</span>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-1 w-36 mx-auto md:mx-0">
                  <input 
                    type="text"
                    value={album.title}
                    placeholder="Titel"
                    onChange={(e) => handleAlbumChange(album.index, 'title', e.target.value)}
                    className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-cyan-500 w-full"
                  />
                  <input 
                    type="text"
                    value={album.cover}
                    placeholder="Cover URL"
                    onChange={(e) => handleAlbumChange(album.index, 'cover', e.target.value)}
                    className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 text-[9px] text-slate-400 focus:outline-none focus:border-cyan-500 w-full"
                  />
                  
                  <div className="flex items-center justify-between bg-slate-950 p-1 rounded border border-slate-800 text-[9px]">
                    <span className="text-slate-500 flex items-center gap-0.5"><Clock size={9} /> Limit:</span>
                    <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
                      <button onClick={() => handleAlbumChange(album.index, 'limit', 30)} className={`px-1 rounded-[3px] text-[8px] font-bold transition-all ${album.limit === 30 ? 'bg-cyan-500 text-slate-950' : 'text-slate-500'}`}>30s</button>
                      <button onClick={() => handleAlbumChange(album.index, 'limit', 45)} className={`px-1 rounded-[3px] text-[8px] font-bold transition-all ${album.limit === 45 ? 'bg-cyan-500 text-slate-950' : 'text-slate-500'}`}>45s</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center md:text-left w-36 mx-auto md:mx-0">
                  {/* Albumtitel stark verkleinert (text-[11px]) passend zur Skills-Matrix */}
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider truncate mt-0.5">{album.title}</h3>
                  <span className="inline-flex items-center gap-0.5 text-[8px] bg-cyan-500/10 text-cyan-400 font-bold px-1.5 py-0.5 rounded mt-0.5 uppercase tracking-wide">
                    <Clock size={8} /> SNIPPET: {album.limit}s
                  </span>
                </div>
              )}
            </div>

            {/* RECHTE SPALTE: DIE HÖRBEISPIELE */}
            <div className="flex-1 w-full flex flex-col justify-center gap-1 self-center">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40 mb-0.5">
                <Music size={8} className="text-amber-500/50" /> AUDIO-SHOWCASE TRACKS (MAX. 4)
              </span>

              <div className="space-y-0.5 w-full">
                {album.tracks.map((track, trackIdx) => {
                  const isCurrent = playingTrack.albumIdx === album.index && playingTrack.trackIdx === trackIdx;
                  const progressPct = isCurrent ? (currentTime / album.limit) * 100 : 0;
                  
                  return (
                    <div 
                      key={trackIdx} 
                      className={`rounded-lg p-1 px-2.5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isCurrent 
                          ? 'bg-cyan-500/5 border-cyan-500/20 shadow-inner' 
                          : 'bg-[#070b12]/20 border-slate-800/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isEditing ? (
                          <span className="text-[9px] text-slate-600 font-bold w-3">{trackIdx + 1}.</span>
                        ) : (
                          // Extrem flacher, dezenter Play-Button (w-5.5 h-5.5)
                          <button
                            disabled={!track.url}
                            onClick={() => handlePlayPause(album.index, trackIdx, track.url)}
                            className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                              !track.url 
                                ? 'opacity-10 border-slate-800 text-slate-700 cursor-not-allowed' 
                                : isCurrent
                                  ? 'bg-cyan-500/20 border-cyan-400/20 text-cyan-400'
                                  : 'bg-slate-950 border-slate-800/60 text-cyan-500/50 hover:border-cyan-500 hover:bg-slate-900'
                            }`}
                          >
                            {isCurrent ? <Pause size={8} fill="currentColor" /> : <Play size={8} className="ml-0.5" fill="currentColor" />}
                          </button>
                        )}

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              <input 
                                type="text"
                                value={track.name}
                                placeholder="Musik- / Tracktitel"
                                onChange={(e) => handleTrackChange(album.index, trackIdx, 'name', e.target.value)}
                                className="bg-[#0c1220] border border-slate-800 rounded-md px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-cyan-500 w-full"
                              />
                              <input 
                                type="text"
                                value={track.url}
                                placeholder="Audio-Link (.mp3)"
                                onChange={(e) => handleTrackChange(album.index, trackIdx, 'url', e.target.value)}
                                className="bg-[#0c1220] border border-slate-800 rounded-md px-2 py-0.5 text-[10px] text-slate-400 focus:outline-none focus:border-cyan-500 w-full"
                              />
                            </div>
                          ) : (
                            <div className="relative py-0">
                              {/* Feinere Schriftgröße (text-[11px]) passend zur Skills Matrix */}
                              <h4 className={`text-[11px] font-medium tracking-wide truncate ${isCurrent ? 'text-cyan-400' : 'text-slate-300'}`}>
                                {track.name || `Hörbeispiel ${trackIdx + 1}`}
                              </h4>
                              
                              {/* Hauchdünner Fortschrittsbalken */}
                              {isCurrent && (
                                <div className="w-full bg-slate-950 h-[1px] rounded-full mt-1 overflow-hidden border border-slate-900">
                                  <div 
                                    className="bg-cyan-400 h-full shadow-[0_0_3px_#06b6d4]"
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="flex items-center justify-end gap-2 shrink-0 select-none">
                          {track.url ? (
                            isCurrent ? (
                              <span className="text-cyan-400 font-mono text-[8px] flex items-center gap-0.5 animate-pulse tracking-wider">
                                <Volume2 size={8} /> {Math.floor(currentTime)}s
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono text-[8px] uppercase tracking-widest font-semibold opacity-40">
                                READY ({album.limit}s)
                              </span>
                            )
                          ) : (
                            <span className="text-slate-700 italic text-[8px] tracking-wide opacity-50">Kein Audio</span>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Album hinzufügen Button */}
      {isEditing && (
        <div className="mt-4 pt-2.5 border-t border-slate-800/40 flex justify-center">
          <button
            onClick={handleAddAlbum}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 shadow-inner"
          >
            <Plus size={11} />
            Album hinzufügen
          </button>
        </div>
      )}

    </div>
  );
}
