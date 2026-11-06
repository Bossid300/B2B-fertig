import React, { useState, useEffect } from 'react';
import ProfileHeaderBox from './components/ProfileHeaderBox';
import ProfileStammBox from './components/ProfileStammBox';
import ProfileBioTabsBox from './components/ProfileBioTabsBox';
import ProfileGalleryBox from './components/ProfileGalleryBox';
import ProfileNetworkBox from './components/ProfileNetworkBox';
import ProfileAvailBox from './components/ProfileAvailBox';
import ProfileFinanzBox from './components/ProfileFinanzBox';
import LocationBusinessBox from './components/LocationBusinessBox';
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
import LocationRaeumeBox from './components/LocationRaeumeBox';
import ProfilePassBox from './components/ProfilePassBox';
import ProfileCard from './components/cards/ProfileCard';
import ProfileSectionTabs from './components/ProfileSectionTabs';
import ProfileMapBox from './components/ProfileMapBox';
import { getProfileById } from './services/apiService';
import { saveFavorite, deleteFavorite } from './services/apiService';
import LocationPassChallengeBox from './components/LocationPassChallengeBox';


export default function LocationProfile({ onBack, currentProfileId, isOwner, setView }) {
  const [profileData, setProfileData] = useState(null);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const ownerProfileId = localStorage.getItem('gigsda_profile_id');
  const favoriteKey = `gigsda_favorites_${ownerProfileId}`;
  const canManage = Boolean(
    isOwner || currentProfileId === ownerProfileId
  );
    
    // 1. DATABASE PIPELINE: Lädt die Profildaten, um Favoriten-Status zu prüfen
    useEffect(() => {
    getProfileById(currentProfileId)
      .then(({ success, profile: found }) => {
        if (!success) {
          throw new Error('Profil konnte nicht geladen werden.');
        }

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
          // GIGSDA CORE LOCATION PROFILE REDIRECT...
        </div>
      );
  }

  const hasAvailabilityData = Boolean(
    profileData.general_status ||
    (profileData.avail_days &&
      Object.keys(profileData.avail_days).length > 0)
  );
  const hasEquipmentData =
    Array.isArray(profileData.equipment) &&
    profileData.equipment.length > 0;
  const hasLogisticsData = Boolean(
    profileData.travel_radius ||
    profileData.mobility_status ||
    profileData.travel_expenses
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-930 rounded-3xl font-mono text-white shadow-2xl relative space-y-6">

      {/* ZURÜCK LINK (OPTIONAL, FALLS DU EINEN BUTTON BRAUCHST) */}
      {typeof onBack === 'function' && (
        <button onClick={onBack} className="text-[10px] uppercase text-slate-500 hover:text-white mb-2 transition-all cursor-pointer font-black">
          &lt; [ Back to Terminal ]
        </button>
      )}

      <ProfileHeaderBox
        currentProfileId={currentProfileId}
        localFields={profileData}
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
        isOwner={canManage}
        setView={setView}
      />

      <ProfileSectionTabs
        currentProfileId={currentProfileId}
        isOwner={canManage}
        profile={
          <>
            <ProfileStammBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileBioTabsBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileSocialBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileVertretungBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileMapBox profile={profileData} 
            />
          </>
        }
        portfolio={
          <>
            <ProfileGalleryBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileProjekteBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileBewertungsBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileNetworkBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileDokumenteBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
          </>
        }
        offer={
          <>
            <LocationRaeumeBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            {(canManage || hasEquipmentData) && (
              <ProfileEquipmentBox
                currentProfileId={currentProfileId}
                isOwner={canManage}
              />
            )}
            {(canManage || hasAvailabilityData) && (
              <ProfileAvailBox
                currentProfileId={currentProfileId}
                isOwner={canManage}
              />
            )}
            {(canManage || hasLogisticsData) && (
              <ProfileLogistikBox
                currentProfileId={currentProfileId}
                isOwner={canManage}
              />
            )}
          </>
        }
        management={
          <>
            <ProfileStatusMatrix currentProfileId={currentProfileId} />
            <ProfileFinanzBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <LocationBusinessBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfileComplianceBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <LocationPassChallengeBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <ProfilePassBox
              currentProfileId={currentProfileId}
              profileId={profileData.id || currentProfileId}
              setView={setView}
            />
            <ProfileLokalBox
              currentProfileId={currentProfileId}
              isOwner={canManage}
            />
            <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl select-none">
              <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
                Live-Vorschau SearchExplorer
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                So erscheint dein Profil aktuell in der Crew Search Explorer.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Die Buttons „PROFIL“ und „ANFRAGEN“ haben hier keine Funktion.
              </p>

              <ProfileCard user={profileData} />
              
            </div>
          </>
        }
      />
    </div>
  );
}
