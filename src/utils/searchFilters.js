// utils/searchFilters.js

export const getDistanceTo = (city) => {
  const target = (city || "").toLowerCase();

  if (target.includes("braunau")) return 0;
  if (target.includes("altötting")) return 28;
  if (target.includes("passau")) return 53;
  if (target.includes("wels")) return 90;
  if (target.includes("linz")) return 120;
  if (target.includes("wien")) return 290;

  return 100;
};

export const getArtistScore = (profile, filters) => {
  let score = 0;

  const text = `
    ${profile.name || ""}
    ${profile.genre || ""}
    ${profile.city || ""}
  `.toLowerCase();

  // 🔍 SEARCH bewertet
  if (filters.searchQuery) {
    const parts = filters.searchQuery
      .toLowerCase()
      .split(" ")
      .filter(Boolean);

    parts.forEach(part => {
      if (profile.name?.toLowerCase().includes(part)) score += 5; // 🔥 stark
      if (profile.genre?.toLowerCase().includes(part)) score += 3;
      if (profile.city?.toLowerCase().includes(part)) score += 2;
    });
  }

  // 🎸 Genre Match Bonus
  if (filters.selectedGenre !== "all") {
    if (profile.genre?.toLowerCase().includes(filters.selectedGenre.toLowerCase())) {
      score += 3;
    }
  }

  // 📍 Entfernung Bonus (näher = besser)
  if (profile.city) {
    const dist = getDistanceTo(profile.city);
    score += Math.max(0, 200 - dist); // näher = höher
  }

  return score;
};

// 🎤 ARTISTS
export const matchArtistFilters = (profile, filters) => {

    // 🎸 GENRE
    if (filters.selectedGenre !== "all") {
    const profileGenre = (profile.genre || "").toLowerCase();

    const parts = filters.selectedGenre
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

    const match = parts.some(part =>
        profileGenre.includes(part)
    );

    if (!match) return false;
    }

    // 🎤 FORMATION
    if (filters.selectedType !== "all") {
    const formation = (profile.formation || "").toLowerCase();

    if (formation !== filters.selectedType) return false;
    }

    // 🎪 EVENTTYPEN
    if (filters.selectedEventType !== "all") {
      const types = (profile.event_types || "").toLowerCase();

      const parts = filters.selectedEventType
        .toLowerCase()
        .split(" ")
        .filter(Boolean);

      const match = parts.some(part => types.includes(part));

      if (!match) return false;
    }

    // 💶 BUDGET (SMART MATCHING)
    if (filters.selectedBudget !== "all") {
      let min = 0;
      let max = Infinity;

      if (filters.selectedBudget === "low") {
        min = 0;
        max = 500;
      }

      if (filters.selectedBudget === "mid") {
        min = 500;
        max = 1500;
      }

      if (filters.selectedBudget === "high") {
        min = 1500;
        max = Infinity;
      }

      const artistMin = Number(profile.gage_min || 0);
      const artistMax = Number(profile.gage_max || 0);

      // 🔥 MATCH wenn sich Bereiche schneiden
      const overlap = artistMax >= min && artistMin <= max;

      if (!overlap) return false;
    }

      // 📍 RADIUS
      if (filters.selectedRadius !== "all") {
        const distance = getDistanceTo(profile.city);

        const maxDistance = Number(filters.selectedRadius);

        if (distance > maxDistance) return false;
      }


      // 🎸 INSTRUMENTE
      if (filters.selectedInstrument !== "all") {

        const instruments = `
          ${profile.mainInstrument || ""}
          ${profile.subInstruments || ""}
        `.toLowerCase();

        const selected = (filters.selectedInstrument || "").toLowerCase();

        const synonyms = {
          guitar: ["guitar", "gitarre", "e-gitarre"],
          piano: ["piano", "klavier"],
          drums: ["drums", "schlagzeug"],
          vocals: ["vocals", "gesang"]
        };

        const wordsToCheck = synonyms[selected] || [selected];

        const match = wordsToCheck.some(word =>
          instruments.includes(word)
        );

        if (!match) return false;
      }


  return true;
};

// 🏢 LOCATIONS
export const matchLocationFilters = (profile, filters) => {
  const paxMap = {
    small: 100,
    mid: 500
  };

  const requiredPax = paxMap[filters.selectedPax];

  if (requiredPax && (profile.pax || 0) < requiredPax) return false;

  if (
    filters.powerSupply &&
    filters.powerSupply !== "all" &&
    profile.room1_power_supply !== filters.powerSupply
  )
    return false;

  if (
    filters.curfewTime &&
    filters.curfewTime !== "all" &&
    profile.room1_curfew_time < filters.curfewTime
  )
    return false;

  return true;
};

// 🎛️ EQUIPMENT
export const matchEquipmentFilters = (
  profile,
  category,
  caseType,
  minQty
) => {
  const equipment = profile.equipment || [];

  return equipment.some((eq) => {
    const text = `${eq.item || ""} ${eq.detail || ""}`.toLowerCase();
    const detail = (eq.detail || "").toLowerCase();
    const qty = parseInt(detail.match(/\d+/)?.[0]) || 1;

    // CATEGORY
    if (category !== "all") {
      if (category === "audio" && !/(audio|ton|sound)/.test(text))
        return false;
      if (category === "licht" && !/(licht|beleuchtung|lamp)/.test(text))
        return false;
    }

    // CASE
    if (caseType !== "all") {
      if (caseType === "flightcase" && !/case/.test(detail)) return false;
      if (caseType === "lose" && /case/.test(detail)) return false;
    }

    // QUANTITY
    if (minQty !== "all" && qty < parseInt(minQty)) return false;

    return true;
  });
};

// 🛠️ CREW
export const matchCrewFilters = (profile, filters) => {
  // ✅ SUPPORT FILTER (angepasst an deine Daten)
  if (filters.selectedSupport !== "all") {
    const hasSupport = profile.hilfe_status === "ready";

    if (filters.selectedSupport === "yes" && !hasSupport) return false;
    if (filters.selectedSupport === "no" && hasSupport) return false;
  }

  return true;
};

