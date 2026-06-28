import React, { useState, useEffect } from 'react';
import { Pencil, Save, Image, Eye, EyeOff, X, Maximize2 } from 'lucide-react';

export default function ProfileGalleryBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeLightbox, setActiveLightbox] = useState(null);

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt die Galerie-Kacheln live aus gigsda_profiles
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
            
            const defaultGallery = [
              { url: found.gallery_slot1_url || '', title: found.gallery_slot1_title || 'Slot 1', visible: found.gallery_slot1_visible !== false },
              { url: found.gallery_slot2_url || '', title: found.gallery_slot2_title || 'Slot 2', visible: found.gallery_slot2_visible !== false },
              { url: found.gallery_slot3_url || '', title: found.gallery_slot3_title || 'Slot 3', visible: found.gallery_slot3_visible !== false },
              { url: found.gallery_slot4_url || '', title: found.gallery_slot4_title || 'Slot 4', visible: found.gallery_slot4_visible !== false }
            ];
            setGallery(defaultGallery);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Galerie-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleInputChange = (index, field, value) => {
    setGallery(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  const toggleVisibility = (index) => {
    setGallery(prev => prev.map((item, idx) => idx === index ? { ...item, visible: !item.visible } : item));
  };

  // 2. SAVE PIPELINE: Brennt die Kacheln fehlerfrei mit Index-Mapping in die Profile
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
            gallery_slot1_url: gallery[0].url, gallery_slot1_title: gallery[0].title, gallery_slot1_visible: gallery[0].visible,
            gallery_slot2_url: gallery[1].url, gallery_slot2_title: gallery[1].title, gallery_slot2_visible: gallery[1].visible,
            gallery_slot3_url: gallery[2].url, gallery_slot3_title: gallery[2].title, gallery_slot3_visible: gallery[2].visible,
            gallery_slot4_url: gallery[3].url, gallery_slot4_title: gallery[3].title, gallery_slot4_visible: gallery[3].visible
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Medien-Portfolio erfolgreich eingebrannt! 💾🖼️");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Galerie:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">// MEDIEN REGISTER INITIALISIERT...</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Image size={14} className="text-pink-500" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B PORTFOLIO GALLERY</span>
        </div>
        
        {canEdit && !isEditing && (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-pink-500 text-[10px] font-black tracking-wider uppercase hover:border-pink-500 transition-all cursor-pointer"
          >
            ✏️ Bearbeiten
          </button>
        )}
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gallery.map((item, idx) => {
            const isVisible = item.visible || canEdit;
            if (!isVisible) return null;

            const hasImg = item.url && item.url.trim() !== "";

            return (
              <div key={idx} className="group relative aspect-square rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden flex flex-col justify-end p-3">
                {hasImg ? (
                  <>
                    <img src={item.url} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-300" />
                    <button 
                      type="button" 
                      onClick={() => setActiveLightbox(item.url)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                    >
                      <Maximize2 size={10} />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-800 text-[10px] uppercase font-mono">// LEERER SLOT</div>
                )}

                <div className="relative z-10 flex justify-between items-center bg-slate-950/80 p-1.5 rounded-xl border border-slate-900/50 backdrop-blur-sm">
                  <span className="text-[9px] font-bold tracking-wide uppercase truncate max-w-[80%] text-slate-300">{item.title || `Slot ${idx + 1}`}</span>
                  {canEdit && (item.visible ? <Eye size={10} className="text-pink-500/50" /> : <EyeOff size={10} className="text-slate-700" />)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gallery.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-pink-500 text-[9px] font-bold tracking-wider uppercase">// SLOT {idx + 1} METADATEN</span>
                  <button 
                    type="button" 
                    onClick={() => toggleVisibility(idx)} 
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${item.visible ? 'text-pink-400 border-pink-500/30 bg-pink-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
                  >
                    {item.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                </div>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => handleInputChange(idx, 'title', e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-pink-500 font-mono" 
                    placeholder="Bild Bezeichnung (e.g. Hallenplan / Live)" 
                  />
                  <input 
                    type="text" 
                    value={item.url || ''} 
                    onChange={(e) => handleInputChange(idx, 'url', e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-[10px] text-slate-400 focus:outline-none focus:border-pink-500 font-mono" 
                    placeholder="https://unsplash.com..." 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)]"><Save size={12} /> Einbrennen ✓</button>
          </div>
        </form>
      )}

      {/* FULL-SCREEN OVERLAY */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
          <button 
            type="button" 
            onClick={() => setActiveLightbox(null)} 
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-white hover:text-pink-500 cursor-pointer transition-all shadow-lg z-50"
          >
            <X size={16} />
          </button>
          <div className="max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden border border-pink-500/20 shadow-[0_0_50px_rgba(236,72,153,0.15)] bg-slate-950">
            <img src={activeLightbox} alt="Lightbox View" className="w-full h-full object-contain max-h-[85vh]" />
          </div>
        </div>
      )}

    </div>
  );
}
