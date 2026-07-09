import React, { useState, useEffect } from 'react';
import { 
  Edit3, Check, FileText, Image as ImageIcon, 
  Plus, Trash2, Sliders, Radio, Activity, LayoutList 
} from 'lucide-react';

export default function ArtistTechRiderBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [channels, setChannels] = useState([]);
  
  // Technische Rider-Links & Monitore initialisieren
  const [techData, setTechData] = useState({
    rider_pdf_url: '',
    rider_stageplot_url: '',
    rider_monitors: '',
    rider_backline: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  const isImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) != null || url.startsWith('data:image/');
  };

  // 1. DATEN-PIPELINE: Lädt flache Keys inklusive deinem korrekten stageplot_url
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
        
        // stageplot_url greift jetzt exakt auf deinen Live-Key zu
        setTechData({
          rider_pdf_url: currentProfile.rider_pdf_url || '',
          rider_stageplot_url: currentProfile.stageplot_url || '', // KORRIGIERT
          rider_monitors: currentProfile.rider_monitors || '',
          rider_backline: currentProfile.rider_backline || ''
        });

        // Kanalliste laden
        const loadedChannels = [];
        let index = 1;
        while (currentProfile[`ch${index}_signal`] !== undefined || currentProfile[`ch${index}_mic`] !== undefined || index <= 4) {
          loadedChannels.push({
            index: index,
            signal: currentProfile[`ch${index}_signal`] || '',
            mic: currentProfile[`ch${index}_mic`] || '',
            stand: currentProfile[`ch${index}_stand`] || ''
          });
          index++;
          if (index > 64) break;
        }
        setChannels(loadedChannels);
      }
    }
  }, [targetUser, isEditing]);

  // Handler für allgemeine Felder
  const handleTechChange = (field, value) => {
    setTechData(prev => ({ ...prev, [field]: value }));
  };

  // Handler für dynamische Kanalliste
  const handleChannelChange = (index, field, value) => {
    setChannels(prev => prev.map(ch => 
      ch.index === index ? { ...ch, [field]: value } : ch
    ));
  };

  // Neuen Kanal (chX) via Plus-Button hinzufügen
  const handleAddChannel = () => {
    const nextIndex = channels.length > 0 ? Math.max(...channels.map(c => c.index)) + 1 : 1;
    setChannels([...channels, {
      index: nextIndex,
      signal: '',
      mic: '',
      stand: ''
    }]);
  };

  // Kanal entfernen
  const handleRemoveChannel = (indexToRemove) => {
    setChannels(channels.filter(ch => ch.index !== indexToRemove));
  };

  // 2. SPEICHERN: Schreibt die Werte exakt flach (ch1_signal, etc.) zurück
  const handleSave = () => {
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (!storedProfiles || !profileId) return;

    let profiles = JSON.parse(storedProfiles);
    const profileIndex = profiles.findIndex(p => p.id === profileId);

    if (profileIndex !== -1) {
      // Allgemeine Felder speichern
      profiles[profileIndex].rider_pdf_url = techData.rider_pdf_url;
      profiles[profileIndex].rider_stageplot_url = techData.rider_stageplot_url;
      profiles[profileIndex].rider_monitors = techData.rider_monitors;
      profiles[profileIndex].rider_backline = techData.rider_backline;

      // Alte chX_ Keys im Profil bereinigen, um Datenmüll zu verhindern
      Object.keys(profiles[profileIndex]).forEach(key => {
        if (key.startsWith('ch') && (key.includes('_signal') || key.includes('_mic') || key.includes('_stand'))) {
          delete profiles[profileIndex][key];
        }
      });

      // Kanalliste flach in die erste Ebene zurückschreiben (ch1_signal, ch1_mic, etc.)
      channels.forEach((ch, idx) => {
        const i = idx + 1; // Werden fortlaufend neu durchnummeriert ch1, ch2, ch3...
        profiles[profileIndex][`ch${i}_signal`] = ch.signal;
        profiles[profileIndex][`ch${i}_mic`] = ch.mic;
        profiles[profileIndex][`ch${i}_stand`] = ch.stand;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(profiles));

      try {
        const events = JSON.parse(
          localStorage.getItem("gigsda_events") || "[]"
        );

        const updatedEvents = events.map((event) => {

          if (!event.riderCenter?.[profileId]) {
            return event;
          }
            return {
              ...event,

              riderCenter: {
                ...event.riderCenter,

                [profileId]: {
                  ...event.riderCenter[profileId],

                  confirmed: false,
                  changed: true,
                  changedAt: Date.now()
                }
              }
            };
        });

        localStorage.setItem(
          "gigsda_events",
          JSON.stringify(updatedEvents)
        );

        window.dispatchEvent(
          new CustomEvent("rider-updated")
        );

      } catch (err) {
        console.error(err);
      }

      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#0b111e] rounded-xl border border-slate-800/50 shadow-xl p-3 mb-3 text-slate-200 font-sans">
      
      {/* Box Header-Zeile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/40 pb-1.5 mb-3">
        <div>
          <span className="text-[8px] font-bold tracking-widest text-cyan-500 uppercase opacity-50">// STAGEPLOT & TECHNICAL RIDER</span>
          <h2 className="text-[10px] font-bold text-white tracking-wider uppercase mt-0.5">BÜHNENANWEISUNGEN & PATCH-LISTE</h2>
        </div>

        {canEdit && (
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
              isEditing ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
            }`}
          >
            {isEditing ? <Check size={10} /> : <Edit3 size={10} />}
            {isEditing ? 'Speichern' : 'Bearbeiten'}
          </button>
        )}
      </div>

      {/* 1. OBERE ZEILE: RIDER PDF & MONITORING NEBENEINANDER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start mb-4">
        
        {/* Rider PDF (Nimmt 2 Spalten ein) */}
        <div className="space-y-1 md:col-span-2 w-full">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40">
            <Sliders size={9} className="text-cyan-500" /> TECHNICAL RIDER PDF
          </span>
          <div className="bg-[#070b12]/40 border border-slate-800/20 rounded-lg p-1.5 flex items-center justify-between gap-3 h-10">
            <div className="flex items-center gap-2 min-w-0">
              <FileText size={14} className="text-cyan-500/80 shrink-0" />
              <div className="truncate">
                <h4 className="text-[11px] font-medium text-slate-300 leading-tight">Technical Rider (PDF)</h4>
                <p className="text-[8px] text-slate-500 truncate max-w-[200px]">{techData.rider_pdf_url || 'Kein PDF geladen'}</p>
              </div>
            </div>
            {techData.rider_pdf_url && !isEditing && (
              <a href={techData.rider_pdf_url} target="_blank" rel="noopener noreferrer" className="px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-[8px] uppercase tracking-widest font-semibold rounded">OPEN</a>
            )}
          </div>
          {isEditing && (
            <input type="text" placeholder="Rider PDF-URL einfügen" value={techData.rider_pdf_url} onChange={(e) => handleTechChange('rider_pdf_url', e.target.value)} className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 text-[9px] text-slate-400 focus:outline-none w-full mt-1" />
          )}
        </div>

        {/* Monitoring Bedarf (1 Spalte) */}
        <div className="space-y-1 md:col-span-1 w-full">
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40">
            <Radio size={9} className="text-purple-500" /> MONITORING BEDARF
          </span>
          <div className="bg-[#070b12]/40 border border-slate-800/20 rounded-lg p-1.5 flex items-center gap-2 h-10 text-[11px]">
            <span className="text-slate-500 text-[9px]">Anforderung:</span>
            {isEditing ? (
              <input type="text" value={techData.rider_monitors} placeholder="z.B. 4x IEM, 2x Wedges" onChange={(e) => handleTechChange('rider_monitors', e.target.value)} className="bg-[#0c1220] border border-slate-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none flex-1 h-5" />
            ) : (
              <span className="font-semibold text-slate-300">{techData.rider_monitors || 'Keine Angabe'}</span>
            )}
          </div>
        </div>

      </div>

      {/* 2. MITTLERE ZEILE: DER STAGEPLOT IM VOLLBILD / GROSSFORMAT (Volle Breite) */}
      <div className="space-y-1.5 mb-4">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40">
          <ImageIcon size={9} className="text-cyan-500" /> VISUELLER STAGEPLOT / BÜHNENPLAN
        </span>
        
        {/* h-auto und max-h-[500px] zwingen das Bild in die riesige Großansicht */}
        <div className="bg-[#070b12]/40 border border-slate-800/20 rounded-lg p-2 flex items-center justify-center overflow-hidden max-h-[500px] w-full relative">
          {techData.rider_stageplot_url ? (
            isImageUrl(techData.rider_stageplot_url) ? (
              <img src={techData.rider_stageplot_url} alt="Stageplot Vollbild" className="w-full h-auto max-h-[480px] object-contain bg-black/10 rounded shadow-md" />
            ) : (
              <div className="text-center p-4">
                <h4 className="text-[11px] font-medium text-slate-300">Bühnenaufbau Dokument geladen</h4>
                {!isEditing && <a href={techData.rider_stageplot_url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-cyan-400 underline mt-1 block font-mono">DOKUMENT ÖFFNEN</a>}
              </div>
            )
          ) : (
            <span className="text-[9px] text-slate-600 italic py-4">Kein Plan hinterlegt</span>
          )}
        </div>
        {isEditing && (
          <input type="text" placeholder="Stageplot Plan-URL" value={techData.rider_stageplot_url} onChange={(e) => handleTechChange('rider_stageplot_url', e.target.value)} className="bg-[#070b12] border border-slate-800 rounded-md px-2 py-0.5 text-[9px] text-slate-400 focus:outline-none w-full" />
        )}
      </div>

      {/* 3. UNTERE ZEILE: INPUT-PATCH-MATRIX (Volle Breite) */}
      <div className="space-y-1 w-full mb-4">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40 mb-0.5">
          <LayoutList size={9} className="text-cyan-500" /> INPUT-PATCH-MATRIX & KANALBELEGUNG
        </span>

        <div className="bg-[#070b12]/30 border border-slate-800/30 rounded-lg overflow-hidden flex flex-col justify-between min-h-[160px]">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800/60 text-[9px] text-slate-500 font-bold uppercase tracking-wider h-6">
                <th className="pl-3.5 w-10 text-center">Ch</th>
                <th className="pl-2">Audio-Signal / Quelle</th>
                <th className="pl-2">Mikrofon / DI-Typ</th>
                <th className="pl-2 pr-3">Stativ</th>
                {isEditing && <th className="w-8 pr-2"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20">
              {channels.map((ch, idx) => (
                <tr key={ch.index} className="h-7 hover:bg-slate-900/20 transition-colors">
                  <td className="text-center font-mono font-bold text-cyan-500/80 text-[10px] pl-1.5">{idx + 1}</td>
                  <td className="pl-2">
                    {isEditing ? (
                      <input type="text" value={ch.signal} placeholder="z.B. Kick Drum" onChange={(e) => handleChannelChange(ch.index, 'signal', e.target.value)} className="bg-[#0c1220] border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none w-full h-5" />
                    ) : (
                      <span className="text-slate-300 font-medium">{ch.signal || <span className="text-slate-700 italic font-normal">—</span>}</span>
                    )}
                  </td>
                  <td className="pl-2">
                    {isEditing ? (
                      <input type="text" value={ch.mic} placeholder="z.B. Shure Beta 52A" onChange={(e) => handleChannelChange(ch.index, 'mic', e.target.value)} className="bg-[#0c1220] border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none w-full h-5" />
                    ) : (
                      <span className="text-slate-400">{ch.mic || <span className="text-slate-800 italic">—</span>}</span>
                    )}
                  </td>
                  <td className="pl-2 pr-3">
                    {isEditing ? (
                      <input type="text" value={ch.stand} placeholder="z.B. Small / Floor" onChange={(e) => handleChannelChange(ch.index, 'stand', e.target.value)} className="bg-[#0c1220] border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none w-full h-5" />
                    ) : (
                      <span className="text-slate-500 text-[10px]">{ch.stand || <span className="text-slate-800 italic">—</span>}</span>
                    )}
                  </td>
                  {isEditing && (
                    <td className="pr-2 text-right">
                      <button onClick={() => handleRemoveChannel(ch.index)} className="p-0.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 border border-rose-500/20 transition-colors">
                        <Trash2 size={10} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {isEditing && (
            <div className="p-1.5 border-t border-slate-800/40 bg-slate-950/30 flex justify-center">
              <button
                onClick={handleAddChannel}
                className="flex items-center gap-1 px-3 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-150"
              >
                <Plus size={10} /> Kanal (Patch) hinzufügen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. ABSCHLIESSENDE ZEILE: MITGEBRACHTE BACKLINE */}
      <div className="space-y-1 w-full">
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 opacity-40">
          <Activity size={9} className="text-amber-500/80" /> MITGEBRACHTE BACKLINE & SPEZIFISCHER AUDIO-BEDARF
        </span>
        <div className="bg-[#070b12]/20 border border-slate-800/20 rounded-md p-2 min-h-[42px]">
          {isEditing ? (
            <textarea
              rows={2}
              value={techData.rider_backline}
              onChange={(e) => handleTechChange('rider_backline', e.target.value)}
              placeholder="Welche Backline bringt die Band mit? (z.B. eigenes In-Ear-Rack, Funkstrecken)?"
              className="w-full bg-[#0c1220] border border-slate-800 rounded-md p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />
          ) : (
            <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
              {techData.rider_backline || "Keine spezifischen Angaben zu mitgebrachter Backline deklariert."}
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
