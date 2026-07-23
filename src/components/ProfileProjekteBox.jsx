import React, { useState, useEffect } from 'react';
import { Briefcase, Eye, EyeOff, Calendar, Users, CheckCircle } from 'lucide-react';

export default function ProfileProjekteBox({ currentProfileName, isOwner }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(true);
  const [crewCounts, setCrewCounts] = useState({});

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEditPrivacy = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. NESTED CREW PIPELINE: Filtert die Einsätze direkt aus den Event-Objekten!
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
          setShowProjects(found.show_projects !== false);

          // Alle denkbaren Namensvariationen des aktuellen Profils sammeln
          const nameVariations = [
            targetUser.trim().toLowerCase(),
            (found.name || '').trim().toLowerCase(),
            (found.Klarname || '').trim().toLowerCase(),
            (found.project_name || '').trim().toLowerCase()
          ].filter(v => v !== '');

          const allEvents = JSON.parse(savedEvents);
          const joinedProjects = [];
          const counts = {};

          if (Array.isArray(allEvents)) {
            allEvents.forEach(evt => {
              if (!evt) return;

              // Prüft, ob ein Crew-Mitglied im verschachtelten Array zu den Namensvariationen passt
              const hasJoined = Array.isArray(evt.crew) && evt.crew.some(member => 
                member && 
                member.name && 
                nameVariations.includes(member.name.trim().toLowerCase()) &&
                (member.status === 'accepted' || member.status === 'confirmed')
              );

              const isProjectOwner =
                evt.ownerId &&
                found.id &&
                evt.ownerId === found.id;

              // Falls der User Teil der Crew ist, pushen wir das Event als verifizierte Referenz!
              if (hasJoined || isProjectOwner) {
                joinedProjects.push(evt);

                const totalAcceptedCrew =
                  Array.isArray(evt.crew)
                    ? evt.crew.filter(m =>
                        m &&
                        (m.status === 'accepted' || m.status === 'confirmed')
                      ).length
                    : 0;

                counts[evt.id || evt.title] = totalAcceptedCrew;
              }
            });
          }

          setProjects(joinedProjects);
          setCrewCounts(counts);
        }
      } catch (e) {
        console.error("Fehler in der Gigsda B2B-Projekt-Pipeline:", e);
      }
    }
  }, [targetUser]);

  const toggleProjectPrivacy = () => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;
    try {
      let allProfiles = JSON.parse(savedProfiles);
      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, show_projects: !showProjects };
        }
        return p;
      });
      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      setShowProjects(!showProjects);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // EVENT REFERENZ REGISTER INITIALISIERT...
      </div>
    );
  }

  const isVisible = showProjects || canEditPrivacy;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-purple-400" />
          <span className="text-xs font-black tracking-widest uppercase">// MY B2B CREW-ENGAGEMENTS & REFERENZEN</span>
        </div>
        
        {canEditPrivacy && (
          <button 
            type="button" 
            onClick={toggleProjectPrivacy}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showProjects ? 'text-purple-400 border-purple-500/30 bg-purple-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
          >
            {showProjects ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        )}
      </div>

      {/* TIMELINE LISTE */}
      {!isVisible ? (
        <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// PROJEKTMATRIZ VOM PROTOKOLL-INHABER GESPERRT (NDA)</div>
      ) : (
        <div className="space-y-2.5">
          {projects.length > 0 ? (
            projects.map((prj, idx) => {
              const currentCount = crewCounts[prj.id || prj.title] || 0;
              return (
                <div key={idx} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:border-purple-500/50 transition-all">
                      <CheckCircle size={14} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs text-white font-black uppercase tracking-wide truncate">{prj.title || 'Unbenanntes Event'}</span>
                      <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono mt-0.5">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {prj.date || 'Termin offen'}</span>
                        <span className="flex items-center gap-1 uppercase text-emerald-400 font-bold"><Briefcase size={10} /> VERIFIZIERTER JOB ✓</span>
                      </div>
                    </div>
                  </div>

                  {/* GESAMT CREW AUF DIESEM EVENT */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-900/60 text-[10px] font-mono text-slate-400 self-start sm:self-center">
                    <Users size={11} className="text-purple-400" />
                    <span>Gesamt-Crew: <strong className="text-white font-black">{currentCount}x</strong> vor Ort</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// AKTUELL BEI KEINEN AKTIVEN B2B-PROJEKTEN ALS CREW GEBUCHT</div>
          )}
        </div>
      )}

    </div>
  );
}
