import React, { useState, useEffect } from 'react';
import { FileText, Plus, X, Save, Eye, EyeOff } from 'lucide-react';

export default function ProfileDokumenteBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDocs, setShowDocs] = useState(true);
  const [docsList, setDocsList] = useState([]);

  // Temporäre Zustände für die Inputs beim Hinzufügen
  const [newDocName, setNewDocName] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [securityLevel, setSecurityLevel] = useState('public');
  const [isCrewMember, setIsCrewMember] = useState(false);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const loggedInUser = localStorage.getItem('gigsda_user_name') || '';
  const canEdit = isOwner || targetUser.toLowerCase() === loggedInUser.toLowerCase();

  // 1. DATABASE & SECURITY PIPELINE: Lädt Dokumente & prüft Crew-Status des Besuchers
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
          setShowDocs(found.show_docs !== false);
          setDocsList(Array.isArray(found.documents) ? found.documents : []);

          // Crew-Check: Ist der Betrachter in irgendeinem Event dieses Profils als "accepted" eingetragen?
          if (loggedInUser && targetUser.toLowerCase() !== loggedInUser.toLowerCase()) {
            const allEvts = JSON.parse(savedEvents);
            const commonEvent = allEvts.find(evt => {
              if (!evt || !Array.isArray(evt.crew)) return false;
              return evt.crew.some(m => 
                m && m.name && m.name.trim().toLowerCase() === loggedInUser.trim().toLowerCase() && 
                (m.status === 'accepted' || m.status === 'confirmed')
              );
            });
            if (commonEvent) setIsCrewMember(true);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Dokumenten-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing, loggedInUser]);

  const addDocument = () => {
    if (!newDocName.trim() || !newDocUrl.trim()) return;
    setDocsList(prev => [
      ...prev,
      {
        name: newDocName.trim(),
        url: newDocUrl.trim(),
        security: securityLevel
      }
    ]);
    setNewDocName('');
    setNewDocUrl('');
  };

  const removeDocument = (indexToRemove) => {
    setDocsList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. SAVE PIPELINE: Brennt die Dokumenten-Matrix permanent in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, documents: docsList, show_docs: showDocs };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Dokumenten- & Rider-Protokoll erfolgreich eingebrannt! 💾📄");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Dokumente:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // DOCUMENT CONTROL CENTER INITIALISIERT...
      </div>
    );
  }

  const isBoxVisible = showDocs || canEdit;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-purple-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B DOCUMENT & RIDER REPOSITORY</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowDocs(!showDocs)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showDocs ? 'text-purple-400 border-purple-500/30 bg-purple-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showDocs ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 text-[10px] font-black tracking-wider uppercase hover:border-purple-500 transition-all cursor-pointer"
            >
              ✏️ Dokumente
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-2">
          {!isBoxVisible ? (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// DOKUMENTENARCHIV VOM INHABER GESPERRT</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docsList.length > 0 ? (
                docsList.map((doc, idx) => {
                  const hasAccess = doc.security === 'public' || canEdit || isCrewMember;
                  if (!hasAccess) return null;

                  return (
                    <a 
                      key={idx} 
                      href={doc.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-3 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center justify-between group hover:border-purple-500/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={14} className="text-purple-400 shrink-0" />
                        <div className="flex flex-col truncate">
                          <span className="text-xs text-white font-bold uppercase tracking-wide truncate group-hover:text-purple-400 transition-all">{doc.name}</span>
                          <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                            {doc.security === 'public' ? '🌐 Öffentlich' : '🔒 Interne Crew'}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="sm:col-span-2 p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// AKTUELL KEINE SPEZIFISCHEN B2B-DOKUMENTE HINTERLEGT</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// NEUES DOKUMENT / TECH-RIDER HINZUFÜGEN</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input 
                type="text" 
                value={newDocName} 
                onChange={(e) => setNewDocName(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono" 
                placeholder="Name (e.g. Bühnenanweisung 2026)" 
              />
              <input 
                type="text" 
                value={newDocUrl} 
                onChange={(e) => setNewDocUrl(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono" 
                placeholder="Datei URL (PDF / Dropbox / Google Drive)" 
              />
              <div className="flex gap-2 w-full">
                <select 
                  value={securityLevel} 
                  onChange={(e) => setSecurityLevel(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono cursor-pointer"
                >
                  <option value="public">🌐 Netzwerk (Öffentlich)</option>
                  <option value="crew">🔒 Nur verifizierte Crew</option>
                </select>
                <button type="button" onClick={addDocument} className="px-4 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 hover:border-purple-500 cursor-pointer flex items-center justify-center shrink-0">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* EDIT-LISTE */}
          <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {docsList.map((doc, idx) => (
              <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="uppercase font-bold text-slate-200 truncate">{doc.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {doc.security === 'public' ? '(🌐 Öffentlich)' : '(🔒 Crew Only)'}
                  </span>
                </div>
                <button type="button" onClick={() => removeDocument(idx)} className="text-slate-500 hover:text-rose-400 cursor-pointer shrink-0 ml-2">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.3)]"><Save size={12} /> Dokumente Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
