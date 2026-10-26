import React, { useEffect, useState } from "react";
import { getPublicProfiles } from "../../services/apiService";

import ArtistPortfolio from './ArtistPortfolio';
import LocationPortfolio from './LocationPortfolio';
import TechnicianPortfolio from './TechnicianPortfolio';

export default function PortfolioRouter({
  profileId = null,
  onBack,
  setView
}) {

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const activeProfileId =
    profileId ||
    localStorage.getItem('gigsda_portfolio_profile');

  useEffect(() => {
    setProfile(null);
    setIsLoading(true);
    setLoadError(false);
    getPublicProfiles()
      .then(allProfiles => {
        const found = allProfiles.find(p => {
          const profileData = p.profile_json
            ? JSON.parse(p.profile_json)
            : p;
          return profileData.id === activeProfileId;
        });

        if (found) {
          const loadedProfile = found.profile_json
            ? JSON.parse(found.profile_json)
            : found;
          setProfile(loadedProfile);
        }
      })
      .catch(error => {
        console.error(error);
        setLoadError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeProfileId]);

  if (isLoading) {
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-white">
            {loadError ? 'Profil konnte nicht geladen werden' : 'Profil nicht verfügbar'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {loadError
              ? 'Beim Laden des Profils ist ein Fehler aufgetreten. Bitte versuche es später erneut.'
              : 'Dieses Profil wurde deaktiviert oder ist aktuell nicht öffentlich verfügbar.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                setView?.('radar');
              }
            }}
            className="mt-6 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            Zurück zum Explorer
          </button>
        </div>
      </div>
    );
  }

  const role =
    profile?.role?.toLowerCase();

  switch(role) {

    case 'location':
      return (
        <LocationPortfolio
          profile={profile}
          onBack={onBack}
          setView={setView}
        />
      );

    case 'techniker':
      return (
        <TechnicianPortfolio
          profile={profile}
          onBack={onBack}
          setView={setView}
        />
      );

    default:
      return (
        <ArtistPortfolio
          profile={profile}
          onBack={onBack}
          setView={setView}
        />
      );
  }


}