import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, EyeOff, Edit3, Check, Plus, Trash2, 
  FileText, Image as ImageIcon, Users, MapPin, DollarSign, Activity 
} from 'lucide-react';
import { getProfilesDb } from '../services/apiService';
import { saveProfile } from '../services/apiService';
import { eventService } from '../services/eventService';
import {
  getMediaAssets,
  getMediaPreviewUrl,
  getMediaDownloadUrl,
  uploadMediaFile
} from '../services/mediaService';



const POWER_SUPPLY_LABELS = {
  'cee 63a': 'CEE 63A (Großbühne)',
  'cee 32a': 'CEE 32A (Mittelbühne / Club)',
  'cee 16a': 'CEE 16A (Kleine Bühne)',
  schuko: '230V Schuko (Standard)'
};

const getPowerSupplyLabel = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();
  return POWER_SUPPLY_LABELS[normalizedValue] || value || '—';
};

export default function LocationRaeumeBox({ currentProfileId, isOwner, selectedRoom }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const canEdit = isOwner || currentProfileId === localStorage.getItem('gigsda_profile_id');

  const [roomAssets, setRoomAssets] = useState([]);
  const [selectedRoomAssetId, setSelectedRoomAssetId] = useState('');
  const [selectedRoomSlot, setSelectedRoomSlot] = useState(null);
  const [isRoomChooserOpen, setRoomChooserOpen] = useState(false);
  const roomFileInputRef = useRef(null);

  const [techPlanAssets, setTechPlanAssets] = useState([]);
  const [selectedTechPlanAssetId, setSelectedTechPlanAssetId] = useState('');
  const [selectedTechPlanRoom, setSelectedTechPlanRoom] = useState(null);
  const [isTechPlanChooserOpen, setTechPlanChooserOpen] = useState(false);
  const techPlanFileInputRef = useRef(null);



  const handleRoomUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const asset =
        await uploadMediaFile(file);
      const assets =
        await getMediaAssets();
      setRoomAssets(
        assets.filter(
          asset => asset.media_type === 'image'
        )
      );
      setSelectedRoomAssetId(
        asset.id
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTechPlanUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const uploadedAsset =
        await uploadMediaFile(file);
      const assets =
        await getMediaAssets();
      setTechPlanAssets(
        assets.filter(
          asset =>
            asset.media_type === 'image' ||
            asset.media_type === 'document'
        )
      );
      setSelectedTechPlanAssetId(
        uploadedAsset.id
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Hilfsfunktion zum Prüfen, ob ein Link ein Bild ist
  const isImageUrl = (url) => {

    if (!url) return false;

    return (
      url.includes('/api/media.php?preview=')
      ||
      url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) != null
      ||
      url.startsWith('data:image/')
    );
  };

  // 2. DATEN-PIPELINE: Lädt Räume passend zur Arena Braunau Struktur
  useEffect(() => {
    getProfilesDb(currentProfileId)
      .then(profiles => {
        const found = profiles.find(
          p => String(p?.id) === String(currentProfileId)
        );

        if (!found) return;

        const profileData =
          found?.profile_json
            ? JSON.parse(found.profile_json)
            : found;

        const loadedRooms = [];
        let index = 1;

        while (
          profileData[`room${index}_name`] !== undefined ||
          profileData[`room${index}_img`] !== undefined ||
          index <= 1
        ) {
          loadedRooms.push({
            index,
            name:
              profileData[`room${index}_name`] ||
              `Raum ${index}`,
            img:
              profileData[`room${index}_img`] || '',
            tech_plan:
              profileData[`room${index}_tech_plan`] || '',
            bankett:
              profileData[`room${index}_bankett`] || '',
            steh:
              profileData[`room${index}_steh`] || '',
            theater:
              profileData[`room${index}_theater`] || '',
            uform:
              profileData[`room${index}_uform`] || '',
            area:
              profileData[`room${index}_area`] || '',
            power_supply:
              profileData[`room${index}_power_supply`] || 'schuko',
            curfew_time:
              profileData[`room${index}_curfew_time`] || '',
            opening_hours:
              profileData[`room${index}_opening_hours`] || '',
            equipment:
              profileData[`room${index}_equipment`] || '',
            opnv:
              profileData[`room${index}_opnv`] || '',
            konditionen:
              profileData[`room${index}_konditionen`] || '',
            isPublic:
              profileData[`room${index}_visibility`] !== false
          });

          index++;
        }

        setRooms(loadedRooms);
      })
      .catch(console.error);
  }, [currentProfileId]);


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
      power_supply: 'schuko',
      curfew_time: '',
      opening_hours: '',
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

  // SPEICHERN: Schreibt flache Keys zurück
  const handleSave = async () => {
    if (!currentProfileId) return;
    try {
      const profiles = await getProfilesDb(currentProfileId);
      const found = profiles.find(
        profile => String(profile?.id) === String(currentProfileId)
      );
      if (!found) {
        throw new Error('Profil konnte vor dem Speichern nicht geladen werden.');
      }

      const latestProfile =
        found.profile_json
          ? JSON.parse(found.profile_json)
          : found;

      const updatedProfile = {
        ...latestProfile,
        id: currentProfileId
      };
      rooms.forEach((room) => {
        const i = room.index;
        updatedProfile[`room${i}_name`] = room.name;
        updatedProfile[`room${i}_img`] = room.img;
        updatedProfile[`room${i}_tech_plan`] = room.tech_plan;
        updatedProfile[`room${i}_bankett`] = room.bankett;
        updatedProfile[`room${i}_steh`] = room.steh;
        updatedProfile[`room${i}_theater`] = room.theater;
        updatedProfile[`room${i}_uform`] = room.uform;
        updatedProfile[`room${i}_area`] = room.area;
        updatedProfile[`room${i}_power_supply`] = room.power_supply;
        updatedProfile[`room${i}_curfew_time`] = room.curfew_time;
        updatedProfile[`room${i}_opening_hours`] = room.opening_hours;
        updatedProfile[`room${i}_equipment`] = room.equipment;
        updatedProfile[`room${i}_opnv`] = room.opnv;
        updatedProfile[`room${i}_konditionen`] = room.konditionen;
        updatedProfile[`room${i}_visibility`] = room.isPublic;
      });
      
      const saveProfileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;
      const result = await saveProfile({
        profileId: saveProfileId,
        profile: updatedProfile
      });

      if (!result?.success) {
        throw new Error(result?.error || 'Profil konnte nicht gespeichert werden.');
      }

      // Event-Markierung bleibt
      try {
const events =
  eventService.getEvents();
        const updatedEvents = events.map((event) => {

            if (!event.riderCenter?.[saveProfileId]) {
              return event;
            }
            return {
              ...event,
              riderCenter: {
                ...event.riderCenter,
                [saveProfileId]: {
                  ...event.riderCenter[saveProfileId],
                  confirmed: false,
                  changed: true,
                  changedAt: Date.now()
                }
              }
            };
          });
eventService.saveEvents(updatedEvents);

const changedEvent =
  updatedEvents.find(event =>
    event.riderCenter?.[saveProfileId]
  );

if (changedEvent) {
  await eventService.saveEvent(changedEvent);
}
        } catch (err) {
          console.error(
            "Location Rider Status Fehler:",
            err
          );
        }
      setIsEditing(false);
      } catch (err) {
        console.error(
        'Location Räume Save Fehler:',
          err
      );
        window.alert('Die Änderungen konnten nicht gespeichert werden. Bitte prüfe deine Verbindung und versuche es erneut.');
    }
  };

  return (
    <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* Box Header-Zeile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-500 uppercase">
            // Kapazitäten & Technische Details</span>
          <h2 className="text-xs font-bold text-white tracking-tight mt-0.5">
            VERFÜGBARE RÄUMLICHKEITEN & TECH-AUSSTATTUNG</h2>
        </div>

        {/* CanEdit Weiche aus deiner Stammbox gesteuert */}
        {canEdit && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-profile-action="cancel"
                onClick={() => setIsEditing(false)}
              >
                Abbrechen
              </button>
              <button
                type="button"
                data-profile-action="save"
                onClick={handleSave}
              >
                <Check size={14} /> Speichern
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-profile-edit-trigger
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={14} /> Bearbeiten
            </button>
          )
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
                  <>
                  <input 
                    type="text"
                    placeholder="Bild-URL einfügen (https://...)"
                    value={room.img}
                    onChange={(e) => handleInputChange(room.index, 'img', e.target.value)}
                    className="bg-[#070b12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full"
                  />
                  <button
                    type="button"
                    onClick={async () => {

                      setSelectedRoomSlot(room.index);

                    const assets =
                      await getMediaAssets();

                      setRoomAssets(
                        assets.filter(
                          a => a.media_type === 'image'
                        )
                      );

                      setRoomChooserOpen(true);

                    }}
                    className="w-full rounded-lg border border-pink-500/30 p-2 text-pink-400"
                  >
                    Bild wählen
                  </button>  
                  </>                
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
                  <>
                  <input 
                    type="text"
                    placeholder="Plan-URL (Bild oder PDF-Link) einfügen (https://...)"
                    value={room.tech_plan}
                    onChange={(e) => handleInputChange(room.index, 'tech_plan', e.target.value)}
                    className="bg-[#070b12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full"
                  />
                  <button
                    type="button"
                    onClick={async () => {

                      setSelectedTechPlanRoom(room.index);

                      const assets =
                        await getMediaAssets();

                      setTechPlanAssets(
                        assets.filter(
                          asset =>
                            asset.media_type === 'image' ||
                            asset.media_type === 'document'
                        )
                      );

                      setTechPlanChooserOpen(true);

                    }}
                    className="w-full rounded-lg border border-pink-500/30 p-2 text-pink-400"
                  >
                    Plan wählen
                  </button>
                  </>
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
                    <label className="text-amber-500 block mb-0.5 font-mono">⚡ STROM</label>
                    {isEditing ? (
                      <select 
                        value={room.power_supply}
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
                        {getPowerSupplyLabel(room.power_supply)}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-cyan-500 block mb-0.5 font-mono">⏱️ SPERRSTUNDE</label>
                    {isEditing ? (
                      <input type="text" placeholder="e.g. 02:00" value={room.curfew_time} 
                      onChange={(e) => handleInputChange(room.index, 'curfew_time', e.target.value)} 
                      className="w-full bg-slate-900 border border-cyan-900/40 rounded p-1 text-white text-xs font-mono" />
                    ) : (
                      <span className="font-bold text-cyan-400 text-sm font-mono">{room.curfew_time || '—'}</span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="text-cyan-500 block mb-0.5 font-mono">
                      🕒 ÖFFNUNGSZEITEN
                    </label>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        placeholder={`Fr: 19:00 - 02:00
                    Sa: 19:00 - 02:00
                    So: Nach Vereinbarung`}
                        value={room.opening_hours}
                        onChange={(e) =>
                          handleInputChange(room.index, 'opening_hours', e.target.value)
                        }
                        className="w-full bg-slate-900 border border-cyan-900/40 rounded p-1 text-white text-xs font-mono resize-y"
                      />
                    ) : (
                      <span className="font-bold text-cyan-400 text-sm font-mono whitespace-pre-line">
                        {room.opening_hours}
                      </span>
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
                      rows={20}
                      value={room.equipment}
                      onChange={(e) => handleInputChange(room.index, 'equipment', e.target.value)}
                      placeholder="Welche Tonanlage, Lichttechnik, Stative, Beamer oder Mischpulte sind fest installiert?"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-cyan-500 resize-y"
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


      {isRoomChooserOpen && (
      <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6">

          <h3 className="text-white text-xl mb-4">
            Galeriebild wählen
          </h3>

          <input
            ref={roomFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleRoomUpload}
          />

          <button
            type="button"
            onClick={() => roomFileInputRef.current?.click()}
            className="w-full rounded-xl border border-cyan-500/40 p-3 text-cyan-300 mb-6"
          >
            Neues Bild hochladen
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {roomAssets.map(asset => (

              <button
                key={asset.id}
                type="button"
                onClick={() =>
                  setSelectedRoomAssetId(asset.id)
                }
                className={`overflow-hidden rounded-xl border ${
                  selectedRoomAssetId === asset.id
                    ? 'border-cyan-400'
                    : 'border-slate-800'
                }`}
              >

                <img
                  src={getMediaPreviewUrl(asset.id)}
                  alt={asset.original_filename}
                  className="aspect-square w-full object-cover"
                />

                <span className="block truncate p-2 text-[10px] text-slate-300">
                  {asset.original_filename}
                </span>

              </button>

            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                setRoomChooserOpen(false)
              }
              className="rounded-xl border border-slate-700 px-4 py-2"
            >
              Schließen
            </button>
            <button
              type="button"
              disabled={!selectedRoomAssetId}
              onClick={() => {

                const asset =
                  roomAssets.find(
                    a => a.id === selectedRoomAssetId
                  );

                if (!asset) return;

                const mediaUrl =
                  getMediaPreviewUrl(asset.id);

                  setRooms(prev =>
                    prev.map((item) =>
                      item.index === selectedRoomSlot
                        ? {
                            ...item,
                            img: mediaUrl
                          }
                        : item
                    )
                  );

                  setRoomChooserOpen(false);

              }}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-bold"
            >
              Übernehmen
            </button>
          </div>

        </div>

      </div>
      )}      

      {isTechPlanChooserOpen && (
      <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6">

          <h3 className="text-white text-xl mb-4">
            Technischen Plan wählen
          </h3>
          <input
            ref={techPlanFileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleTechPlanUpload}
          />

          <button
            type="button"
            onClick={() =>
              techPlanFileInputRef.current?.click()
            }
            className="w-full rounded-xl border border-cyan-500/40 p-3 text-cyan-300 mb-6"
          >
            Neue Datei hochladen
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {techPlanAssets.map(asset => (

              <button
                key={asset.id}
                type="button"
                onClick={() =>
                  setSelectedTechPlanAssetId(asset.id)
                }
                className={`overflow-hidden rounded-xl border ${
                  selectedTechPlanAssetId === asset.id
                    ? 'border-cyan-400'
                    : 'border-slate-800'
                }`}
              >

                <div className="aspect-square flex items-center justify-center bg-slate-900">

                  {asset.media_type === 'image' ? (

                    <img
                      src={getMediaPreviewUrl(asset.id)}
                      alt={asset.original_filename}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="text-cyan-400 text-xs font-bold">
                      PDF / DOC
                    </div>

                  )}

                </div>

                <span className="block truncate p-2 text-[10px] text-slate-300">
                  {asset.original_filename}
                </span>

              </button>

            ))}

          </div>

          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                setTechPlanChooserOpen(false)
              }
              className="rounded-xl border border-slate-700 px-4 py-2"
            >
              Schließen
            </button>
            <button
              type="button"
              disabled={!selectedTechPlanAssetId}
              onClick={() => {

                const asset =
                  techPlanAssets.find(
                    a => a.id === selectedTechPlanAssetId
                  );

                if (!asset) return;

                const mediaUrl =
                  asset.media_type === 'image'
                    ? getMediaPreviewUrl(asset.id)
                    : getMediaDownloadUrl(asset.id);

                setRooms(prev =>
                  prev.map(item =>
                    item.index === selectedTechPlanRoom
                      ? {
                          ...item,
                          tech_plan: mediaUrl
                        }
                      : item
                  )
                );

                setTechPlanChooserOpen(false);

              }}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-bold"
            >
              Übernehmen
            </button>
          </div>

        </div>

      </div>
      )}

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
