import React, { useState, useEffect } from 'react';
import { Star, Save, Eye, EyeOff, CheckCircle2, User, AlertTriangle } from 'lucide-react';

export default function ProfileBewertungsBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showReviews, setShowReviews] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);
  
  // Zustände für das Schreiben einer neuen Bewertung
  const [canReview, setCanReview] = useState(false);
  const [connectedProject, setConnectedProject] = useState('');
  const [newStars, setNewStars] = useState(5);
  const [newText, setNewText] = useState('');

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const loggedInUser = localStorage.getItem('gigsda_user_name') || '';
  const canEditPrivacy = isOwner || targetUser.toLowerCase() === loggedInUser.toLowerCase();

  // 1. DATABASE & SECURITY PIPELINE: Prüft Zusammenarbeit & verhindert Doppel-Bewertungen
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
          setShowReviews(found.show_reviews !== false);
          
          const existingReviews = Array.isArray(found.reviews) ? found.reviews : [];
          setReviewsList(existingReviews);

          // SECURITY CHECK: Haben loggedInUser und targetUser zusammen gearbeitet?
          if (loggedInUser && targetUser.toLowerCase() !== loggedInUser.toLowerCase()) {
            const allEvts = JSON.parse(savedEvents);
            
            // Findet ein gemeinsames Event
            const commonEvent = allEvts.find(evt => {
              if (!evt || !Array.isArray(evt.crew)) return false;
              const namesInCrew = evt.crew.map(m => m && m.name ? m.name.trim().toLowerCase() : '');
              return namesInCrew.includes(loggedInUser.trim().toLowerCase()) && namesInCrew.includes(targetUser.trim().toLowerCase());
            });

            if (commonEvent) {
              const eventTitle = commonEvent.title || 'Gemeinsames Projekt';
              
              // SPAM-SCHUTZ: Prüft, ob loggedInUser DIESES Event bereits für das Profil bewertet hat!
              const alreadyReviewedThisEvent = existingReviews.some(rev => 
                rev && rev.from?.toLowerCase() === loggedInUser.toLowerCase() && rev.project?.toLowerCase() === eventTitle.toLowerCase()
              );

              if (!alreadyReviewedThisEvent) {
                setCanReview(true);
                setConnectedProject(eventTitle);
              } else {
                setCanReview(false); // Bereits bewertet!
              }
            }
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Bewertungs-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing, loggedInUser]);

  // 2. SAVE PIPELINE: Brennt die Bewertung permanent ein
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newText.trim() || !connectedProject) return;

    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      
      const newReviewObject = {
        from: loggedInUser,
        project: connectedProject,
        stars: Number(newStars),
        text: newText.trim(),
        date: new Date().toLocaleDateString('de-DE')
      };

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          const existing = Array.isArray(p.reviews) ? p.reviews : [];
          return { ...p, reviews: [newReviewObject, ...existing] };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Rezension erfolgreich im Gigsda-Protokoll eingebrannt! 💾⭐");
      setNewText('');
      setCanReview(false); 
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReviewsPrivacy = () => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;
    try {
      let allProfiles = JSON.parse(savedProfiles);
      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { ...p, show_reviews: !showReviews };
        }
        return p;
      });
      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      setShowReviews(!showReviews);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // FEEDBACK INDEX RECORD DETECTING...
      </div>
    );
  }

  const isVisible = showReviews || canEditPrivacy;
  const averageStars = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, r) => acc + r.stars, 0) / reviewsList.length).toFixed(1) 
    : '0.0';

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B CREDIBILITY & REVIEWS ({averageStars} ⭐)</span>
        </div>
        
        {canEditPrivacy && (
          <button 
            type="button" 
            onClick={toggleReviewsPrivacy}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showReviews ? 'text-amber-400 border-amber-500/30 bg-amber-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
          >
            {showReviews ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        )}
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-4">
          
          {/* VERIFIZIERUNGS BALKEN */}
          {canReview && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>B2B-Kooperation verifiziert bei: <strong className="text-white uppercase font-black">{connectedProject}</strong>!</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-[10px] font-black tracking-wider uppercase hover:bg-emerald-400 transition-all cursor-pointer shrink-0"
              >
                ★ Jetzt Bewerten
              </button>
            </div>
          )}

          {/* REZENSIONEN LISTE (BEGRENZT AUF DIE NEUESTEN 3) */}
          {!isVisible ? (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// REZENSIONEN VOM INHABER AUSGEBLENDET</div>
          ) : (
            <div className="space-y-2.5">
              {reviewsList.length > 0 ? (
                reviewsList.slice(0, 3).map((rev, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-2 hover:border-amber-500/20 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-900/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400"><User size={10} /></div>
                        <span className="text-[10px] text-white font-black uppercase tracking-wide">{rev.from}</span>
                        <span className="text-[8px] text-slate-500 font-mono">// PROJEKT: {rev.project}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={i < rev.stars ? "text-amber-400 fill-amber-400" : "text-slate-800"} />
                        ))}
                        <span className="text-[9px] text-slate-500 font-mono ml-1.5">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-7 italic">"{rev.text}"</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// NOCH KEINE GEWERBLICHEN REZENSIONEN VORHANDEN</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// B2B LEISTUNGSBEWERTUNG AUSSTELLEN</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// STERNEN RATIO</span>
                <select value={newStars} onChange={(e) => setNewStars(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono cursor-pointer">
                  <option value="5">⭐⭐⭐⭐⭐ 5/5 - Spitzenklasse</option>
                  <option value="4">⭐⭐⭐⭐ 4/5 - Zuverlässig</option>
                  <option value="3">⭐⭐⭐ 3/5 - Zufriedenstellend</option>
                  <option value="2">⭐⭐ 2/5 - Mängel im Ablauf</option>
                  <option value="1">⭐ 1/5 - B2B-Warnung</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// REZENSIONSTEXT (PERFORMANCE)</span>
                <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="Arbeitsqualität, Pünktlichkeit, Zuverlässigkeit..." required />
              </div>
            </div>
          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]"><Save size={12} /> Bewertung Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
