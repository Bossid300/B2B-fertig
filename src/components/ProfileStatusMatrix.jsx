import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getProfilesDb } from '../services/apiService';

export default function ProfileStatusMatrix({ currentProfileId }) {
  const [score, setScore] = useState(0);
  const [todos, setTodos] = useState([]);


  // 1. ANALYTICS ENGINE: Durchleuchtet das Profil live im LocalStorage
  useEffect(() => {
    getProfilesDb()
      .then(profiles => {
        const found = profiles.find(
          p => p?.id === currentProfileId
        );
        if (!found) return;
        const profile =
          found.profile_json
            ? JSON.parse(found.profile_json)
            : found;
        let currentScore = 0;
        const activeToDos = [];
            // AUDIT 1: Stammdaten-Check (Gewichtung: 20%)
            if (profile.city && profile.phone || profile.category) {
              currentScore += 20;
            } else {
              activeToDos.push("Stammdaten: Kontaktdaten unvollständig");
            }
            // AUDIT 2: Core-Skills & Zertifikate (Gewichtung: 20%)
            if (Array.isArray(profile.skills) && profile.skills.length > 0) {
              currentScore += 20;
            } else {
              activeToDos.push("Skills: Keine Kernkompetenzen hinterlegt");
            }
            // AUDIT 3: B2B-Finanzdaten (Gewichtung: 20%)
            if (profile.company_uid || profile.steuernummer) {
              currentScore += 20;
            } else {
              activeToDos.push("Finanzen: Keine Steuernummer / UID-Zulassung");
            }
            // AUDIT 4: Equipment & Packlisten (Gewichtung: 20%)
            if (Array.isArray(profile.equipment) && profile.equipment.length > 0) {
              currentScore += 20;
            } else {
              activeToDos.push("Inventar: Packliste für Dry-Hire / Einsatz leer");
            }
            // AUDIT 5: Web-Radar & Socials (Gewichtung: 20%)
            if (profile.social_instagram || profile.social_linkedin || profile.social_spotify) {
              currentScore += 20;
            } else {
              activeToDos.push("Socials: Keine B2B-Netzwerkkanäle verknüpft");
            }
            setScore(currentScore);
            setTodos(activeToDos);
        })
        .catch(e => {
          console.error(
            "Fehler im Gigsda Audit-Protokoll:",
            e
          );
        });
  }, [currentProfileId]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-5 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* SCORE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B COMPLIANCE & INTELLIGENCE RADAR</span>
        </div>
        
        {score === 100 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-[10px] font-black tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <ShieldCheck size={11} /> GIGSDA VERIFIED V3.0
          </div>
        ) : (
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            // AUDIT IN PROGRESS...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* LEUCHTENDER LIVE-PROZENTBALKEN */}
        <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-2xl flex flex-col justify-center space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold tracking-wide">
            <span className="text-slate-500 uppercase">// PROFILE MATRIX</span>
            <span className={score === 100 ? "text-emerald-400 font-black" : "text-cyan-400 font-black"}>{score}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.3)] ${score === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* REAKTIVER REPORT OUTLET (TO-DOS) */}
        <div className="md:col-span-2 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl min-h-[64px] flex flex-col justify-center">
          {todos.length > 0 ? (
            <div className="flex items-start gap-2 text-[10px] text-amber-400/80 leading-relaxed font-mono">
              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {todos.map((todo, idx) => (
                  <span key={idx} className="uppercase font-bold tracking-wide">
                    ⚠ {todo}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono font-black uppercase tracking-wider">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Sämtliche Gigsda B2B-Vorgaben vollständig erfüllt. System einsatzbereit!</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
