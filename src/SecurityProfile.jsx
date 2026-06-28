import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter'; // Pfade an deine Ordnerstruktur anpassen!
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


export default function SecurityProfile({ onBack, ticketName, isOwner }) {
  const [profileData, setProfileData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const targetUser = ticketName || localStorage.getItem('gigsda_user_name') || 'grober lackl';

  // 1. DATABASE PIPELINE: Lädt die Profildaten, um Favoriten-Status zu prüfen
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
        console.error("Fehler beim Profil-Sync im Mutterschiff:", e);
      }
    }

    // Prüft, ob der User in deiner Favoritenliste steht
    const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
    setIsFavorite(savedFavs.includes(targetUser));
  }, [targetUser]);

  // 2. FAVORITEN PIPELINE: Schaltet den Stern live im LocalStorage um
  const handleToggleFavorite = () => {
    let savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
    if (savedFavs.includes(targetUser)) {
      savedFavs = savedFavs.filter(f => f !== targetUser);
      setIsFavorite(false);
    } else {
      savedFavs.push(targetUser);
      setIsFavorite(true);
    }
    localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
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
      <CrewRequestCenter currentProfileName={targetUser} />

      {/* BOX 1: Deine Master-HeaderBox für den Slider */}
      <ProfileHeaderBox
        currentProfileName={targetUser}
        localFields={profileData} 
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
        // 🚨 HIER FEHLEN DIE BEIDEN KABEL FÜR DEN SLIDER!
      />

      <ProfileStammBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileStatusMatrix currentProfileName={targetUser} />
      <ProfileBioTabsBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileSkillBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileNetworkBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileProjekteBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileLogistikBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileFinanzBox currentProfileName={targetUser} isOwner={isOwner} />
      <ProfileLokalBox currentProfileName={targetUser} isOwner={isOwner} />

    </div>
  );
}
