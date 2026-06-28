import React, { useState, useEffect } from 'react';
import { Truck, Save, Eye, EyeOff, MapPin, Navigation, DollarSign } from 'lucide-react';

export default function ProfileLogistikBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showLogistik, setShowLogistik] = useState(true);
  const [formData, setFormData] = useState({
    travel_radius: '100',
    mobility_status: '',
    travel_expenses: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Logistik-Daten live aus gigsda_profiles
  useEffect(() => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (savedProfiles) {
      try {
        const allProfiles = JSON.parse(savedProfiles);
        if (Array.isArray(allProfiles)) {
          const found = allProfiles.find(
            p => p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
          );
          if (found) {
            setProfile(found);
            setShowLogistik(found.show_logistik !== false);
            setFormData({
              travel_radius: found.travel_radius || '100',
              mobility_status: found.mobility_status || '',
              travel_expenses: found.travel_expenses || ''
            });
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Logistik-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Brennt die Logistik-Matrix permanent in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { 
            ...p, 
            ...formData, 
            show_logistik: showLogistik 
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Logistik- & Reise-Protokoll erfolgreich eingebrannt! 💾🚚");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Logistik-Daten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // LOGISTIK DISPO PROTOKOLL INITIALISIERT...
      </div>
    );
  }

  const isVisible = showLogistik || canEdit;
  if (!isVisible) return null;

  const { travel_radius, mobility_status, travel_expenses } = formData;

  const getRadiusLabel = (val) => {
    if (val === '50') return 'Lokalbetrieb (bis 50 km Radius)';
    if (val === '200') return 'Regionaler Radius (bis 200 km)';
    if (val === 'europe') return 'Zentral-Europa (D / A / CH / International)';
    if (val === 'worldwide') return 'Global-Aktionsradius (Weltweit / Touring)';
    return `Standard-Aktionsradius (bis ${val} km)`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-emerald-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B MOBILITY & LOGISTICS RADIUS</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowLogistik(!showLogistik)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showLogistik ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showLogistik ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-black tracking-wider uppercase hover:border-emerald-500 transition-all cursor-pointer"
            >
              ✏️ Logistik
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          
          {/* RADIUS KACHEL */}
          <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-2xl flex flex-col justify-center items-center text-center space-y-1">
            <MapPin size={16} className="text-emerald-400 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">// OPERATION RANGE</span>
            <span className="text-white font-black text-xs uppercase tracking-wide px-2 py-0.5 bg-emerald-950/20 border border-emerald-500/20 rounded-md mt-1">
              {travel_radius === 'europe' || travel_radius === 'worldwide' ? 'UNLIMITIERT' : `${travel_radius} KM`}
            </span>
          </div>

          {/* LOGISTIK DETAILS */}
          <div className="md:col-span-2 space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500 flex items-center gap-1"><Navigation size={11} /> Aktionsradius:</span> 
              <span className="text-slate-200 font-bold">{getRadiusLabel(travel_radius)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500 flex items-center gap-1"><Truck size={11} /> Fuhrpark & Mobilität:</span> 
              <span className="text-white font-medium uppercase truncate max-w-[60%]">{mobility_status || 'Eigenes KFZ / Standard'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1"><DollarSign size={11} /> Reisespesen-Konditionen:</span> 
              <span className="text-emerald-400 font-bold font-mono truncate max-w-[60%]">{travel_expenses || 'Auf Anfrage / Nach Aufwand'}</span>
            </div>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* RADIUS DROPDOWN */}
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// REISERADIUS WAHLEN</span>
              <select 
                name="travel_radius" 
                value={travel_radius || '100'} 
                onChange={handleChange} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
              >
                <option value="50">Lokalbetrieb (bis 50 km)</option>
                <option value="100">Standard (bis 100 km)</option>
                <option value="200">Regional (bis 200 km)</option>
                <option value="europe">Zentral-Europa (D/A/CH)</option>
                <option value="worldwide">Global (Weltweit / Tour)</option>
              </select>
            </div>

            {/* FUHRPARK INPUT */}
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// TRANSPORTMITTEL / SCHEINE</span>
              <input 
                type="text" 
                name="mobility_status" 
                value={mobility_status || ''} 
                onChange={handleChange} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" 
                placeholder="e.g. Eigener Transporter / FS Kl. C" 
              />
            </div>

            {/* SPESEN INPUT */}
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// SPESEN & PREIS PRO KM</span>
              <input 
                type="text" 
                name="travel_expenses" 
                value={travel_expenses || ''} 
                onChange={handleChange} 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono" 
                placeholder="e.g. 0,42 €/km ab Braunau" 
              />
            </div>

          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-slate-950 hover:bg-emerald-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><Save size={12} /> Logistik Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
