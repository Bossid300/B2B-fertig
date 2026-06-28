import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, X, Save, Eye, EyeOff, Award } from 'lucide-react';

export default function ProfileSkillBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showSkills, setShowSkills] = useState(true);
  const [showCertificates, setShowCertificates] = useState(true);

  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Skills & Zertifikate live aus der DB
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
            setSkills(Array.isArray(found.skills) ? found.skills : (found.skills ? found.skills.split(',').map(s => s.trim()) : []));
            setCertificates(Array.isArray(found.certificates) ? found.certificates : (found.certificates ? found.certificates.split(',').map(c => c.trim()) : []));
            setShowSkills(found.show_skills !== false);
            setShowCertificates(found.show_certificates !== false);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Skill-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const addCert = () => {
    if (!newCert.trim()) return;
    if (!certificates.includes(newCert.trim())) {
      setCertificates(prev => [...prev, newCert.trim()]);
    }
    setNewCert('');
  };

  const removeSkill = (indexToRemove) => {
    setSkills(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeCert = (indexToRemove) => {
    setCertificates(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. SAVE PIPELINE: Sichert die Änderungen
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
            skills, 
            certificates,
            show_skills: showSkills,
            show_certificates: showCertificates
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("Skills & Qualifikations-Protokoll erfolgreich eingebrannt! 💾🔒");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Skills:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // QUALIFIKATIONS-REGISTRY STARTET...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Award size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase">// SKILLS & CERTIFICATES MATRIX</span>
        </div>
        
        {canEdit && !isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all cursor-pointer"
          >
            ✏️ Bearbeiten
          </button>
        )}
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SKILLS DISPLAY */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">// CORE SKILLS</span>
              {canEdit && (showSkills ? <Eye size={12} className="text-cyan-500/50" /> : <EyeOff size={12} className="text-slate-700" />)}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.length > 0 ? (
                skills.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 text-slate-300 rounded-md font-bold uppercase tracking-wide">
                    ⚡ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-600 font-mono">// KEINE SKILLS HINTERLEGT</span>
              )}
            </div>
          </div>

          {/* CERTIFICATES DISPLAY */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">// BEHÖRDLICHE NACHWEISE</span>
              {canEdit && (showCertificates ? <Eye size={12} className="text-cyan-500/50" /> : <EyeOff size={12} className="text-slate-700" />)}
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              {certificates.length > 0 ? (
                certificates.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-cyan-400">
                    <ShieldAlert size={12} className="text-cyan-500/70" />
                    <span className="font-bold tracking-wide uppercase">{c}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-600 font-mono">// KEINE ZERTIFIKATE HINTERLEGT</span>
              )}
            </div>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SKILLS FORMULAR */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">// CORE SKILLS VERWALTEN</span>
                <button 
                  type="button" 
                  onClick={() => setShowSkills(!showSkills)} 
                  className={`p-1 rounded border transition-all cursor-pointer ${showSkills ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-600 border-slate-800'}`}
                >
                  {showSkills ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" 
                  placeholder="e.g. Lichtmischpult / FOH / Ersthelfer" 
                />
                <button type="button" onClick={addSkill} className="px-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 cursor-pointer"><Plus size={14} /></button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 max-h-[120px] overflow-y-auto pr-1">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1 px-2 py-1 text-[10px] bg-slate-900 border border-cyan-900/30 text-slate-200 rounded-md font-bold uppercase">
                    <span>{s}</span>
                    <button type="button" onClick={() => removeSkill(idx)} className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"><X size={10} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATES FORMULAR */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">// NACHWEISE VERWALTEN</span>
                <button 
                  type="button" 
                  onClick={() => setShowCertificates(!showCertificates)} 
                  className={`p-1 rounded border transition-all cursor-pointer ${showCertificates ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-600 border-slate-800'}`}
                >
                  {showCertificates ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>

              {/* Input-Zeile */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCert} 
                  onChange={(e) => setNewCert(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" 
                  placeholder="e.g. Staplerschein / BGV-C1 / IPAF" 
                />
                <button type="button" onClick={addCert} className="px-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 cursor-pointer"><Plus size={14} /></button>
              </div>

              {/* Liste beim Editieren */}
              <div className="flex flex-col gap-1.5 pt-1 max-h-[120px] overflow-y-auto pr-1">
                {certificates.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert size={12} className="text-cyan-500/40" />
                      <span className="uppercase font-bold tracking-wide">{c}</span>
                    </div>
                    <button type="button" onClick={() => removeCert(idx)} className="text-slate-500 hover:text-rose-400 cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

          </div> {/* Schließt das zweispaltige Grid (grid-cols-1 md:grid-cols-2) für Skills & Zertifikate exakt ab! */}

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Save size={12} /> Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
