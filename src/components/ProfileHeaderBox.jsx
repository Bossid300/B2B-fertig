import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, X, Shield, Music, Landmark, Briefcase, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { eventService } from '../services/eventService';
import {
  saveProfile,
  getProfilesDb,
  saveCrewRequest
} from '../services/apiService';
import { subscriptionService }
from '../../moduls/subscriptions/subscriptionService';
import { achievementService }
from '../../moduls/achievements/achievementService';


export default function ProfileHeaderBox({ 
  currentProfileName, 
  localFields, 
  isFavorite,
  handleToggleFavorite,
  setView 
}) {
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRequestMaskOpen, setIsRequestMaskOpen] = useState(false);
  const [isSliderMaskOpen, setIsSliderMaskOpen] = useState(false);
  const [myProjects, setMyProjects] = useState([]);
  const [profileData, setProfileData] = useState(null);


  // Eigerer Zustand für das flache Mitschreiben der Ticker-Inputs
  const [tickerFields, setTickerFields] = useState({
    slide1_url: '', slide1_line1: '', slide1_line2: '',
    slide2_url: '', slide2_line1: '', slide2_line2: '',
    slide3_url: '', slide3_line1: '', slide3_line2: '',
    slide4_url: '', slide4_line1: '', slide4_line2: '',
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const isMyOwnProfile = targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();
  const canEditSlider = isMyOwnProfile;

  const activeFields = profileData || localFields || { name: targetUser, role: "Künstler" };
 
  const allEvents =
  eventService.getEvents();

  const currentProfileId =
    profileData?.id ||
    localStorage.getItem('gigsda_profile_id');

  const myCompletedEvents =
    allEvents.filter(
      ev =>
        ev &&
        ev.archived === true &&
        ev.ownerId === currentProfileId
    );

const currentAchievement =
  achievementService.getCurrentAchievement(
    myCompletedEvents
  );


  // 1. DATABASE PIPELINE: Lädt die Profildaten für Fremdprofile & befüllt die Inputs
  useEffect(() => {
    getProfilesDb()
      .then(profiles => {

        const found = profiles.find(
          p =>
            p &&
            (p.name || p.user_name || p.display_name)
              ?.trim()
              .toLowerCase() ===
            targetUser.trim().toLowerCase()
        );

        if (!found) return;

        const profileData =
          found.profile_json
            ? JSON.parse(found.profile_json)
            : {};

        setProfileData({
          ...profileData,
          ...found,
          role: found.role,
          type: found.type
        });

      localStorage.setItem(
        'gigsda_plan',
        found.subscription_plan || 'COMMUNITY'
      );

      })
      .catch(console.error);
      
    
  }, [targetUser, isSliderMaskOpen]);

  // Synchronisiert die Eingabefelder, sobald die Maske geöffnet wird
  useEffect(() => {
    if (isSliderMaskOpen && activeFields) {
      setTickerFields({
        slide1_url: activeFields.slide1_url || '',
        slide1_line1: activeFields.slide1_line1 || '',
        slide1_line2: activeFields.slide1_line2 || '',
        slide2_url: activeFields.slide2_url || '',
        slide2_line1: activeFields.slide2_line1 || '',
        slide2_line2: activeFields.slide2_line2 || '',
        slide3_url: activeFields.slide3_url || '',
        slide3_line1: activeFields.slide3_line1 || '',
        slide3_line2: activeFields.slide3_line2 || '',
        slide4_url: activeFields.slide4_url || '',
        slide4_line1: activeFields.slide4_line1 || '',
        slide4_line2: activeFields.slide4_line2 || '',
      });
    }
  }, [isSliderMaskOpen, profileData]);

  // Lädt die B2B-Projekte für die Anfragemaske
  useEffect(() => {
    if (isRequestMaskOpen) {
      try {

        const savedEvents = eventService.getEvents();

const currentProfileId =
  profileData?.id ||
  localStorage.getItem('gigsda_profile_id');

const myEvents = savedEvents.filter(
  ev =>
    ev &&
    ev.archived !== true &&
    (
      ev.ownerId === currentProfileId ||
      ev.crewIds?.includes(currentProfileId)
    )
);

        setMyProjects(myEvents);

      } catch (e) {
        console.error(e);
      }
    }
}, [isRequestMaskOpen, profileData]);

  const handleTickerChange = (e) => {
    const { name, value } = e.target;
    setTickerFields(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Brennt Daten autark in die DB ein
  const handleTickerSave = async (e) => {
    e.preventDefault();
      try {

        const updatedProfile = {
          ...profileData,
          ...tickerFields
        };

        const result = await saveProfile(
          updatedProfile.id,
          updatedProfile
        );

        setProfileData(updatedProfile);

        alert(
          "Cloud-Ticker erfolgreich in der Gigsda-Datenbank eingebrannt! 💾🔥"
        );

        setIsSliderMaskOpen(false);

      } catch (err) {

        console.error(err);

      }
  };



const submitB2BRequest = async (project) => {
  try {
    const now = Date.now();

    const requesterProfileId =
      profileData?.id ||
      localStorage.getItem('gigsda_profile_id') ||
      '';

    const requesterProfileName =
      profileData?.name ||
      localStorage.getItem('gigsda_user_name') ||
      "Veranstalter";

    const requestedProfileId =
      activeFields?.id || '';

    if (!requestedProfileId) {
      alert("Zielprofil konnte nicht eindeutig geladen werden.");
      return;
    }

    const newRequest = {
      requestId:
        "REQ-" + Math.floor(Math.random() * 9000 + 1000),

      eventId:
        project.id ||
        project.eventId ||
        project._id ||
        '',

      eventName:
        project.title ||
        project.name ||
        "B2B Event",

      date:
        project.date ||
        "Termin folgt",

      requestedProfileId:
        requestedProfileId,

      requestedProfileName:
        activeFields.display_name ||
        activeFields.name ||
        targetUser,

      requestedProfileRole:
        activeFields.role ||
        activeFields.type ||
        activeFields.user_type ||
        "Crew",

      requestedProfileCity:
        activeFields.city ||
        activeFields.ort ||
        "",

      requesterProfileId:
        requesterProfileId,

      requesterProfileName:
        requesterProfileName,

      requesterName:
        requesterProfileName,

      status: "pending",

      source: "profile_direct",

      createdAt: now,
      updatedAt: now,

      note:
        `Direktanfrage über Profil von ${activeFields.display_name || activeFields.name || targetUser}.`
    };

    const saveResult =
      await saveCrewRequest(newRequest);

    const savedEvents = eventService.getEvents();

    const eventIndex = savedEvents.findIndex(ev =>
      ev &&
      (
        ev.id === newRequest.eventId ||
        ev.eventId === newRequest.eventId ||
        ev._id === newRequest.eventId ||
        ev.title === newRequest.eventName ||
        ev.name === newRequest.eventName
      )
    );

    if (eventIndex > -1) {
      if (!savedEvents[eventIndex].crew) {
        savedEvents[eventIndex].crew = [];
      }

      const alreadyInCrew =
        savedEvents[eventIndex].crew.some(
          member =>
            member &&
            member.id === requestedProfileId
        );

      if (!alreadyInCrew) {
        savedEvents[eventIndex].crew.push({
          id: requestedProfileId,
          name: newRequest.requestedProfileName,
          role: newRequest.requestedProfileRole,
          status: "pending",
          city: newRequest.requestedProfileCity,
          addedAt: new Date().toLocaleDateString('de-DE')
        });

        eventService.saveEvents(savedEvents);
      }
    }

    window.dispatchEvent(
      new CustomEvent('request-sent')
    );

    window.dispatchEvent(
      new CustomEvent('route-change')
    );

    alert(
      `B2B-Anfrage an ${newRequest.requestedProfileName} erfolgreich gesendet! ⚡`
    );

    setIsRequestMaskOpen(false);

  } catch (err) {
    console.error(
      "Fehler beim Senden der Profil-Direktanfrage:",
      err
    );
  }
};




  const getRoleBadge = (role) => {
    const cleanRole = role ? role.trim().toLowerCase() : 'künstler';
    if (cleanRole.includes('security')) return { text: 'SECURITY SERVICE', icon: <Shield size={12} className="text-rose-400" />, style: 'border-rose-900/50 bg-rose-950/20 text-rose-400' };
    if (cleanRole.includes('location') || cleanRole.includes('ort')) return { text: 'EVENT LOCATION', icon: <Landmark size={12} className="text-cyan-400" />, style: 'border-cyan-900/50 bg-cyan-950/20 text-cyan-400' };
    if (cleanRole.includes('veranstalter') || cleanRole.includes('business')) return { text: 'PROMOTER SERVICE', icon: <Briefcase size={12} className="text-amber-400" />, style: 'border-amber-900/50 bg-amber-950/20 text-amber-400' };
    if (cleanRole.includes('techniker') || cleanRole.includes('technik')) { return { text: 'TECHNICIAN SERVICE', icon: <Briefcase size={12} className="text-purple-400" />, style: 'border-purple-900/50 bg-purple-950/20 text-purple-400'};}
    if (cleanRole.includes('logistik')) {
    return {
        text: 'LOGISTICS SERVICE',
        icon: <Briefcase size={12} className="text-blue-400" />,
        style:
          'border-blue-900/50 bg-blue-950/20 text-blue-400'
      };
    }

    if (cleanRole.includes('design')) {
      return {
        text: 'DESIGN SERVICE',
        icon: <Briefcase size={12} className="text-violet-400" />,
        style:
          'border-violet-900/50 bg-violet-950/20 text-violet-400'
      };
    }

    if (cleanRole.includes('catering')) {
      return {
        text: 'CATERING SERVICE',
        icon: <Briefcase size={12} className="text-amber-400" />,
        style:
          'border-amber-900/50 bg-amber-950/20 text-amber-400'
      };
    }
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
    <div className="w-full max-w-5xl mx-auto space-y-3 mb-6 text-white select-none font-mono">
      
      {/* CONTROLLER BAR */}
      <div className="w-full bg-slate-950 border border-slate-900 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5">
            <span className="text-lg">
            ⭐
            </span>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-purple-400 tracking-widest uppercase">
              // BACKSTAGE CONTROLLER
            </span>
            <span className="text-white font-black text-xs tracking-wide uppercase">
              GIGSDA BOARD
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-center sm:justify-end">
          <div className="px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-slate-950 text-cyan-300 text-[10px] font-mono uppercase tracking-widest">
          💎 {subscriptionService.getPlan()}
        </div>

        <div className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-slate-950 text-amber-300 text-[10px] font-mono uppercase tracking-widest">
          {currentAchievement.badge}
        </div>

        <button
          type="button"
          onClick={() => setView('billing')}
          className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-slate-950 text-emerald-300 text-[10px] font-mono uppercase tracking-widest hover:border-emerald-400 cursor-pointer"
        >
          📄 BILLING
        </button>


          <button type="button" onClick={() => setIsRequestMaskOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-900/50 text-purple-400 text-[10px] font-mono hover:border-purple-500 transition-all cursor-pointer shadow-md uppercase font-black tracking-wider whitespace-nowrap"><MessageSquare size={10} /> Anfrage</button>
          <button type="button" onClick={handleToggleFavorite} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-mono transition-all cursor-pointer shadow-md uppercase font-black tracking-wider whitespace-nowrap ${isFavorite ? 'bg-amber-950/40 border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'}`}><span>{isFavorite ? '★' : '☆'}</span> {isFavorite ? 'Aktiv' : 'Favorit'}</button>
          <button type="button" onClick={() => { localStorage.setItem('gigsda_current_view', 'crewfavoriten'); if (typeof setView === 'function') { setView('crewfavoriten'); } window.location.reload(); }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-cyan-400 text-[10px] font-mono hover:border-cyan-500 transition-all cursor-pointer shadow-md uppercase font-black tracking-wider whitespace-nowrap">⭐ Pool</button>
          <button type="button" onClick={() => window.history.back()} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-white text-[10px] font-mono hover:border-slate-600 transition-all cursor-pointer uppercase font-black tracking-wider whitespace-nowrap">&lt; Back</button>
        </div>
      </div>

      {/* SLIDER BLOCK */}
      <div className="relative w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative h-[300px] w-full bg-slate-900 group">
          <img src={slides[currentSlide].url} alt="Banner" className="w-full h-full object-cover opacity-60 transition-all duration-500" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none space-y-2">
            <p className="text-cyan-400 text-xs tracking-widest uppercase">// {slides[currentSlide].l1}</p>
            <h1 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase leading-tight">{slides[currentSlide].l2}</h1>
            <h2 className="text-slate-200 text-base font-bold">{activeFields.display_name || activeFields.name || 'UNBENANNTE ENTITÄT'}</h2>
            <div className="pt-1"><div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${badge.style}`}>{badge.icon} {badge.text}</div></div>
          </div>

          <button type="button" onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&lt;</button>
          <button type="button" onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/60 border border-slate-800 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 z-20 cursor-pointer">&gt;</button>

          {canEditSlider && !isSliderMaskOpen && (
            <button type="button" onClick={() => { setIsRequestMaskOpen(false); setIsSliderMaskOpen(true); }} className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400 text-xs hover:border-cyan-500 shadow-lg backdrop-blur-sm z-30 cursor-pointer">✏️ SLIDER EDITIEREN</button>
          )}
        </div>

        {/* B2B ANFRAGEMASKE */}
        {isRequestMaskOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2"><h3 className="text-purple-400 text-xs tracking-widest font-bold uppercase">
              // CREW-REQUISITION PROTOCOL</h3><button type="button" onClick={() => setIsRequestMaskOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button></div>
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/10 border border-purple-900/30 rounded-xl text-xs text-purple-300">Wähle das B2B-Zielprojekt aus, für das du <span className="text-white font-bold">{activeFields.display_name || activeFields.name}</span> anfragen möchtest.</div>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {myProjects.length > 0 ? (myProjects.map((proj, idx) => (
                  <button key={idx} type="button" onClick={() => submitB2BRequest(proj)} className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white hover:border-purple-500 hover:bg-purple-950/10 transition-all cursor-pointer">
                    📐 Projekt: 
                    <span className="text-purple-400 font-bold">{proj.title || proj.name}</span>
                  </button>
                ))) : (<div className="text-slate-500 text-xs">// KEINE AKTIVEN PROJEKTE GEFOUNDEN</div>)}
              </div>
            </div>
          </div>
        )}






        {/* CLOUD-TICKER MASK (DIREKTE, FEHLERFREIE ZUWEISUNG AN tickerFields) */}
        {isSliderMaskOpen && canEditSlider && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md p-6 font-mono text-sm text-slate-300 overflow-y-auto rounded-3xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
              <h3 className="text-cyan-400 text-xs tracking-widest font-bold uppercase">// CLOUD-TICKER CONFIGURATION MASKE</h3>
              <button type="button" onClick={() => setIsSliderMaskOpen(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleTickerSave} className="space-y-4 pb-4">
              {/* SLIDE 1 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 1 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide1_url" placeholder="Bild URL" value={tickerFields.slide1_url || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide1_line1" placeholder="Subline" value={tickerFields.slide1_line1 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide1_line2" placeholder="Headline" value={tickerFields.slide1_line2 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {/* SLIDE 2 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 2 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide2_url" placeholder="Bild URL" value={tickerFields.slide2_url || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide2_line1" placeholder="Subline" value={tickerFields.slide2_line1 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide2_line2" placeholder="Headline" value={tickerFields.slide2_line2 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {/* SLIDE 3 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 3 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide3_url" placeholder="Bild URL" value={tickerFields.slide3_url || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide3_line1" placeholder="Subline" value={tickerFields.slide3_line1 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide3_line2" placeholder="Headline" value={tickerFields.slide3_line2 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              {/* SLIDE 4 */}
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-2">
                <div className="text-cyan-400 text-[9px] tracking-wide font-bold">// SLIDE 4 PARAMETER</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input type="text" name="slide4_url" placeholder="Bild URL" value={tickerFields.slide4_url || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide4_line1" placeholder="Subline" value={tickerFields.slide4_line1 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" name="slide4_line2" placeholder="Headline" value={tickerFields.slide4_line2 || ''} onChange={handleTickerChange} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => setIsSliderMaskOpen(false)} className="px-4 py-2 rounded border border-slate-800 text-slate-400 text-xs uppercase hover:text-white cursor-pointer">Abbrechen</button>
                <button type="submit" className="px-5 py-2 rounded bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider hover:bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] cursor-pointer">Cloud-Ticker einbrennen ✓</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
