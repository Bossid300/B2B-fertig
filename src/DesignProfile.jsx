import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter'; // Pfade an deine Ordnerstruktur anpassen!
import ProfileHeaderBox from './components/ProfileHeaderBox';
import ProfileStammBox from './components/ProfileStammBox';
import ProfilePassBox from './components/ProfilePassBox';
import ProfileCard from './components/cards/ProfileCard';

export default function DesignProfile({ onBack, ticketName, isOwner }) {
  const [profileData, setProfileData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const targetUser = ticketName || localStorage.getItem('gigsda_user_name') || 'grober lackl';

  const currentProfileId =
    localStorage.getItem('gigsda_profile_id');

  const favoriteKey =
    `gigsda_favorites_${currentProfileId}`;
    
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
    const savedFavs =
      JSON.parse(
        localStorage.getItem(favoriteKey) || '[]'
      );
        setIsFavorite(savedFavs.includes(profileData?.id));
    }, [targetUser]);

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
      <CrewRequestCenter currentProfileName={targetUser} />

      {/* BOX 1: Deine Master-HeaderBox für den Slider */}
      <ProfileHeaderBox
        currentProfileName={targetUser}
        localFields={profileData} 
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
        // 🚨 HIER FEHLEN DIE BEIDEN KABEL FÜR DEN SLIDER!
      />


      {/* ── 💾 BOX 2: HIER WIRD DEINE NEUE STAMMDATENBOX LIVE EINGEBUNDEN! ── */}
      <ProfileStammBox 
        currentProfileName={targetUser} 
        isOwner={isOwner} 
      />

      <div className="bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-4 mb-4">
        <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
          🔍 // Live-Vorschau SearchExplorer
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          So erscheint dein Profil aktuell in der Partnersuche.
        </p>        
        <p className="text-xs text-slate-500 mt-1">
          Button "PROFIL" & "ANFRAGEN" haben hier keine Funktion!
        </p>
      </div>

      <ProfileCard user={profileData} />

      <ProfilePassBox 
        currentProfileName={targetUser}
        profileId={profileData?.id || 'GIGS-XXXX'}
        onBackToDashboard={onBack}
      />

    </div>
  );
}
