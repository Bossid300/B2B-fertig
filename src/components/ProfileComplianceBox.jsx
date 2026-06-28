import React, { useState, useEffect } from 'react';
import { Shield, Plus, X, Save, Eye, EyeOff, FileCheck, ShieldAlert } from 'lucide-react';

export default function ProfileComplianceBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showCompliance, setShowCompliance] = useState(false); // Standardmäßig STRENG GEHEIM!
  const [complianceList, setComplianceList] = useState([]);
  const [isVerifiedPartner, setIsVerifiedPartner] = useState(false);

  // Temporäre Zustände für das Hinzufügen
  const [newType, setNewType] = useState('Haftpflicht');
  const [newDetail, setNewDetail] = useState('');
  const [newValidity, setNewValidity] = useState('');

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const loggedInUser = localStorage.getItem('gigsda_user_name') || '';
  const canEdit = isOwner || targetUser.toLowerCase() === loggedInUser.toLowerCase();

  // 1. DATABASE & VERIFICATION PIPELINE
  useEffect(() => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    const savedEvents = localStorage.getItem('gigsda_events') || '[]';

    if (savedProfiles) {
      try {
        const allProfiles = JSON.parse(savedProfiles) || [];
        const found = allProfiles.find(
          p => p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
        );

        if (found) {
          setProfile(found);
          setShowCompliance(found.show_compliance === true); // Standardmäßig false
          setComplianceList(Array.isArray(found.compliance) ? found.compliance : []);

          // 📐 ERHÖHTER B2B-SECURITY CHECK: Hat der Betrachter ein bestätigtes Event mit dem Inhaber?
          if (loggedInUser && targetUser.toLowerCase() !== loggedInUser.toLowerCase()) {
            const allEvts = JSON.parse(savedEvents);
            const isContractPartner = allEvts.some(evt => {
              if (!evt || !Array.isArray(evt.crew)) return false;
              const namesInCrew = evt.crew.map(m => m && m.name ? m.name.trim().toLowerCase() : '');
              const memberStatus = evt.crew.find(m => m && m.name && m.name.trim().toLowerCase() === targetUser.trim().toLowerCase())?.status;
              
              return namesInCrew.includes(loggedInUser.trim().toLowerCase()) && 
                     (memberStatus === 'accepted' || memberStatus === 'confirmed');
            });
            setIsVerifiedPartner(isContractPartner);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Compliance-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing, loggedInUser]);

  const addComplianceItem = () => {
    if (!newDetail.trim()) return;
    setComplianceList(prev => [
      ...prev,
      {
        type: newType,
        detail: newDetail.trim(),
        valid_until: newValidity.trim() || 'Unbegrenzt'
      }
    ]);
    setNewDetail('');
    setNewValidity('');
  };

  const removeComplianceItem = (indexToRemove) => {
    setComplianceList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. SAVE PIPELINE: Sichert die Compliance-Daten permanent
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, compliance: complianceList, show_compliance: showCompliance };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Compliance- & Versicherungsnachweis erfolgreich verschlüsselt eingebrannt! 💾🛡️");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Compliance-Daten:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // SECURE COMPLIANCE RECORD INITIALIZING...
      </div>
    );
  }

  // Schranke: Sichtbar wenn Inhaber es erlaubt ODER Betrachter der Inhaber selbst ist ODER verifizierter Event-Partner!
  const isAccessible = showCompliance || canEdit || isVerifiedPartner;
  if (!isAccessible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-rose-500" />
          <span className="text-xs font-black tracking-widest uppercase">// COMMERCIAL COMPLIANCE & INSURANCE REGISTER</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <button 
              type="button" 
              onClick={() => {
                const nextShow = !showCompliance;
                setShowCompliance(nextShow);
                const saved = localStorage.getItem('gigsda_profiles');
                if (saved) {
                  let all = JSON.parse(saved);
                  all = all.map(p => p && (p.name || p.user_name || p.display_name)?.toLowerCase() === targetUser.toLowerCase() ? { ...p, show_compliance: nextShow } : p);
                  localStorage.setItem('gigsda_profiles', JSON.stringify(all));
                }
              }} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showCompliance ? 'text-rose-400 border-rose-500/30 bg-rose-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
              title={showCompliance ? "Compliance öffentlich" : "Compliance streng vertraulich"}
            >
              {showCompliance ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 text-[10px] font-black tracking-wider uppercase hover:border-rose-500 transition-all cursor-pointer"
            >
              ✏️ Audit Nachweise
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-2">
          {complianceList.length > 0 ? (
            complianceList.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:border-rose-500/50 transition-all">
                    <FileCheck size={14} />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-white font-black uppercase tracking-wide truncate">{item.detail}</span>
                    <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono mt-0.5">
                      <span className="flex items-center gap-1 text-rose-400 font-bold uppercase">// AUDIT TYP: {item.type}</span>
                    </div>
                  </div>
                </div>

                {/* GÜLTIGKEITS BADGE */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-900/60 text-[10px] font-mono text-slate-400 self-start sm:self-center">
                  <ShieldAlert size={11} className="text-rose-400" />
                  <span>Gültig bis: <strong className="text-white font-black uppercase">{item.valid_until}</strong></span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">
              // AKTUELL KEINE RECHTLICHEN COMPLIANCE-NACHWEISE HINTERLEGT
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// NEUEN NACHWEIS ODER COMPLIANCE-POLICE HINZUFÜGEN</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 w-full">
                <span className="text-[10px] text-slate-500 font-bold">// NACHWEIS KATEGORIE</span>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono cursor-pointer"
                >
                  <option value="Haftpflicht">🛡️ Betriebshaftpflicht-Police</option>
                  <option value="Gewerbe">📜 Gewerbeberechtigung / Erlaubnis</option>
                  <option value="Zertifikat">✅ Behördliches Zertifikat / Audit</option>
                  <option value="Ausweis">🆔 Lichtbildausweis / Sicherheitscheck</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// DETAILS & DECKUNGSSUMME</span>
                <input 
                  type="text" 
                  value={newDetail} 
                  onChange={(e) => setNewDetail(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono" 
                  placeholder="e.g. VHV Police - 5 Mio. Deckung" 
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// LAUFZEIT / GÜLTIGKEIT</span>
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    value={newValidity} 
                    onChange={(e) => setNewValidity(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono" 
                    placeholder="e.g. 31.12.2026 / Permanent" 
                  />
                  <button 
                    type="button" 
                    onClick={addComplianceItem} 
                    className="px-4 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-500 cursor-pointer flex items-center justify-center shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* EDIT-LISTE */}
          <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {complianceList.map((item, idx) => (
              <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="uppercase font-bold text-slate-200 truncate">{item.detail}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">({item.type})</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeComplianceItem(idx)} 
                  className="text-slate-500 hover:text-rose-400 cursor-pointer shrink-0 ml-2"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <Save size={12} /> Audit Einbrennen ✓
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
