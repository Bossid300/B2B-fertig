import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, Edit3, Check, Plus, Trash2, 
  FileText, Image as ImageIcon, Users, MapPin, DollarSign, Activity 
} from 'lucide-react';

export default function LocationRaeumeBox({ currentProfileName, isOwner, selectedRoom }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [rooms, setRooms] = useState([]);

  // 1. PIPELINE & PIPELINE-FLAGS AUS DEINER STAMMBOX ÜBERNEHMEN
  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();
  
  // Hilfsfunktion zum Prüfen, ob ein Link ein Bild ist
  const isImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) != null || url.startsWith('data:image/');
  };

  // 2. DATEN-PIPELINE: Lädt Räume passend zur Arena Braunau Struktur
  useEffect(() => {
    if (!targetUser) return;
    
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (storedProfiles) {
      const profiles = JSON.parse(storedProfiles);
      
      // Exakte Such-Logik aus Zeile 20 deiner Stammbox
      const currentProfile = profiles.find(p => 
        p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
      );

      if (currentProfile) {
        setProfileId(currentProfile.id);
        
        const loadedRooms = [];
        let index = 1;
        
        // Liest fortlaufend room1, room2, room3 aus deinen Live-Daten
        while (currentProfile[`room${index}_name`] !== undefined || currentProfile[`room${index}_img`] !== undefined || index <= 1) {
          loadedRooms.push({
            index: index,
            name: currentProfile[`room${index}_name`] || `Raum ${index}`,
            img: currentProfile[`room${index}_img`] || '',
            tech_plan: currentProfile[`room${index}_tech_plan`] || '',
            bankett: currentProfile[`room${index}_bankett`] || '',
            steh: currentProfile[`room${index}_steh`] || '',
            theater: currentProfile[`room${index}_theater`] || '',
            uform: currentProfile[`room${index}_uform`] || '',
            area: currentProfile[`room${index}_area`] || '',
            power_supply: currentProfile[`room${index}_power_supply`] || '',
            curfew_time: currentProfile[`room${index}_curfew_time`] || '',
            equipment: currentProfile[`room${index}_equipment`] || '',
            opnv: currentProfile[`room${index}_opnv`] || '',
            konditionen: currentProfile[`room${index}_konditionen`] || '',
            isPublic: currentProfile[`room${index}_visibility`] !== false
          });
          index++;
        }
        setRooms(loadedRooms);
      }
    }
  }, [targetUser, isEditing]);

  // Input Handler
  const handleInputChange = (index, field, value) => {
    setRooms(prev => prev.map(room => 
      room.index === index ? { ...room, [field]: value } : room
    ));
  };

  // Neuen Raum anhängen
  const handleAddRoom = () => {
    const nextIndex = rooms.length > 0 ? Math.max(...rooms.map(r => r.index)) + 1 : 1;
    setRooms([...rooms, {
      index: nextIndex,
      name: `Raum ${nextIndex}`,
      img: '',
      tech_plan: '',
      bankett: '',
      steh: '',
      theater: '',
      uform: '',
      area: '',
      equipment: '',
      opnv: '',
      konditionen: '',
      isPublic: true
    }]);
  };

  // Raum entfernen
  const handleRemoveRoom = (indexToRemove) => {
    if (window.confirm("Möchtest du diesen Raum und alle technischen Dokumente wirklich löschen?")) {
      setRooms(rooms.filter(room => room.index !== indexToRemove));
    }
  };

  // SPEICHERN: Schreibt flache Keys zurück in gigsda_profiles
  const handleSave = () => {
    const storedProfiles = localStorage.getItem('gigsda_profiles');
    if (!storedProfiles || !profileId) return;

    let profiles = JSON.parse(storedProfiles);
    const profileIndex = profiles.findIndex(p => p.id === profileId);

    if (profileIndex !== -1) {
      // Alte Raum-Keys löschen, um Überschneidungen zu verhindern
      Object.keys(profiles[profileIndex]).forEach(key => {
        if (key.startsWith('room') && (key.includes('_name') || key.includes('_img') || key.includes('_tech_plan') || key.includes('_bankett') || key.includes('_steh') || key.includes('_theater') || key.includes('_uform') || key.includes('_area') || key.includes('_equipment') || key.includes('_opnv') || key.includes('_konditionen') || key.includes('_visibility'))) {
          delete profiles[profileIndex][key];
        }
      });

      // Flach zurückschreiben
      rooms.forEach((room, idx) => {
        const i = idx + 1;
        profiles[profileIndex][`room${i}_name`] = room.name;
        profiles[profileIndex][`room${i}_img`] = room.img;
        profiles[profileIndex][`room${i}_tech_plan`] = room.tech_plan;
        profiles[profileIndex][`room${i}_bankett`] = room.bankett;
        profiles[profileIndex][`room${i}_steh`] = room.steh;
        profiles[profileIndex][`room${i}_theater`] = room.theater;
        profiles[profileIndex][`room${i}_uform`] = room.uform;
        profiles[profileIndex][`room${i}_area`] = room.area;
        profiles[profileIndex][`room${i}_power_supply`] = room.power_supply;
        profiles[profileIndex][`room${i}_curfew_time`] = room.curfew_time;
        profiles[profileIndex][`room${i}_equipment`] = room.equipment;
        profiles[profileIndex][`room${i}_opnv`] = room.opnv;
        profiles[profileIndex][`room${i}_konditionen`] = room.konditionen;
        profiles[profileIndex][`room${i}_visibility`] = room.isPublic;
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
        } catch (err) {
          console.error(
            "Location Rider Status Fehler:",
            err
          );
        }

      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#0b111e] rounded-2xl border border-slate-800/80 shadow-2xl p-6 mb-8 text-slate-200 font-sans">
      
      {/* Box Header-Zeile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-500 uppercase">// 3. Kapazitäten & Technische Details</span>
          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">VERFÜGBARE RÄUMLICHKEITEN & TECH-AUSSTATTUNG</h2>
        </div>

        {/* CanEdit Weiche aus deiner Stammbox gesteuert */}
        {canEdit && (
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border shadow-md ${
              isEditing 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
          >
            {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
            {isEditing ? 'Änderungen Speichern' : 'Bearbeiten'}
          </button>
        )}
      </div>

      {/* Raum-Liste */}
      <div className="space-y-8 divide-y divide-slate-800/40">
        {rooms
          .filter(
            room =>
              !selectedRoom ||
              room.index === selectedRoom
          )
          .map((room) => (

          <div key={room.index} className={`pt-6 first:pt-0 ${!room.isPublic && !isEditing ? 'opacity-50' : ''}`}>
            
            {/* Raum Sub-Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <span className="text-base">🏢</span>
                {isEditing ? (
                  <input 
                    type="text"
                    value={room.name}
                    onChange={(e) => handleInputChange(room.index, 'name', e.target.value)}
                    className="bg-[#070b12] border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                  />
                ) : (
                  <h3 className="text-base font-bold text-white uppercase tracking-wide">{room.name}</h3>
                )}
              </div>

              {/* Auge & Mülltonne */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => handleInputChange(room.index, 'isPublic', !room.isPublic)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        room.isPublic 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {room.isPublic ? <Eye size={13} /> : <EyeOff size={13} />}
                      {room.isPublic ? 'Sichtbar (B2B)' : 'Ausgeblendet'}
                    </button>
                    {rooms.length > 1 && (
                      <button 
                        onClick={() => handleRemoveRoom(room.index)}
                        className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </>
                ) : (
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    room.isPublic ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {room.isPublic ? 'Öffentlich' : 'Privat'}
                  </span>
                )}
              </div>
            </div>
              
            {/* ZWEI MEDIENBEREICHE NEBENEINANDER */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              
              {/* Spalte 1: Raumbild */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><ImageIcon size={12} /> Raumbild / Foto</span>
                <div className="bg-[#070b12] rounded-xl border border-slate-800/80 overflow-hidden h-64 flex items-center justify-center relative">
                  {room.img ? (
                    <img src={room.img} alt={room.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <span className="block text-3xl mb-1">📸</span>
                      <span className="text-xs text-slate-500">Kein Raumbild hinterlegt</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input 
                    type="text"
                    placeholder="Bild-URL einfügen (https://...)"
                    value={room.img}
                    onChange={(e) => handleInputChange(room.index, 'img', e.target.value)}
                    className="bg-[#070b12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full"
                  />
                )}
              </div>

              {/* Spalte 2: Technischer Plan (Bild-Anzeige ODER PDF-Button) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><FileText size={12} /> Bühnenplan & Stromnetz-Matrix</span>
                <div className="bg-[#070b12] rounded-xl border border-slate-800/80 overflow-hidden h-64 flex items-center justify-center relative">
                  {room.tech_plan ? (
                    isImageUrl(room.tech_plan) ? (
                      <img src={room.tech_plan} alt="Technischer Plan" className="w-full h-full object-contain bg-black/20" />
                    ) : (
                      // Edle B2B Download-Karte für PDFs
                      <div className="text-center p-6 max-w-sm">
                        <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText size={26} />
                        </div>
                        <h4 className="text-sm font-semibold text-white mb-1">Technischer Rider / Plan geladen</h4>
                        <p className="text-[11px] text-slate-400 mb-4 truncate w-48 mx-auto">{room.tech_plan}</p>
                        <a 
                          href={room.tech_plan} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          Dokument / PDF öffnen
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="text-center p-4">
                      <span className="block text-3xl mb-1">📊</span>
                      <span className="text-xs text-slate-500">Kein Bühnen- oder Stromplan hinterlegt</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <input 
                    type="text"
                    placeholder="Plan-URL (Bild oder PDF-Link) einfügen (https://...)"
                    value={room.tech_plan}
                    onChange={(e) => handleInputChange(room.index, 'tech_plan', e.target.value)}
                    className="bg-[#070b12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full"
                  />
                )}
              </div>
            </div>

            {/* KAPAZITÄTEN & DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              
              {/* Block A: Kapazitäten & Fläche */}
              <div className="bg-[#070b12]/60 border border-slate-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800/60 pb-1.5 uppercase tracking-wide">
                  <Users size={13} className="text-cyan-500" /> Kapazitäten & Fläche
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-0.5">Fläche (m²)</label>
                    {isEditing ? (
                      <input type="text" value={room.area} onChange={(e) => handleInputChange(room.index, 'area', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs" />
                    ) : (
                      <span className="font-bold text-white text-sm">{room.area ? `${room.area} m²` : '—'}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5">Stehempfang</label>
                    {isEditing ? (
                      <input type="text" value={room.steh} onChange={(e) => handleInputChange(room.index, 'steh', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs" />
                    ) : (
                      <span className="font-bold text-white text-sm">{room.steh ? `${room.steh} Pax` : '—'}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5">Bankett-Gala</label>
                    {isEditing ? (
                      <input type="text" value={room.bankett} onChange={(e) => handleInputChange(room.index, 'bankett', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs" />
                    ) : (
                      <span className="font-bold text-white text-sm">{room.bankett ? `${room.bankett} Pax` : '—'}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-0.5">Theater-Reihen</label>
                    {isEditing ? (
                      <input type="text" value={room.theater} onChange={(e) => handleInputChange(room.index, 'theater', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs" />
                    ) : (
                      <span className="font-bold text-white text-sm">{room.theater ? `${room.theater} Pax` : '—'}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-500 block mb-0.5">U-Form Bestuhlung</label>
                    {isEditing ? (
                      <input type="text" value={room.uform} onChange={(e) => handleInputChange(room.index, 'uform', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white text-xs" />
                    ) : (
                      <span className="font-bold text-white text-sm">{room.uform ? `${room.uform} Pax` : '—'}</span>
                    )}
                  </div>
                  <div>
                    <label className="text-amber-500 block mb-0.5 font-mono">⚡ STROMBEDARF</label>
                    {isEditing ? (
                      <select 
                        value={room.power_supply || 'schuko'} 
                        onChange={(e) => handleInputChange(room.index, 'power_supply', e.target.value)} 
                        className="w-full bg-slate-900 border border-amber-900/40 rounded p-1 text-white text-xs font-mono h-[26px]"
                      >
                        <option value="cee 63a">CEE 63A (Großbühne)</option>
                        <option value="cee 32a">CEE 32A (Mittelbühne / Club)</option>
                        <option value="cee 16a">CEE 16A (Kleine Bühne)</option>
                        <option value="schuko">230V Schuko (Standard)</option>
                      </select>
                    ) : (
                      <span className="font-bold text-amber-400 text-sm font-mono">
                        {room.power_supply ? room.power_supply.toUpperCase() : '—'}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-cyan-500 block mb-0.5 font-mono">⏱️ SPERRSTUNDE</label>
                    {isEditing ? (
                      <input type="text" placeholder="e.g. 02:00" value={room.curfew_time} onChange={(e) => handleInputChange(room.index, 'curfew_time', e.target.value)} className="w-full bg-slate-900 border border-cyan-900/40 rounded p-1 text-white text-xs font-mono" />
                    ) : (
                      <span className="font-bold text-cyan-400 text-sm font-mono">{room.curfew_time || '—'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Block B: Vorhandene Technik & Equipment */}
              <div className="bg-[#070b12]/60 border border-slate-800/60 rounded-xl p-4 space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800/60 pb-1.5 uppercase tracking-wide">
                  <Activity size={13} className="text-amber-500" /> Vorhandene Inhouse-Technik & Equipment
                </div>
                <div>
                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={room.equipment}
                      onChange={(e) => handleInputChange(room.index, 'equipment', e.target.value)}
                      placeholder="Welche Tonanlage, Lichttechnik, Stative, Beamer oder Mischpulte sind fest installiert?"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  ) : (
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[90px]">
                      {room.equipment || "Keine spezifischen Inhouse-Materialien deklariert."}
                    </p>
                  )}
                </div>
              </div>

              {/* Block C: Logistik, ÖPNV & Mietbedingungen */}
              <div className="bg-[#070b12]/60 border border-slate-800/60 rounded-xl p-4 space-y-3 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800/40 pb-1 uppercase tracking-wide">
                    <MapPin size={12} className="text-purple-500" /> Parken & ÖPNV-Anbindung
                  </div>
                  {isEditing ? (
                    <input type="text" value={room.opnv} onChange={(e) => handleInputChange(room.index, 'opnv', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-xs" />
                  ) : (
                    <span className="text-xs text-slate-300 block">{room.opnv || 'Keine Angaben hinterlegt'}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 border-b border-slate-800/40 pb-1 uppercase tracking-wide">
                    <DollarSign size={12} className="text-emerald-500" /> Preise, Konditionen & Mietbedingungen
                  </div>
                  {isEditing ? (
                    <input type="text" value={room.konditionen} onChange={(e) => handleInputChange(room.index, 'konditionen', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white text-xs" />
                  ) : (
                    <span className="text-xs text-slate-300 block">{room.konditionen || 'Keine Bedingungen deklariert'}</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Plus-Button unten */}
      {isEditing && (
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-center">
          <button
            onClick={handleAddRoom}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-inner"
          >
            <Plus size={16} />
            Weiteren Raum hinzufügen
          </button>
        </div>
      )}

    </div>
  );
}
