import React, { useState, useEffect } from 'react';
import { HelpCircle, Save, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

export default function ProfileHilfeBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showHilfe, setShowHilfe] = useState(true);
  
  // Haupt-Status: "ready" (Bereit zum Helfen) oder "none" (Nur Hauptgeschäft)
  const [hilfeStatus, setHilfeStatus] = useState('ready');
  
  // Die spezifischen Hilfs-Kategorien (True = Mache ich, False = Nein danke)
  const [categories, setCategories] = useState({
    aufbau: true,
    flyer: true,
    logistik: false,
    abbau: false
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt die Hilfs-Daten live aus gigsda_profiles
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
            setShowHilfe(found.show_hilfe !== false);
            setHilfeStatus(found.hilfe_status || 'ready');
            if (found.hilfe_categories) setCategories(found.hilfe_categories);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Hilfs-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const toggleCategory = (key) => {
    if (!isEditing) return;
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 2. SAVE PIPELINE: Brennt das Hilfs-Protokoll in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, hilfe_status: hilfeStatus, hilfe_categories: categories, show_hilfe: showHilfe };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Support- & Hilfsprotokoll erfolgreich eingebrannt! 🏗️📄");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Hilfs-Daten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // SUPPORT REGISTRY INITIALISIERT...
      </div>
    );
  }

  const isVisible = showHilfe || canEdit;
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle size={14} className="text-amber-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B CREW-SUPPORT & NACHBARSCHAFTSHILFE</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowHilfe(!showHilfe)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showHilfe ? 'text-amber-400 border-amber-500/30 bg-amber-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showHilfe ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-[10px] font-black tracking-wider uppercase hover:border-amber-500 transition-all cursor-pointer"
            >
              ✏️ Optionen
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* HELP AMPEL */}
          <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// B2B OPERATIONAL STATUS</span>
            {hilfeStatus === 'ready' ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={12} /> SUPPORT BEREIT
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-500 font-black text-xs uppercase">
                <XCircle size={12} /> NUR CORE-BUSINESS
              </div>
            )}
          </div>

          {/* SATELLITEN TÄTIGKEITEN */}
          <div className="md:col-span-2 space-y-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// UNTERSTÜTZUNG BEI FOLGENDEN TÄTIGKEITEN</span>
            {hilfeStatus !== 'ready' ? (
              <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// USER STEHT AKTUELL NUR FÜR SEINE HAUPTROLLE ZUR VERFÜGUNG</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className={`p-2 rounded-xl border text-[10px] font-black uppercase ${categories.aufbau ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>🏗️ Bühnenaufbau / Hand</div>
                <div className={`p-2 rounded-xl border text-[10px] font-black uppercase ${categories.flyer ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>📄 Flyer / Promotion</div>
                <div className={`p-2 rounded-xl border text-[10px] font-black uppercase ${categories.logistik ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>🚚 Logistik-Hilfe</div>
                <div className={`p-2 rounded-xl border text-[10px] font-black uppercase ${categories.abbau ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/40 border-slate-900 text-slate-600 line-through'}`}>🧼 Abbau / Gastro</div>
              </div>
            )}
          </div>

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* DROPDOWN STATUS */}
            <div className="flex flex-col gap-1.5 justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">// GLOBALEN HELFER-STATUS EINSTELLEN</span>
              <select value={hilfeStatus} onChange={(e) => setHilfeStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer">
                <option value="ready">🟢 BEREIT ALS HELFENDE HAND (AUFBAU/PROMO)</option>
                <option value="none">⚪ KEINE HILFSTÄTIGKEITEN</option>
              </select>
            </div>

            {/* INTERAKTIVE TOGGLES */}
            <div className="md:col-span-2 space-y-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// ANKLICKEN (GRÜN = DA BIN ICH DABEI / GRAU = NEIN)</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <button type="button" onClick={() => toggleCategory('aufbau')} className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer uppercase ${categories.aufbau ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-900/40' : 'bg-slate-900 border-slate-800 text-slate-600 line-through hover:border-slate-700'}`}>🏗️ Bühnenaufbau / Hand</button>
                <button type="button" onClick={() => toggleCategory('flyer')} className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer uppercase ${categories.flyer ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-900/40' : 'bg-slate-900 border-slate-800 text-slate-600 line-through hover:border-slate-700'}`}>📄 Flyer / Promotion</button>
                <button type="button" onClick={() => toggleCategory('logistik')} className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer uppercase ${categories.logistik ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-900/40' : 'bg-slate-900 border-slate-800 text-slate-600 line-through hover:border-slate-700'}`}>🚚 Logistik-Hilfe</button>
                <button type="button" onClick={() => toggleCategory('abbau')} className={`p-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer uppercase ${categories.abbau ? 'bg-emerald-950/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-900/40' : 'bg-slate-900 border-slate-800 text-slate-600 line-through hover:border-slate-700'}`}>🧼 Abbau / Gastro</button>
              </div>
            </div>

          </div> {/* Schließt das grid-cols-1 md:grid-cols-3 div der Formular-Maske exakt ab! */}

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"><Save size={12} /> Support Einbrennen ✓</button>
          </div>
        </form>
      )}

    </div>
  );
}
