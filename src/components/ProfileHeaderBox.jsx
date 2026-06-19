import React, { useState, useEffect } from 'react';
import { Pencil, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Wir nehmen hier oben NUR noch den Namen des Profils entgegen, das gerade angezeigt wird!
const ProfileHeaderBox = ({ currentProfileName }) => {

  // 1. DYNAMISCHER FINDER: Holt sich die Daten des aktuellen Users aus gigsda_profiles
  const [sliderData, setSliderData] = useState(() => {
    try {
      // Wenn currentProfileName übergeben wurde, nutzen wir ihn. Wenn nicht, den eingeloggten User.
      const activeName = currentProfileName || localStorage.getItem('gigsda_user_name');
      const allProfilesSaved = localStorage.getItem('gigsda_profiles');
      
      if (allProfilesSaved && activeName) {
        const profiles = JSON.parse(allProfilesSaved);
        // Findet exakt das Profil, das die Weiche gerade geladen hat
        const currentProfile = profiles.find(p => p.name === activeName);
        
        if (currentProfile) {
          return {
            headline: currentProfile.slide1_headline || currentProfile.name || 'FESTIVAL SETUP',
            subheadline: currentProfile.city || 'REALTIME PORTFOLIO STREAM',
            location: currentProfile.city || 'BRAUNAU',
            feature: currentProfile.highlight || 'LIVE CONFIG ACTIVE',
            images: [
              currentProfile.slide1_url || '',
              currentProfile.slide2_url || '',
              currentProfile.slide3_url || '',
              currentProfile.slide4_url || ''
            ].filter(Boolean) // Entfernt leere URLs
          };
        }
      }
    } catch (e) {
      console.error("Fehler im Slider-Finder:", e);
    }
    // Fallback falls nichts gefunden wird
    return { headline: 'GIGSDA USER', subheadline: 'STREAM', location: 'GIGSDA', feature: 'ACTIVE', images: [] };
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditingSlider, setIsEditingSlider] = useState(false);
  const [editSliderData, setEditSliderData] = useState({ ...sliderData });

  // Bestimmt vollautomatisch, ob der Betrachter auch der Besitzer ist (für den Edit-Button)
  const isOwnProfile = !currentProfileName || currentProfileName === localStorage.getItem('gigsda_user_name');

  // Automatische Diashow (alle 6 Sekunden)
  useEffect(() => {
    if (isEditingSlider) return;
    const interval = setInterval(() => {
      if (sliderData.images?.length > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % sliderData.images.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isEditingSlider, sliderData.images]);

  // Handler für Änderungen in den Inputs
  const handleSliderInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newImages = [...editSliderData.images];
      newImages[index] = value;
      setEditSliderData({ ...editSliderData, images: newImages });
    } else {
      setEditSliderData({ ...editSliderData, [name]: value });
    }
  };

  // Speichert die geänderten Daten direkt im richtigen Profil der Datenbank
  const saveSliderData = (e) => {
    e.preventDefault();
    try {
      const activeName = currentProfileName || localStorage.getItem('gigsda_user_name');
      const allProfilesSaved = localStorage.getItem('gigsda_profiles');
      
      if (allProfilesSaved && activeName) {
        const profiles = JSON.parse(allProfilesSaved);
        const profileIndex = profiles.findIndex(p => p.name === activeName);
        
        if (profileIndex !== -1) {
          // Schreibt es direkt in die flachen Felder deines originalen DB-Objekts
          profiles[profileIndex].slide1_url = editSliderData.images[0] || '';
          profiles[profileIndex].slide2_url = editSliderData.images[1] || '';
          profiles[profileIndex].slide3_url = editSliderData.images[2] || '';
          profiles[profileIndex].slide4_url = editSliderData.images[3] || '';
          
          profiles[profileIndex].slide1_headline = editSliderData.headline || '';
          profiles[profileIndex].city = editSliderData.location || '';
          profiles[profileIndex].subheadline = editSliderData.subheadline || '';

          localStorage.setItem('gigsda_profiles', JSON.stringify(profiles));
          setSliderData({ ...editSliderData });
          setIsEditingSlider(false);
          console.log("Erfolgreich im Profil gespeichert!");
        }
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pt-6 select-none block clear-both">
      {/* GIGSDA ALL-IN-ONE BOARD */}
      <div className="bg-[#0d0a14] border border-gray-800 rounded-3xl p-6 flex justify-between items-center mb-6 shadow-lg">
        <div>
          <p className="text-purple-500 font-mono text-xs tracking-widest uppercase mb-1">// Backstage-Portfolio Controller</p>
          <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-wide uppercase">
            <span className="text-yellow-400 text-lg">⭐</span> GIGSDA ALL-IN-ONE BOARD
          </h1>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="bg-[#08060c] border border-gray-800 text-gray-300 px-5 py-2 rounded-2xl text-sm font-bold tracking-wide hover:bg-purple-950/20 hover:border-purple-500/50 transition-all duration-300 shadow-md flex items-center gap-2"
        >
          &lt; Dashboard
        </button>
      </div>

      {/* MAIN BACKGROUND IMAGE SLIDER CONTAINER */}
      <div className="relative w-full h-[300px] bg-[#0d0a14] rounded-[32px] overflow-hidden shadow-2xl border border-gray-800 group">
        {sliderData.images && sliderData.images.length > 0 ? (
          <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out">
            <img
              src={sliderData.images[currentImageIndex]}
              alt="Slider"
              className="w-full h-full object-cover opacity-60 transition-all duration-700 scale-100 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050307] via-transparent to-[#050307]/50" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 to-black flex items-center justify-center">
            <p className="text-gray-500 font-mono text-sm">Keine Slider-Bilder hinterlegt</p>
          </div>
        )}

        {/* Pfeile */}
        <button onClick={() => setCurrentImageIndex((p) => (p - 1 + sliderData.images.length) % sliderData.images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-purple-600/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"><ChevronLeft size={20} /></button>
        <button onClick={() => setCurrentImageIndex((p) => (p + 1) % sliderData.images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-purple-600/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"><ChevronRight size={20} /></button>

        {/* EDIT BUTTON: Nur sichtbar wenn man der Besitzer ist */}
        {isOwnProfile && (
          <button onClick={() => { setEditSliderData({ ...sliderData }); setIsEditingSlider(!isEditingSlider); }} className="absolute top-6 right-6 bg-black/60 hover:bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-mono tracking-widest uppercase flex items-center gap-2 z-10 transition-all border border-white/10">
            <Pencil size={12} /> {isEditingSlider ? 'Schließen' : 'Edit Slider'}
          </button>
        )}
      {/* ========================================================================= */}
      {/* ⚙️ INPLACE EDIT-MASK: VOLLSTÄNDIGE MATRIX FÜR ALLE 4 CLOUD-SLIDES         */}
      {/* ========================================================================= */}
        {editSection === 'slider' && isMyOwnProfile && (

        <div className="bg-slate-950 border border-slate-900 p-4 rounded-3xl space-y-3 animate-fade-in print:hidden">
          <div className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">// CLOUD-BANNER TEXT & MEDIEN KONFIGURATION (VOLLSTÄNDIG)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CONFIG SLIDE 1 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 1 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide1_line1" value={localFields.slide1_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. FESTIVAL SETUP" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide1_line2" value={localFields.slide1_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. ZUVERLÄSSIGE SYSTEMTECHNIK" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide1_url" value={localFields.slide1_url || ''} onChange={handleInplaceChange} placeholder="https://unsplash.com... oder Cloud-Link" className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 2 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 2 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide2_line1" value={localFields.slide2_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. LIVE-PRODUKTION" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide2_line2" value={localFields.slide2_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. GROSSBÜHNEN & LICHT-DESIGN" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide2_url" value={localFields.slide2_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 3 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 3 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide3_line1" value={localFields.slide3_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. GALA & CLUB-BETREUUNG" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide3_line2" value={localFields.slide3_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. PERFEKTER SOUND & ATMOSPHÄRE" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide3_url" value={localFields.slide3_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

            {/* CONFIG SLIDE 4 */}
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-950 space-y-2">
              <span className="text-cyan-400 text-[8px] font-black block">// SLIDE 4 CONFIGURATION</span>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Fette Hauptüberschrift</label>
                <input type="text" name="slide4_line1" value={localFields.slide4_line1 || ''} onChange={handleInplaceChange} placeholder="z.B. FESTIVAL SETUP" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-slate-500 uppercase block">Unterüberschrift (Cyan)</label>
                <input type="text" name="slide4_line2" value={localFields.slide4_line2 || ''} onChange={handleInplaceChange} placeholder="z.B. ZUVERLÄSSIGE SYSTEMTECHNIK" className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-white text-[11px]" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] text-purple-400 uppercase block font-bold">Externe Internet-Bild URL</label>
                <input type="text" name="slide4_url" value={localFields.slide4_url || ''} onChange={handleInplaceChange} placeholder="https://..." className="w-full bg-slate-950 border border-purple-500/20 rounded-lg px-2.5 py-1 text-purple-300 text-[11px]" />
              </div>
            </div>

          </div>
          <button type="button" onClick={handleInplaceSave} className="w-full bg-amber-400 text-slate-950 font-black h-8 rounded-xl uppercase tracking-wider text-[10px] cursor-pointer shadow-md transition-transform hover:scale-[1.005]">Cloud-Ticker einbrennen ✓</button>
        </div>
      )}

        {/* Text-Overlays unten links */}
        <div className="absolute bottom-10 left-10 z-10 pointer-events-none">
          <p className="text-cyan-400 font-mono text-xs tracking-widest uppercase font-bold mb-2 drop-shadow-md">
            // {sliderData?.subheadline || 'REALTIME PORTFOLIO STREAM'}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3 drop-shadow-lg">
            {sliderData?.headline || 'FESTIVAL SETUP'}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-wider text-gray-300 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 w-fit shadow-md">
            <span className="flex items-center gap-1.5 text-orange-400 font-bold">
              ⚡ <span className="text-gray-300 font-normal uppercase">{sliderData?.feature || 'LIVE CONFIG ACTIVE'}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1.5 text-pink-500 font-bold">
              📍 <span className="text-gray-300 font-normal uppercase">{sliderData?.location || 'BRAUNAU'}</span>
            </span>
          </div>
        </div>

        {/* Punkte-Indikatoren */}
        {sliderData?.images && sliderData.images.length > 1 && (
          <div className="absolute bottom-6 right-10 flex gap-2 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
            {sliderData.images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-purple-500' : 'w-1.5 bg-gray-600'}`} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeaderBox;
