import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, X, Shield, Music, Landmark, Briefcase, MessageSquare } from 'lucide-react';

export default function ProfileHeaderBox({ currentProfileName, editSection, setEditSection, localFields, handleInplaceChange, handleInplaceSave, isFavorite, handleToggleFavorite, setView, onNavigateToStep }) {
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRequestMaskOpen, setIsRequestMaskOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const isMyOwnProfile = targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();
  const canEditSlider = isMyOwnProfile;

  // Lädt die Profildaten für Fremdprofile
  useEffect(() => {
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (savedProfiles) {
      try {
        const allProfiles = JSON.parse(savedProfiles);
        if (Array.isArray(allProfiles)) {
          const found = allProfiles.find(
            p => p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()
          );
          if (found) setProfileData(found);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [targetUser]);

  // Lädt die B2B-Projekte für die Anfragemaske
  useEffect(() => {
    if (isRequestMaskOpen) {
      const savedProjects = localStorage.getItem('gigsda_projects');
      if (savedProjects) {
        try { setMyProjects(JSON.parse(savedProjects) || []); } catch (e) { console.error(e); }
      }
    }
  }, [isRequestMaskOpen]);

  // B2B Anfragen absenden
  const submitB2BRequest = (projectTitle) => {
    if (!projectTitle) return;
    const rawRequests = localStorage.getItem('gigsda_crew_requests') || '[]';
    try {
      let requestsList = JSON.parse(rawRequests);
      if (!Array.isArray(requestsList)) requestsList = [];
      const newRequestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const currentEntityName = activeFields?.display_name || activeFields?.name || targetUser;
      const currentLoggedUser = localStorage.getItem('gigsda_user_name') || 'Grober Lackl';

      requestsList.push({
        requestId: newRequestId,
        eventName: projectTitle,
        date: "25.9.2026",
        requestedProfile: currentEntityName,
        requesterName: currentLoggedUser,
        status: 'pending'
      });

      localStorage.setItem('gigsda_crew_requests', JSON.stringify(requestsList));
      alert(`B2B-Crew-Anfrage für '${projectTitle}' erfolgreich übermittelt! 📐`);
      setIsRequestMaskOpen(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  const activeFields = profileData || localFields || { name: targetUser, role: "Künstler" };

  const getRoleBadge = (role) => {
    const cleanRole = role ? role.trim().toLowerCase() : 'künstler';
    if (cleanRole.includes('security')) return { text: 'SECURITY SERVICE', icon: <Shield size={12} className="text-rose-400" />, style: 'border-rose-900/50 bg-rose-950/20 text-rose-400' };
    if (cleanRole.includes('location') || cleanRole.includes('ort')) return { text: 'EVENT LOCATION', icon: <Landmark size={12} className="text-cyan-400" />, style: 'border-cyan-900/50 bg-cyan-950/20 text-cyan-400' };
    if (cleanRole.includes('veranstalter') || cleanRole.includes('business')) return { text: 'PROMOTER SERVICE', icon: <Briefcase size={12} className="text-amber-400" />, style: 'border-amber-900/50 bg-amber-950/20 text-amber-400' };
    return { text: 'ARTIST MEMBERSHIP', icon: <Music size={12} className="text-emerald-400" />, style: 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400' };
  };

  const badge = getRoleBadge(activeFields.role || activeFields.user_type);
  
  const slides = [
    { url: activeFields.slide1_url || 'https://unsplash.com', l1: activeFields.slide1_line1 || 'WILLKOMMEN AUF MEINEM PROFIL', l2: activeFields.slide1_line2 || 'GIGSDA LIVE PROTOCOL 2026' },
    { url: activeFields.slide2_url || 'https://unsplash.com', l1: activeFields.slide2_line1 || 'LIVE IMPRESSIONEN', l2: activeFields.slide2_line2 || 'FESTIVAL TOURNEE 2026' },
    { url: activeFields.slide3_url || 'https://unsplash.com', l1: activeFields.slide3_line1 || 'BOOKING & ANFRAGEN', l2: activeFields.slide3_line2 || 'JETZT TERMIN SICHERN' },
    { url: activeFields.slide4_url || 'https://unsplash.com', l1: activeFields.slide4_line1 || 'NEXT GIGS', l2: activeFields.slide4_line2 || 'CHECK DEN EVENT RADAR' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3 mb-6 text-white select-none">
      
      {/* CONTROLLER BAR */}
      <div className="w-full bg-slate-950 border border-slate-900 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl">⭐</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <span className="text-white font-black text-sm tracking-wide uppercase">GIGSDA ALL-IN-ONE BOARD</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsRequestMaskOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-900/50 text-purple-400 text-xs font-mono hover:border-purple-500 transition-all cursor-pointer shadow-md"><MessageSquare size={12} /> // ANFRAGE_SENDEN</button>
          <button type="button" onClick={handleToggleFavorite} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-md ${isFavorite ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}><span>{isFavorite ? '★' : '☆'}</span> {isFavorite ? 'FAVORIT_AKTIV' : '// ZU_FAVORITEN'}</button>

          {/* BUTTON: ZUM FAVORITEN-POOL (GLOBALER DIREKT-TRIGGER – UNKAPUTTBAR!) */}
          <button 
            type="button" 
            onClick={() => {
              console.log("📡 Globaler Direkt-Push -> Schalte um auf crewfavoriten...");
              
              // 1. Schreibt die Ansicht direkt in den LocalStorage, damit das System sie beim Laden kennt
              localStorage.setItem('gigsda_current_view', 'crewfavoriten');
              
              // 2. Falls ein lokales setView da ist, nutzen wir es als Anschubser
              if (typeof setView === 'function') {
                setView('crewfavoriten');
              }
              
              // 3. DER UNBESTECHLICHE REFRESH: Zwingt deine App.jsx (Zeile 508), das Profil sofort 
              // auszublenden und deine CrewFavoritenListe taghell auf den Bildschirm zu brennen!
              window.location.reload();
            }} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-cyan-400 text-xs font-mono hover:border-cyan-500 transition-all cursor-pointer shadow-md"
          >
            ⭐ ZUM FAVORITEN-POOL
          </button>



          <button type="button" onClick={() => window.history.back()} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-xs font-mono cursor-pointer">&lt; Zurück</button>
        </div>
      </div>

      {/* SLIDER BLOCK */}
      <div className="relative w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-[350px] w-full bg-slate-900 group">
          <img src={slides[currentSlide].url} alt="Banner" className="w-full h-full object-cover opacity-60 transition-all duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none space-y-2">
            <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase">// {slides[currentSlide].l1}</p>
            <h1 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase leading-tight">{slides[currentSlide].l2}</h1>
            <h2 className="text-slate-200 font-mono text-base font-bold">{activeFields.display_name || activeFields.name || 'UNBENANNTE ENTITÄT'}</h2>
            <div className="pt-1"><div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-[10px] font-mono font-bold uppercase tracking-wider ${badge.style}`}>{badge.icon} {badge.text}</div></div>
          </div>

          <button type="button" onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&lt;</button>
          <button type="button" onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&gt;</button>

          {/* SLIDER EDITIEREN BUTTON (DER UNKAPUTTBARE MASTER-TRIGGER) */}
          {canEditSlider && (
            <button 
              type="button"
              onClick={() => {
                // 1. Schließt radikal die lila Maske, um die Bahn frei zu machen
                setIsRequestMaskOpen(false);
                
                // 2. Öffnet die Ticker-Konfiguration ohne Verzögerung
                if (typeof setEditSection === 'function') {
                  setEditSection('slider');
                }
              }} 
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400 text-xs font-mono hover:border-cyan-500 shadow-lg backdrop-blur-sm z-30 cursor-pointer"
            >
              ✏️ SLIDER EDITIEREN
            </button>
          )}
        </div>

        {/* B2B ANFRAGEMASKE */}
        {isRequestMaskOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2"><h3 className="text-purple-400 text-xs tracking-widest font-bold uppercase">// CREW-REQUISITION PROTOCOL</h3><button type="button" onClick={() => setIsRequestMaskOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button></div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl text-xs text-purple-300">Wähle das B2B-Zielprojekt aus, für das du <span className="text-white font-bold">{activeFields.display_name || activeFields.name}</span> anfragen möchtest.</div>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {myProjects.length > 0 ? (myProjects.map((proj, idx) => (
                  <button key={idx} type="button" onClick={() => submitB2BRequest(proj.title || proj.name)} className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white hover:border-purple-500 hover:bg-purple-950/10 transition-all cursor-pointer">📐 Projekt: <span className="text-purple-400 font-bold">{proj.title || proj.name}</span></button>
                ))) : (<div className="text-slate-500 text-xs">// KEINE AKTIVEN PROJEKTE GEFUNDEN</div>)}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. CLOUD-TICKER CONFIGURATION MASKE (ENDGÜLTIG BEFREIT) ── */}
        {editSection === 'slider' && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
              <h3 className="text-cyan-400 text-xs tracking-widest font-bold uppercase">// CLOUD-TICKER CONFIGURATION MASKE</h3>
              <button type="button" onClick={() => { if (typeof setEditSection === 'function') setEditSection(null); }} className="text-slate-500 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (handleInplaceSave) handleInplaceSave(); }} className="space-y-4 pb-4">
              
              {/* SLIDE 1 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 1 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide1_url" placeholder="Bild URL" value={localFields?.slide1_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide1_line1" placeholder="Subline" value={localFields?.slide1_line1 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide1_line2" placeholder="Headline" value={localFields?.slide1_line2 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                </div>
              </div>

              {/* SLIDE 2 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 2 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide2_url" placeholder="Bild URL" value={localFields?.slide2_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide2_line1" placeholder="Subline" value={localFields?.slide2_line1 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide2_line2" placeholder="Headline" value={localFields?.slide2_line2 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                </div>
              </div>

              {/* SLIDE 3 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 3 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide3_url" placeholder="Bild URL" value={localFields?.slide3_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide3_line1" placeholder="Subline" value={localFields?.slide3_line1 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide3_line2" placeholder="Headline" value={localFields?.slide3_line2 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                </div>
              </div>

              {/* SLIDE 4 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 4 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide4_url" placeholder="Bild URL" value={localFields?.slide4_url || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide4_line1" placeholder="Subline" value={localFields?.slide4_line1 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                  <input type="text" name="slide4_line2" placeholder="Headline" value={localFields?.slide4_line2 || ''} onChange={handleInplaceChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { if (typeof setEditSection === 'function') setEditSection(null); }} className="px-4 py-2 rounded border border-slate-800 text-slate-400 text-xs uppercase hover:text-white cursor-pointer">Abbrechen</button>
                <button type="submit" className="px-5 py-2 rounded bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer">Cloud-Ticker einbrennen ✓</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
