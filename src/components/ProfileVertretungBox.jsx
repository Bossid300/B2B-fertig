import React, { useState, useEffect } from 'react';
import { ShieldCheck, Save, Eye, EyeOff, UserCheck, Mail, Phone } from 'lucide-react';

export default function ProfileVertretungBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [formData, setFormData] = useState({
    representation_type: 'self',
    agent_name: '',
    agent_email: '',
    agent_phone: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Vertretungs-Daten live aus gigsda_profiles
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
            setShowRepresentation(found.show_representation !== false);
            setFormData({
              representation_type: found.representation_type || 'self',
              agent_name: found.agent_name || '',
              agent_email: found.agent_email || '',
              agent_phone: found.agent_phone || ''
            });
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Vertretungs-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Sichert die Vertretungs-Matrix permanent
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
            show_representation: showRepresentation 
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Vertretungs- & Booking-Protokoll erfolgreich eingebrannt! 💾🤝");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Vertretungs-Daten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // REPRESENTATION DISPO PROTOKOLL INITIALISIERT...
      </div>
    );
  }

  const isVisible = showRepresentation || canEdit;
  if (!isVisible) return null;

  const { representation_type, agent_name, agent_email, agent_phone } = formData;

  const getTypeLabel = (val) => {
    if (val === 'self') return 'Eigenständig / Self-Managed & Direktkontakt';
    if (val === 'management') return 'Exklusiv-Management (Geschäftsführung)';
    if (val === 'booking') return 'Booking-Agentur (Exklusive Vertretung)';
    if (val === 'dispo') return 'Disponent / Interne Einsatzleitung';
    return 'Gewerbliche Vertretung';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B REPRESENTATION & BOOKING AUTHORITY</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowRepresentation(!showRepresentation)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showRepresentation ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showRepresentation ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all cursor-pointer"
            >
              ✏️ Vertretung
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          
          {/* STATUS KACHEL */}
          <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-2xl flex flex-col justify-center items-center text-center space-y-1">
            <UserCheck size={16} className="text-cyan-400 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">// AUTHORITY TYPE</span>
            <span className="text-white font-black text-[10px] uppercase tracking-wide px-2 py-0.5 bg-cyan-950/20 border border-cyan-500/20 rounded-md mt-1 truncate max-w-full">
              {representation_type === 'self' ? 'DIRECT DEAL' : 'AGENCY CONTRACT'}
            </span>
          </div>

          {/* AGENTUR DETAILS */}
          <div className="md:col-span-2 space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500 flex items-center gap-1"><UserCheck size={11} /> Struktur:</span> 
              <span className="text-slate-200 font-bold">{getTypeLabel(representation_type)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500 flex items-center gap-1"><ShieldCheck size={11} /> Name / Agentur:</span> 
              <span className="text-white font-medium uppercase truncate max-w-[60%]">{agent_name || 'Direktkontakt / Keine Agentur'}</span>
            </div>
            {representation_type !== 'self' && (
              <>
                <div className="flex justify-between py-1 border-b border-slate-900/30">
                  <span className="text-slate-500 flex items-center gap-1"><Mail size={11} /> Agentur E-Mail:</span> 
                  <span className="text-cyan-400 font-bold font-mono truncate max-w-[60%]">{agent_email || 'Nicht hinterlegt'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 flex items-center gap-1"><Phone size={11} /> Agentur Telefon:</span> 
                  <span className="text-white font-mono truncate max-w-[60%]">{agent_phone || 'Nicht hinterlegt'}</span>
                </div>
              </>
            )}
          </div>

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LINKER BLOCK */}
            <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// CONTRACT STRUCTURE</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold">// VERTRETUNGS-TYP</span>
                <select 
                  name="representation_type" 
                  value={representation_type || 'self'} 
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  <option value="self">🤝 Eigenständig / Direktkontakt</option>
                  <option value="management">📊 Exklusiv-Management</option>
                  <option value="booking">🎭 Booking-Agentur</option>
                  <option value="dispo">📞 Disponent / Einsatzleitung</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold">// NAME DER VERTRETUNG / AGENT</span>
                <input 
                  type="text" 
                  name="agent_name" 
                  value={agent_name || ''} 
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" 
                  placeholder="e.g. Cyber-Gigs Management" 
                />
              </div>
            </div>

            {/* RECHTER BLOCK */}
            <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// AGENCY CONTACT CREDENTIALS</span>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold">// AGENTUR E-MAIL</span>
                <input 
                  type="email" 
                  name="agent_email" 
                  value={agent_email || ''} 
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-cyan-400 focus:outline-none focus:border-cyan-500 font-mono" 
                  placeholder="e.g. booking@agency.com" 
                  disabled={representation_type === 'self'}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold">// AGENTUR TELEFON</span>
                <input 
                  type="text" 
                  name="agent_phone" 
                  value={agent_phone || ''} 
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" 
                  placeholder="e.g. +49 170 1234567" 
                  disabled={representation_type === 'self'}
                />
              </div>
            </div>

          </div> {/* Schließt das grid-cols-1 md:grid-cols-2 div exakt ab! */}

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Save size={12} /> Vertretung Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
