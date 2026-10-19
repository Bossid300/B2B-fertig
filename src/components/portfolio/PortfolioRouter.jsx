import React, { useEffect, useState } from "react";
import { getProfilesDb } from "../../services/apiService";

import ArtistPortfolio from './ArtistPortfolio';
import LocationPortfolio from './LocationPortfolio';

export default function PortfolioRouter({
  profileId = null,
  onBack
}) {

  const [profile, setProfile] = useState(null);

  const activeProfileId =
    profileId ||
    localStorage.getItem('gigsda_portfolio_profile');

  useEffect(() => {
      getProfilesDb()
      .then(allProfiles => {
          const found = allProfiles.find(p => {
          const profileData =
              p.profile_json
              ? JSON.parse(p.profile_json)
              : p;
          return (
              profileData.id === activeProfileId
          );
          });
          if (!found) return;
          const loadedProfile =
          found.profile_json
              ? JSON.parse(found.profile_json)
              : found;
      setProfile(loadedProfile);

    })
    .catch(console.error);
  }, [activeProfileId]);

  if (!profile) {
    return null;
  }

  const role =
    profile?.role?.toLowerCase();

  switch(role) {

    case 'location':
      return (
        <LocationPortfolio
          profile={profile}
          onBack={onBack}
        />
      );

    default:
      return (
        <ArtistPortfolio
          profile={profile}
          onBack={onBack}
        />
      );
  }
}