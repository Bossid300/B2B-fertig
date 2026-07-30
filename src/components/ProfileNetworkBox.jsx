import React, { useState, useEffect } from 'react';
import { Users, Eye, EyeOff } from 'lucide-react';
import {
  saveProfile,
  getProfilesDb,
  getCrewRequests
} from '../services/apiService';


export default function ProfileNetworkBox({ currentProfileName, isOwner }) {
  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [networkUsers, setNetworkUsers] = useState([]);
  const [showNetwork, setShowNetwork] = useState(true);
  const [stats, setStats] = useState({ requestsCount: 0, favoritedByCount: 0 });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const loggedInUser = localStorage.getItem('gigsda_user_name') || '';

  const currentProfileId =
    localStorage.getItem('gigsda_profile_id');

  const favoriteKey =
    `gigsda_favorites_${currentProfileId}`;

  const canEditPrivacy = isOwner || targetUser.toLowerCase() === loggedInUser.toLowerCase();

  // 1. DYNAMIC B2B NETWORK & METRIC ENGINE
useEffect(() => {
  const loadNetworkData = async () => {
    try {
      const reqs =
        await getCrewRequests();

      const savedFavs =
        localStorage.getItem(favoriteKey);

      getProfilesDb()
        .then(allProfiles => {
          const found = allProfiles.find(
            p =>
              p &&
              (p.name || p.user_name || p.display_name)
                ?.trim()
                .toLowerCase() ===
              targetUser.trim().toLowerCase()
          );

          if (!found) return;

          const profile =
            found.profile_json
              ? JSON.parse(found.profile_json)
              : found;

          setProfile(profile);
          setProfileData(profile);

          setShowNetwork(
            profile.show_network !== false
          );

          const partnerList =
            allProfiles
              .filter(p =>
                p &&
                p.name?.toLowerCase() !==
                  targetUser.toLowerCase() &&
                (
                  p.role === profile.role ||
                  p.city === profile.city ||
                  profile.skills?.includes(p.role)
                )
              )
              .slice(0, 3);

          setNetworkUsers(partnerList);

          const nameVariations = [
            targetUser.trim().toLowerCase(),
            (profile.name || '').trim().toLowerCase(),
            (profile.klarname || '').trim().toLowerCase(),
            (profile.project_name || '').trim().toLowerCase(),
            (profile.category || '').trim().toLowerCase()
          ].filter(v => v !== '');

          const savedFavs =
            localStorage.getItem(favoriteKey);

          let myRequests = [];

          if (
            targetUser.toLowerCase() ===
            loggedInUser.toLowerCase()
          ) {
            myRequests = reqs.filter(
              r =>
                r &&
                r.requestedProfileName &&
                nameVariations.includes(
                  r.requestedProfileName.trim().toLowerCase()
                )
            );
          } else {
            myRequests = reqs.filter(
              r =>
                r &&
                r.requesterProfileName &&
                nameVariations.includes(
                  r.requesterProfileName.trim().toLowerCase()
                )
            );
          }

          const favs =
            JSON.parse(savedFavs || '[]');

          const isFavInLists =
            favs.filter(f => {
              if (!f) return false;

              const entryName =
                typeof f === 'object' && f.name
                  ? f.name
                  : f;

              return nameVariations.includes(
                entryName.trim().toLowerCase()
              );
            });

          setStats({
            requestsCount: myRequests.length,
            favoritedByCount: isFavInLists.length
          });
        })
        .catch(console.error);

    } catch (e) {
      console.error(
        'NETWORK REQUESTS DB FEHLER ❌',
        e
      );
    }
  };

  loadNetworkData();
}, [targetUser, showNetwork, favoriteKey]);


const toggleNetworkPrivacy = async () => {

  try {

    const updatedProfile = {
      ...profileData,
      show_network: !showNetwork
    };

    const result =
      await saveProfile(
        updatedProfile.id,
        updatedProfile
      );

    console.log(
      'NETWORK SAVE DB ✅',
      result
    );

    setProfile(updatedProfile);
    setProfileData(updatedProfile);
    setShowNetwork(!showNetwork);

  } catch (e) {

    console.error(
      'Fehler beim Speichern der Netzwerk-Sichtbarkeit:',
      e
    );

  }

};

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // VERBINDUNGS REGISTER INITIALISIERT...
      </div>
    );
  }

  const isNetworkVisible = showNetwork || canEditPrivacy;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B NETWORK & ALLIANZEN</span>
        </div>
        
        {canEditPrivacy && (
          <button 
            type="button" 
            onClick={toggleNetworkPrivacy}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showNetwork ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
          >
            {showNetwork ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* NETWORK STATUS / LIVE-METRIKEN */}
        <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col justify-center space-y-2">
          <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">// PLATFORM KPI STATUS</div>
          <div className="flex items-center justify-between border-b border-slate-900/50 py-1">
            <span className="text-xs text-slate-400">Crew Buchungen:</span>
            <span className="text-xs text-cyan-400 font-black font-mono">{stats.requestsCount}x Aktiv</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-400">Favoriten-Pools:</span>
            <span className="text-xs text-purple-400 font-black font-mono">{stats.favoritedByCount} Listen</span>
          </div>
        </div>

        {/* VERKNÜPFTE CREW-PARTNER */}
        <div className="md:col-span-2 space-y-2">
          <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">// DIREKTE SYNERGIEN & NETZWERK-STAMM</div>
          
          {!isNetworkVisible ? (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// PARTNERLISTE VOM INHABER AUSGEBLENDET</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {networkUsers.length > 0 ? (
                networkUsers.map((user, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-2.5 hover:border-cyan-500/50 transition-all">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-800 bg-slate-950 shrink-0">
                      <img 
                        src={user.avatarUrl && user.avatarUrl.trim() !== "" ? user.avatarUrl : "https://unsplash.com"} 
                        alt="Partner" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[10px] text-white font-bold truncate uppercase">{user.name}</span>
                      <span className="text-[8px] text-slate-500 truncate uppercase font-mono">{user.category || user.role || 'Partner'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-3 p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// NOCH KEINE NETZWERK-KOPPLUNGEN</div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
