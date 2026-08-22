import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox';
import ProfileStammBox from './components/ProfileStammBox';
import ProfileBioTabsBox from './components/ProfileBioTabsBox';
import ProfileSkillBox from './components/ProfileSkillBox';
import ProfileGalleryBox from './components/ProfileGalleryBox';
import ProfileNetworkBox from './components/ProfileNetworkBox';
import ProfileAvailBox from './components/ProfileAvailBox';
import ProfileFinanzBox from './components/ProfileFinanzBox';
import ProfileProjekteBox from './components/ProfileProjekteBox';
import ProfileEquipmentBox from './components/ProfileEquipmentBox';
import ProfileBewertungsBox from './components/ProfileBewertungsBox';
import ProfileDokumenteBox from './components/ProfileDokumenteBox';
import ProfileLogistikBox from './components/ProfileLogistikBox';
import ProfileComplianceBox from './components/ProfileComplianceBox';
import ProfileSocialBox from './components/ProfileSocialBox';
import ProfileVertretungBox from './components/ProfileVertretungBox';
import ProfileLokalBox from './components/ProfileLokalBox';
import ProfileStatusMatrix from './components/ProfileStatusMatrix';
import ProfileHilfeBox from './components/ProfileHilfeBox';
import ArtistAudioBox from './components/ArtistAudioBox';
import ArtistTechRiderBox from './components/ArtistTechRiderBox';
import ArtistStammBox from './components/ArtistStammBox';
import ProfilePassBox from './components/ProfilePassBox';
import ProfileCard from './components/cards/ProfileCard';

import { getProfilesDb } from './services/apiService';

import { subscriptionService }
from '../moduls/subscriptions/subscriptionService';

import { FEATURES }
from '../moduls/subscriptions/featureGates';



export default function VorlageProfile({ onBack, currentProfileId, isOwner }) {
  const [profileData, setProfileData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteKey = `gigsda_favorites_${currentProfileId}`;

    
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
      let savedFavs =
        JSON.parse(
          localStorage.getItem(favoriteKey) || '[]'
        );
      if (savedFavs.includes(profileData?.id)) {
          savedFavs = savedFavs.filter(
          f => f !== profileData?.id
        );
        setIsFavorite(false);
      } else {
        savedFavs.push(profileData?.id);
        setIsFavorite(true);
      }
      localStorage.setItem(
        favoriteKey,
        JSON.stringify(savedFavs)
      );
      window.dispatchEvent(new Event('storage')); // UI-Schubs für reaktive Listen
    };

    // Verhindert Flackern während die Daten laden
    if (!profileData) {
      return (
        <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
          // GIGSDA CORE CORE PROFILE REDIRECT...
        </div>
      );
  }



  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative space-y-6">

      {/* ZURÜCK LINK (OPTIONAL, FALLS DU EINEN BUTTON BRAUCHST) */}
      {typeof onBack === 'function' && (
        <button onClick={onBack} className="text-[10px] uppercase text-slate-500 hover:text-white mb-2 transition-all cursor-pointer font-black">
          &lt; [ Back to Terminal ]
        </button>
      )}

      {/* BOX 0: Deine Crew-Zentrale (Anfragen) */}
      <CrewRequestCenter currentProfileId={currentProfileId} />

      {/* BOX 1: Deine Master-HeaderBox für den Slider */}
      <ProfileHeaderBox
        currentProfileId={currentProfileId}
        localFields={profileData} 
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
        // 🚨 HIER FEHLEN DIE BEIDEN KABEL FÜR DEN SLIDER!
      />

      <ProfileStammBox currentProfileId={currentProfileId} isOwner={isOwner}/>
      <ProfileStatusMatrix currentProfileId={currentProfileId} />
      <ProfileBioTabsBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileSkillBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileGalleryBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileNetworkBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileAvailBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileFinanzBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileProjekteBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileEquipmentBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileBewertungsBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileDokumenteBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileLogistikBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileComplianceBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileSocialBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileVertretungBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileHilfeBox currentProfileId={currentProfileId} isOwner={isOwner} />
      <ProfileLokalBox currentProfileId={currentProfileId} isOwner={isOwner} />

    </div>
  );
}
