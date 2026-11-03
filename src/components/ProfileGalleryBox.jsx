import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Save, Image, Eye, EyeOff, X, Maximize2 } from 'lucide-react';
import { saveProfile } from '../services/apiService';
import { getProfilesDb } from '../services/apiService';
import {
  getMediaAssets,
  getMediaPreviewUrl,
  uploadMediaFile
} from '../services/mediaService';

export default function ProfileGalleryBox({ currentProfileId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [showGallery, setShowGallery] = useState(true);
  const [activeLightbox, setActiveLightbox] = useState(null);


  const [galleryAssets, setGalleryAssets] = useState([]);
  const [selectedGalleryAssetId, setSelectedGalleryAssetId] = useState('');
  const [selectedGallerySlot, setSelectedGallerySlot] = useState(null);
  const [isGalleryChooserOpen, setGalleryChooserOpen] = useState(false);
  const galleryFileInputRef = useRef(null);

  const handleGalleryUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const asset =
        await uploadMediaFile(file);

      const assets =
        await getMediaAssets();

      setGalleryAssets(
        assets.filter(
          asset => asset.media_type === 'image'
        )
      );
      setSelectedGalleryAssetId(
        asset.id
      );
    } catch (err) {
      console.error(err);
    }
  };


  const canEdit = isOwner || currentProfileId === localStorage.getItem( 'gigsda_profile_id' );

  // 1. DATABASE PIPELINE: Lädt die Galerie-Kacheln live 
  useEffect(() => {
  getProfilesDb(currentProfileId)
    .then(profiles => {

      const found = profiles.find(
        p => p?.id === currentProfileId
      );

      if (!found) return;

      const profile =
        found.profile_json
          ? JSON.parse(found.profile_json)
          : found;

      setProfile(profile);
      setProfileData(profile);
      setShowGallery(profile.show_gallery !== false);

      const defaultGallery = [
        {
          url: profile.gallery_slot1_url || '',
          title: profile.gallery_slot1_title || 'Slot 1',
          visible: profile.gallery_slot1_visible !== false
        },
        {
          url: profile.gallery_slot2_url || '',
          title: profile.gallery_slot2_title || 'Slot 2',
          visible: profile.gallery_slot2_visible !== false
        },
        {
          url: profile.gallery_slot3_url || '',
          title: profile.gallery_slot3_title || 'Slot 3',
          visible: profile.gallery_slot3_visible !== false
        },
        {
          url: profile.gallery_slot4_url || '',
          title: profile.gallery_slot4_title || 'Slot 4',
          visible: profile.gallery_slot4_visible !== false
        }
      ];

      setGallery(defaultGallery);

      })
      .catch(console.error);

  }, [currentProfileId, isEditing]);

  const handleInputChange = (index, field, value) => {
    setGallery(prev => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  const toggleVisibility = (index) => {
    setGallery(prev => prev.map((item, idx) => idx === index ? { ...item, visible: !item.visible } : item));
  };

  // 2. SAVE PIPELINE: Brennt die Kacheln fehlerfrei mit Index-Mapping in die Profile
  const handleSave = async (e) => {
    e.preventDefault();

    try {

      const updatedProfile = {
        ...profileData,

        gallery_slot1_url: gallery[0].url,
        gallery_slot1_title: gallery[0].title,
        gallery_slot1_visible: gallery[0].visible,

        gallery_slot2_url: gallery[1].url,
        gallery_slot2_title: gallery[1].title,
        gallery_slot2_visible: gallery[1].visible,

        gallery_slot3_url: gallery[2].url,
        gallery_slot3_title: gallery[2].title,
        gallery_slot3_visible: gallery[2].visible,

        gallery_slot4_url: gallery[3].url,
        gallery_slot4_title: gallery[3].title,
        gallery_slot4_visible: gallery[3].visible,
        show_gallery: showGallery
      };

      const saveProfileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;

      await saveProfile({
        profileId: saveProfileId,
        profile: updatedProfile
      });

      alert("B2B Medien-Portfolio erfolgreich eingebrannt! 🖼️🎞️");

      setIsEditing(false);

    } catch (e) {

      console.error(
        "Fehler beim Speichern der Galerie:",
        e
      );

    }
  };

  if (!profile) {
    return (
      <div 
        className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // MEDIEN GALLERY REGISTER INITIALISIERT...
      </div>
    );
  }

  if (!canEdit && (!showGallery || !gallery.some(item => item.visible && item.url?.trim()))) return null;

  return (
    <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Image size={14} className="text-pink-500" />
          <span className="text-xs font-black tracking-widest uppercase">// GALLERY Auftritte & Referenzen</span>
        </div>
        
        {canEdit && !isEditing && (
          <button 
            type="button" 
            data-profile-edit-trigger onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-pink-500 text-[10px] font-black tracking-wider uppercase hover:border-pink-500 transition-all cursor-pointer"
          >
            ✏️ Bearbeiten
          </button>
        )}
        {canEdit && isEditing && (
          <button
            type="button"
            onClick={() => setShowGallery(!showGallery)}
            aria-label={showGallery ? 'Galerie für andere ausblenden' : 'Galerie für andere anzeigen'}
            title={showGallery ? 'Galerie für andere sichtbar' : 'Galerie privat'}
            className="rounded-lg border border-slate-700 p-1.5 text-slate-300"
          >
            {showGallery ? <Eye size={12} /> : <EyeOff size={12} />}
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
            if (!hasImg && !canEdit) return null;

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
                  <button
                    type="button"
                    onClick={async () => {

                      setSelectedGallerySlot(idx);

                      const assets =
                        await getMediaAssets();

                      setGalleryAssets(
                        assets.filter(
                          a => a.media_type === 'image'
                        )
                      );

                      setGalleryChooserOpen(true);

                    }}
                    className="w-full rounded-xl border border-pink-500/30 p-2 text-pink-400"
                  >
                    Bild wählen
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" data-profile-action="cancel" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" data-profile-action="save" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)]"><Save size={12} /> Speichern</button>
          </div>
        </form>
      )}


      {isGalleryChooserOpen && (
      <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center">

        <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-6">

          <h3 className="text-white text-xl mb-4">
            Galeriebild wählen
          </h3>

          <input
            ref={galleryFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleGalleryUpload}
          />

          <button
            type="button"
            onClick={() => galleryFileInputRef.current?.click()}
            className="w-full rounded-xl border border-cyan-500/40 p-3 text-cyan-300 mb-6"
          >
            Neues Bild hochladen
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {galleryAssets.map(asset => (

              <button
                key={asset.id}
                type="button"
                onClick={() =>
                  setSelectedGalleryAssetId(asset.id)
                }
                className={`overflow-hidden rounded-xl border ${
                  selectedGalleryAssetId === asset.id
                    ? 'border-cyan-400'
                    : 'border-slate-800'
                }`}
              >
                <img
                  src={getMediaPreviewUrl(asset.id)}
                  alt={asset.original_filename}
                  className="aspect-square w-full object-cover"
                />

                <span className="block truncate p-2 text-[10px] text-slate-300">
                  {asset.original_filename}
                </span>

              </button>

            ))}

          </div>
          <div className="mt-6 flex justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                setGalleryChooserOpen(false)
              }
              className="rounded-xl border border-slate-700 px-4 py-2"
            >
              Schließen
            </button>
            <button
              type="button"
              disabled={!selectedGalleryAssetId}
              onClick={() => {

                const asset =
                  galleryAssets.find(
                    a => a.id === selectedGalleryAssetId
                  );

                if (!asset) return;

                const mediaUrl =
                  getMediaPreviewUrl(asset.id);

                setGallery(prev =>
                  prev.map((item, idx) =>
                    idx === selectedGallerySlot
                      ? {
                          ...item,
                          url: mediaUrl
                        }
                      : item
                  )
                );

                setGalleryChooserOpen(false);

              }}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-bold"
            >
              Übernehmen
            </button>
          </div>

        </div>

      </div>
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
