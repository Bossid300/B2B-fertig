import React, { useState, useEffect } from 'react';
import { Calendar, Save, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export default function ProfileAvailBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showAvail, setShowAvail] = useState(true);
  const [generalStatus, setGeneralStatus] = useState('available');
  
  const [days, setDays] = useState({
    MO: true, DI: true, MI: true, DO: true, FR: true, SA: true, SO: true
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Verfügbarkeiten live aus gigsda_profiles
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
            setShowAvail(found.show_avail !== false);
            setGeneralStatus(found.general_status || 'available');
            if (found.avail_days) setDays(found.avail_days);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Verfügbarkeits-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const toggleDay = (dayKey) => {
    if (!isEditing) return;
    setDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));
  };

  // 2. SAVE PIPELINE: Sichert das Kalender-Protokoll
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, general_status: generalStatus, avail_days: days, show_avail: showAvail };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Verfügbarkeits-Protokoll erfolgreich eingebrannt! 📅⚡");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Verfügbarkeit:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // VERFÜGBARKEITS-MATRIZ INITIALISIERT...
      </div>
    );
  }

  const isVisible = showAvail || canEdit;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-emerald-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B DISPONENTEN KALENDER</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowAvail(!showAvail)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showAvail ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showAvail ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-black tracking-wider uppercase hover:border-emerald-500 transition-all cursor-pointer"
            >
              ✏️ Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// LIVE STATUS</span>
            {generalStatus === 'available' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={12} /> SOFORT BEREIT
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/30 border border-rose-500/40 text-rose-400 font-black text-xs uppercase shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <XCircle size={12} /> AUSGEBUCHT
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// REGULÄRE EINSATZTAGE</span>
            {!isVisible ? (
              <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// KALENDER-PROTOKOLL AUSGEBLENDET</div>
            ) : (
              <div className="grid grid-cols-7 gap-1 text-center">
                {Object.keys(days).map((day) => (
                  <div key={day} className={`p-2 rounded-xl border text-[10px] font-black transition-all ${days[day] ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>{day}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// GLOBALEN DISPO-STATUS</span>
              <select value={generalStatus} onChange={(e) => setGeneralStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer">
                <option value="available">🟢 SOFORT EINSATZBEREIT</option>
                <option value="booked">🔴 FULLY BOOKED</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// TAGE DURCHKLICKEN</span>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Object.keys(days).map((day) => (
                  <button key={day} type="button" onClick={() => toggleDay(day)} className={`p-2.5 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${days[day] ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600 line-through'}`}>{day}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-slate-950 hover:bg-emerald-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]">Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
