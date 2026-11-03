import React, { useState, useEffect } from 'react';
import { Calendar, Save, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { saveProfile } from '../services/apiService';
import { getProfilesDb } from '../services/apiService';

export default function ProfileAvailBox({ currentProfileId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showAvail, setShowAvail] = useState(true);
  const [fieldVisibility, setFieldVisibility] = useState({
    general_status: true,
    avail_days: true
  });
  const [generalStatus, setGeneralStatus] = useState('available');
  
  const [days, setDays] = useState({
    MO: true, DI: true, MI: true, DO: true, FR: true, SA: true, SO: true
  });

const canEdit = isOwner || currentProfileId === localStorage.getItem('gigsda_profile_id');

  // 1. DATABASE PIPELINE: Lädt Verfügbarkeiten live
  useEffect(() => {
    getProfilesDb(currentProfileId)
      .then(profiles => {
        const found = profiles.find(
          p => p?.id === currentProfileId
        );

        if (!found) return;
        const profileData =
          found?.profile_json
            ? JSON.parse(found.profile_json)
            : found;
        setProfile(profileData);
        setShowAvail(
          profileData.show_avail !== false
        );
        setGeneralStatus(
          profileData.general_status ||
          'available'
        );
        setFieldVisibility({
          general_status: profileData.show_general_status !== false,
          avail_days: profileData.show_avail_days !== false
        });
        if (profileData.avail_days) {
          setDays(profileData.avail_days);
        }
      })
      .catch(console.error);
  }, [currentProfileId, isEditing]);


  const toggleDay = (dayKey) => {
    if (!isEditing) return;
    setDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));
  };

  // 2. SAVE PIPELINE: Sichert das Kalender-Protokoll
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        general_status: generalStatus,
        avail_days: days,
        show_avail: showAvail,
        show_general_status: fieldVisibility.general_status,
        show_avail_days: fieldVisibility.avail_days
      };
      if (updatedProfile?.id) {

      const saveProfileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;

      await saveProfile({
        profileId: saveProfileId,
        profile: updatedProfile
      });
      }
      alert(
        "B2B Verfügbarkeits-Protokoll erfolgreich eingebrannt! 📅⚡"
      );
      setProfile(updatedProfile);
      setIsEditing(false);
      window.dispatchEvent(
        new Event('storage')
      );
    } catch (e) {
      console.error(
        "Fehler beim Sichern der Verfügbarkeit:",
        e
      );
    }
  };


  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // AVAIL VERFÜGBARKEITS-MATRIX INITIALISIERT...
      </div>
    );
  }

  const isVisible = showAvail || canEdit;
  if (!isVisible) return null;
  const canShowField = (field) => canEdit || fieldVisibility[field];
  if (!canEdit && !canShowField('general_status') && !canShowField('avail_days')) return null;
  const toggleFieldVisibility = (field) => {
    setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };
  const renderFieldToggle = (field) => (
    <button
      type="button"
      onClick={() => toggleFieldVisibility(field)}
      aria-label={`Sichtbarkeit ${field} umschalten`}
      title={fieldVisibility[field] ? 'Für andere sichtbar' : 'Für andere ausgeblendet'}
      className="text-slate-400 hover:text-white"
    >
      {fieldVisibility[field] ? <Eye size={12} /> : <EyeOff size={12} />}
    </button>
  );

  return (
    <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-emerald-400" />
          <span className="text-xs font-black tracking-widest uppercase">// Kapazitäts- & Einsatzkalender</span>
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
              data-profile-edit-trigger onClick={() => setIsEditing(true)}
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
          {canShowField('general_status') && <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
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
          </div>}

          {canShowField('avail_days') && <div className="md:col-span-2 space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// REGULÄRE EINSATZTAGE</span>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Object.keys(days).map((day) => (
                <div key={day} className={`p-2 rounded-xl border text-[10px] font-black transition-all ${days[day] ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>{day}</div>
              ))}
            </div>
          </div>}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 justify-center">
              <div className="flex items-center justify-between"><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// GLOBALEN DISPO-STATUS</span>{renderFieldToggle('general_status')}</div>
              <select value={generalStatus} onChange={(e) => setGeneralStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono cursor-pointer">
                <option value="available">🟢 SOFORT EINSATZBEREIT</option>
                <option value="booked">🔴 FULLY BOOKED</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between"><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// TAGE DURCHKLICKEN</span>{renderFieldToggle('avail_days')}</div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {Object.keys(days).map((day) => (
                  <button key={day} type="button" onClick={() => toggleDay(day)} className={`p-2.5 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${days[day] ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-600 line-through'}`}>{day}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" data-profile-action="cancel" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" data-profile-action="save" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-slate-950 hover:bg-emerald-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><Save size={12} /> Speichern</button>
          </div>
        </form>
      )}
    </div>
  );
}
