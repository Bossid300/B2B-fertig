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
          onClick={() => console.log('Dashboard Klick')}
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

        {/* Edit Panel */}
        {isEditingSlider && isOwnProfile && (
          <div className="absolute top-20 right-6 bg-[#0d0a14]/95 border border-purple-500/30 w-96 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-20 max-h-[300px] overflow-y-auto font-mono text-xs text-gray-300 custom-scrollbar">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <span className="text-purple-400 font-bold uppercase">Slider Konfiguration</span>
              <button onClick={() => setIsEditingSlider(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 mb-1 uppercase tracking-tight">Überschrift (Headline)</label>
                <input type="text" name="headline" value={editSliderData.headline} onChange={handleSliderInputChange} className="w-full bg-[#050307] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 uppercase tracking-tight">Unterüberschrift</label>
                <input type="text" name="subheadline" value={editSliderData.subheadline} onChange={handleSliderInputChange} className="w-full bg-[#050307] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-gray-500 mb-1 uppercase tracking-tight">Ort / Location</label>
                <input type="text" name="location" value={editSliderData.location} onChange={handleSliderInputChange} className="w-full bg-[#050307] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500" />
              </div>

              {[0, 1, 2, 3].map((idx) => (
                <div key={idx}>
                  <label className="block text-gray-500 mb-1 uppercase tracking-tight">Bild-URL {idx + 1}</label>
                  <input 
                    type="text" 
                    value={editSliderData?.images?.[idx] || ''} 
                    onChange={(e) => handleSliderInputChange(e, idx)} 
                    className="w-full bg-[#050307] border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-[10px]" 
                    placeholder="https://..." 
                  />
                </div>
              ))}

              <button 
                onClick={saveSliderData} 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all duration-200 mt-2"
              >
                Änderungen Speichern
              </button>
            </div>
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
