import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../services/apiService';

export default function ProfileLokalBox({ currentProfileName, isOwner }) {
  const [profile, setProfile] = useState(null);
  const [dataSize, setDataSize] = useState('0.00 KB');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canManage = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Berechnet reaktiv die Profil-Größe
  useEffect(() => {
    getProfilesDb()
      .then(allProfiles => {
        const found = allProfiles.find(
          p =>
            p &&
            (p.name || p.user_name || p.display_name)
              ?.trim()
              .toLowerCase() ===
            targetUser.trim().toLowerCase()
        );
        if (!found) return;
        const profile =
          found.profile_json
            ? JSON.parse(found.profile_json)
            : found;
        setProfile(profile);
        const strlen =
          JSON.stringify(profile).length;

        setDataSize(
          (strlen / 1024).toFixed(2) + ' KB'
        );
      })
      .catch((e) => {
        console.error(
          "Fehler in der Gigsda Lokal-Pipeline:",
          e
        );
      });
  }, [targetUser]);

  // 2. BACKUP ENGINE: Lädt das Profil als JSON-Datei herunter
  const handleExport = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gigsda_protocol_${targetUser.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 3. RESTORE ENGINE: Liest ein JSON-Backup wieder ein
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      try {
        const importedData =
          JSON.parse(event.target.result);
        const result =
          await saveProfile(
            importedData.id || profile.id,
            importedData
          );
        console.log(
          'LOCAL IMPORT DB ✅',
          result
        );
        setProfile(importedData);
        alert(
          "B2B Profil-Sicherung erfolgreich wiederhergestellt! 💾⚡"
        );
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert(
          "Fehler: Ungültiges Gigsda-Sicherungsprotokoll."
        );
      }
    };
    fileReader.readAsText(file);
  };

  // 4. PURGE ENGINE: Tilgt das Profil restlos aus dem System
  const handlePurge = async () => {
    if (
      !window.confirm(
        'Profil wirklich endgültig löschen?'
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        '/api/deleteProfile.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: profile.id
          })
        }
      );
      const result =
        await response.json();
      console.log(
        'PROFILE DELETE DB ✅',
        result
      );
      alert(
        'Profil erfolgreich gelöscht.'
      );
      localStorage.removeItem(
        'gigsda_profile_id'
      );
      localStorage.removeItem(
        'gigsda_user_name'
      );
      window.location.href = '/';
    } catch (e) {
      console.error(
        'Fehler beim Löschen:',
        e
      );
      alert(
        'Profil konnte nicht gelöscht werden.'
      );
    }
  };

  if (!canManage) return null; // Nur der Inhaber oder Admin sieht das lokale Backup-System!

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4 border-dashed">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-purple-400" />
          <span className="text-xs font-black tracking-widest uppercase">// LOCAL SYSTEM CONTROL & PROTOCOL BACKUP</span>
        </div>
        <div className="text-[10px] text-slate-500 font-bold font-mono">ALLOKATION: {dataSize}</div>
      </div>

      {/* SYSTEM OPERATIONS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* EXPORT BUTTON */}
        <button 
          type="button" 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 p-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs font-bold hover:border-purple-500/50 hover:text-purple-400 transition-all cursor-pointer uppercase tracking-wider"
        >
          <Download size={13} /> Backup Download
        </button>

        {/* IMPORT INPUT */}
        <label className="flex items-center justify-center gap-2 p-3 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs font-bold hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-pointer uppercase tracking-wider text-center">
          <Upload size={13} /> Protokoll Laden
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>

        {/* DELETE SCHRANKE */}
        {!confirmDelete ? (
          <button 
            type="button" 
            onClick={() => setConfirmDelete(true)}
            className="flex items-center justify-center gap-2 p-3 bg-slate-900/10 border border-rose-950/40 text-rose-500/70 rounded-2xl text-xs font-bold hover:bg-rose-950/20 hover:text-rose-400 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Trash2 size={13} /> Profil Löschen
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:col-span-1 border border-rose-500/30 bg-rose-950/10 p-2 rounded-2xl items-center justify-between animate-pulse">
            <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold font-mono uppercase">
              <ShieldAlert size={12} className="shrink-0" /> Sicher v_rnichten?
            </div>
            <div className="flex gap-1.5 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={() => setConfirmDelete(false)} 
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[9px] font-black uppercase cursor-pointer"
              >
                Stop
              </button>
              <button 
                type="button" 
                onClick={handlePurge} 
                className="px-3 py-1 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-[9px] font-black uppercase cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                PROFIL VERNICHTEN 🚨
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
