import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, X, Shield, Music, Landmark, Briefcase, MessageSquare, Star } from 'lucide-react';

export default function ProfileHeaderBox({ currentProfileName, editSection, setEditSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRequestMaskOpen, setIsRequestMaskOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  
  // Autarke Zustände für Favoriten und Profildaten
  const [profileData, setProfileData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const isMyOwnProfile = targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. AUTARKER DATA-LOADER: Holt sich die Profildaten direkt aus gigsda_profiles
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
            setProfileData(found);
          }
        }
      } catch (e) {
        console.error("Fehler beim Laden des Profils:", e);
      }
    }
  }, [targetUser, editSection]);

  // 2. AUTARKES FAVORITEN-UHRWERK: Liest den Zustand direkt aus gigsda_favorites (Wie von früher vorgesehen!)
  useEffect(() => {
    const savedFavs = localStorage.getItem('gigsda_favorites');
    if (savedFavs) {
      try {
        const favsList = JSON.parse(savedFavs) || [];
        if (Array.isArray(favsList)) {
          // Prüft, ob der Name des Profils (oder ein Objekt mit dem Namen) in den Favoriten existiert
          const foundFav = favsList.some(fav => {
            if (!fav) return false;
            const favName = (typeof fav === 'string' ? fav : fav.name || '').trim().toLowerCase();
            return favName === targetUser.trim().toLowerCase();
          });
          setIsFavorite(foundFav);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [targetUser]);

  // LÄDT DEINE EIGENEN B2B-PROJEKTE FÜR DIE AUSWAHLMASKE
  useEffect(() => {
    if (isRequestMaskOpen) {
      const savedProjects = localStorage.getItem('gigsda_projects');
      if (savedProjects) {
        try { setMyProjects(JSON.parse(savedProjects) || []); } catch (e) { console.error(e); }
      }
    }
  }, [isRequestMaskOpen]);

  // KLICK-HANDLER FÜR DEN AUTARKEN STERN (Brennt die Daten fehlerfrei ein oder löscht sie)
  const handleLocalToggleFavorite = () => {
    const rawFavs = localStorage.getItem('gigsda_favorites');
    let favsList = [];
    try { favsList = rawFavs ? JSON.parse(rawFavs) : []; } catch (e) { favsList = []; }
    if (!Array.isArray(favsList)) favsList = [];

    const currentUserName = profileData?.name || targetUser;

    if (isFavorite) {
      // Entfernen aus gigsda_favorites
      favsList = favsList.filter(fav => {
        if (!fav) return false;
        const favName = typeof fav === 'string' ? fav : fav.name;
        return favName?.trim().toLowerCase() !== currentUserName.trim().toLowerCase();
      });
      setIsFavorite(false);
    } else {
      // Hinzufügen als sauberes B2B-Objekt für deine Tabelle
      favsList.push({
        name: currentUserName,
        role: profileData?.role || profileData?.user_type || "Künstler",
        city: profileData?.city || "Nicht hinterlegt",
        note: profileData?.note || "Gemerktes Profil",
        avatarUrl: profileData?.avatarUrl || ""
      });
      setIsFavorite(true);
    }
    localStorage.setItem('gigsda_favorites', JSON.stringify(favsList));
  };

  // LIVE-AMPEL PROTOKOLL: Schreibt das Profil sofort als "pending" in beide Tabellen!
  const submitB2BRequest = (projectTitle) => {
    if (!projectTitle) return;

    // 1. Lade deine echte Projektdatenbank
    const rawEvents = localStorage.getItem('gigsda_events');
    if (!rawEvents) return;

    try {
      let eventsList = JSON.parse(rawEvents);
      if (!Array.isArray(eventsList)) return;

      // Findet das Projekt unempfindlich gegenüber Groß- und Kleinschreibung
      const targetEvent = eventsList.find(
        evt => evt && evt.title && evt.title.trim().toLowerCase() === projectTitle.trim().toLowerCase()
      );

      if (!targetEvent) return;

      if (!Array.isArray(targetEvent.crew)) {
        targetEvent.crew = [];
      }

      const currentEntityName = activeFields?.display_name || activeFields?.name || targetUser || "Unbekannte Crew";
      const currentLoggedUser = localStorage.getItem('gigsda_user_name') || 'Grober Lackl';

      // Prüfen, ob der Mitarbeiter schon in der Crew dieses Events drinsteckt
      const alreadyInCrew = targetEvent.crew.some(
        member => member && member.name && member.name.trim().toLowerCase() === currentEntityName.trim().toLowerCase()
      );

      if (alreadyInCrew) {
        alert(`${currentEntityName} ist bereits in der Crew-Liste hinterlegt.`);
        setIsRequestMaskOpen(false);
        return;
      }

      // 2. Schreibt den Eintrag SOFORT als "pending" in das Event (Mitarbeiter wird sofort gelistet!)
      targetEvent.crew.push({
        name: currentEntityName,
        role: activeFields?.role || activeFields?.user_type || "Crew",
        status: "pending", // Startet als offene gelbe Anfrage direkt auf dem Dashboard
        city: activeFields?.city || "Nicht hinterlegt",
        addedAt: new Date().toLocaleDateString('de-DE')
      });

      localStorage.setItem('gigsda_events', JSON.stringify(eventsList));

      // 3. Schreibt den Eintrag parallel fehlerfrei in gigsda_crew_requests (MIT REQUESTERNAME)
      const rawRequests = localStorage.getItem('gigsda_crew_requests') || '[]';
      let requestsList = JSON.parse(rawRequests);
      if (Array.isArray(requestsList)) {
        requestsList.push({
          requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          eventName: projectTitle,
          date: new Date().toLocaleDateString('de-DE'),
          requestedProfile: currentEntityName,
          requesterName: currentLoggedUser, // Sichert den Absender, damit die Kette nicht blockiert
          status: 'pending'
        });
        localStorage.setItem('gigsda_crew_requests', JSON.stringify(requestsList));
      }

      alert(`B2B-Crew-Anfrage für '${projectTitle}' erfolgreich übermittelt! 📐`);
      
      // Schließt das lila Overlay lautlos, Seite bleibt taghell stehen
      setIsRequestMaskOpen(false);

      // UI-Schubs: Aktualisiert das CrewRequestCenter live auf dem Bildschirm
      window.dispatchEvent(new Event('storage'));

    } catch (e) {
      console.error("Fehler im Gigsda-Crew-Protokoll:", e);
    }
  };


  // Fallback-Sicherung für die Optik
  const activeFields = profileData || { name: targetUser, role: "Künstler" };

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
      
      {/* ── BACKSTAGE-PORTFOLIO CONTROLLER ── */}
      <div className="w-full bg-slate-950 border border-slate-900 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xl">⭐</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">// BACKSTAGE-PORTFOLIO CONTROLLER</span>
            <span className="text-white font-black text-sm tracking-wide uppercase">GIGSDA ALL-IN-ONE BOARD</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* BUTTON 1: ANFRAGE_SENDEN */}
          <button type="button" onClick={() => setIsRequestMaskOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-900/50 text-purple-400 text-xs font-mono hover:border-purple-500 transition-all cursor-pointer shadow-md"><MessageSquare size={12} /> // ANFRAGE_SENDEN</button>

          {/* BUTTON 2: ZU_FAVORITEN (VÖLLIG AUTARK) */}
          <button 
            type="button"
            onClick={handleLocalToggleFavorite}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-md ${isFavorite ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}
          >
            <span>{isFavorite ? '★' : '☆'}</span> {isFavorite ? 'FAVORIT_AKTIV' : '// ZU_FAVORITEN'}
          </button>

          {/* BUTTON 3: ZURÜCK */}
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

          <button onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&lt;</button>
          <button onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&gt;</button>
        </div>

        {/* ── B2B ANFRAGEMASKE ── */}
        {isRequestMaskOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2"><h3 className="text-purple-400 text-xs tracking-widest font-bold uppercase">// CREW-REQUISITION PROTOCOL</h3><button onClick={() => setIsRequestMaskOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button></div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl text-xs text-purple-300">Wähle das B2B-Zielprojekt aus, für das du <span className="text-white font-bold">{activeFields.display_name || activeFields.name}</span> anfragen möchtest.</div>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {myProjects.length > 0 ? (myProjects.map((proj, idx) => (
                  <button key={idx} onClick={() => submitB2BRequest(proj.title || proj.name)} className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white hover:border-purple-500 hover:bg-purple-950/10 transition-all cursor-pointer">📐 Projekt: <span className="text-purple-400 font-bold">{proj.title || proj.name}</span></button>
                ))) : (<div className="text-slate-500 text-xs">// KEINE AKTIVEN PROJEKTE GEFUNDEN</div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
