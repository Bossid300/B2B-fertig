import React, { useState, useEffect } from 'react';
import ProfileHeaderBox from './components/ProfileHeaderBox';
import ProfileStammBox from './components/ProfileStammBox';
import ProfileBioTabsBox from './components/ProfileBioTabsBox';
import ProfileGalleryBox from './components/ProfileGalleryBox';
import ProfileProjekteBox from './components/ProfileProjekteBox';
import ProfileBewertungsBox from './components/ProfileBewertungsBox';
import ProfileSocialBox from './components/ProfileSocialBox';
import ProfileSkillBox from './components/ProfileSkillBox';
import ProfileEquipmentBox from './components/ProfileEquipmentBox';
import ProfilePassBox from './components/ProfilePassBox';
import ProfileCard from './components/cards/ProfileCard';
import ProfileMapBox from './components/ProfileMapBox';
import ProfileSectionTabs from './components/ProfileSectionTabs';

import { getProfilesDb } from './services/apiService';
import { saveFavorite, deleteFavorite, getFavorites } from './services/apiService';

export default function UserProfile({ onBack, currentProfileId, isOwner, setView }) {
  const [profileData, setProfileData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

    const ownerProfileId = localStorage.getItem('gigsda_profile_id');
  
    const favoriteKey = `gigsda_favorites_${ownerProfileId}`;
      
      // 1. DATABASE PIPELINE: Lädt die Profildaten, um Favoriten-Status zu prüfen
      useEffect(() => {
      getProfilesDb()
        .then(profiles => {
          const found = profiles.find(
            p => p?.id === currentProfileId
          );
  
          if (found) {
            if (found?.profile_json) {
              const dbProfile =
                JSON.parse(found.profile_json);
              setProfileData(dbProfile);
            } else {
              setProfileData(found);
            }
          }
        })
      .catch(error => {
        console.error("DB LOAD FEHLER", error);
      });
        
      // Prüft, ob der User in deiner Favoritenliste steht
      const savedFavs =
        JSON.parse(
          localStorage.getItem(favoriteKey) || '[]'
        );
          setIsFavorite(savedFavs.includes(profileData?.id));
      }, [currentProfileId]);
  
  
    // 2. FAVORITEN PIPELINE: Schaltet den Stern live im LocalStorage um
    const handleToggleFavorite = () => {
      let savedFavs = JSON.parse(
        localStorage.getItem(favoriteKey) || '[]'
      );
      if (savedFavs.includes(profileData?.id)) {

        savedFavs =
          savedFavs.filter(
            f => f !== profileData?.id
          );

        deleteFavorite(
          ownerProfileId,
          profileData.id
        ).catch(console.error);

        setIsFavorite(false);

      } else {
        savedFavs.push(profileData?.id);

        saveFavorite(
        ownerProfileId,
        profileData.id
        ).catch(console.error);

        setIsFavorite(true);
      }
      localStorage.setItem(
        favoriteKey,
        JSON.stringify(savedFavs)
      );

      window.dispatchEvent(
        new Event('storage')
      );
    };
  

    // Verhindert Flackern während die Daten laden
    if (!profileData) {
      return (
        <div className="w-full max-w-6xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
          // GIGSDA CORE CORE PROFILE REDIRECT...
        </div>
      );
  }


  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative space-y-6">

      {/* ZURÜCK LINK (OPTIONAL, FALLS DU EINEN BUTTON BRAUCHST) */}
      {typeof onBack === 'function' && (
        <button onClick={onBack} className="text-[10px] uppercase text-slate-500 hover:text-white mb-2 transition-all cursor-pointer font-black">
          &lt; [ Back to Terminal ]
        </button>
      )}

      {/* BOX 1: Deine Master-HeaderBox für den Slider */}
      <ProfileHeaderBox
        currentProfileId={currentProfileId}
        localFields={profileData} 
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
        isOwner={isOwner}
        setView={setView}
        // 🚨 HIER FEHLEN DIE BEIDEN KABEL FÜR DEN SLIDER!
      />


      <ProfileSectionTabs
        currentProfileId={currentProfileId}
        isOwner={isOwner}
        profile={
          <>
            <ProfileStammBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileBioTabsBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileSocialBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileMapBox profile={profileData} />
          </>
        }
        portfolio={
          <>
            <ProfileGalleryBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileProjekteBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileBewertungsBox currentProfileId={currentProfileId} isOwner={isOwner} />
          </>
        }
        offer={
          <>
            <ProfileSkillBox currentProfileId={currentProfileId} isOwner={isOwner} />
            <ProfileEquipmentBox currentProfileId={currentProfileId} isOwner={isOwner} />
          </>
        }
        management={
          <>
            <ProfilePassBox
              currentProfileId={currentProfileId}
              profileId={profileData.id || currentProfileId}
              setView={setView}
            />
            <div className="bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-4">
              <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                Live-Vorschau Partnersuche
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                So erscheint dein Profil aktuell in der Partnersuche.
              </p>
            </div>
            <ProfileCard user={profileData} />
          </>
        }
      />

    </div>
  );
}
