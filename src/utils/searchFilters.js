// searchFilters.js

// 1. KÜNSTLER (Artist)
export const matchArtistFilters = (profile, filters) => {
  // Hier deine Künstler-Filter rein (z.B. Genre, Gage)
  return true;
};

// 2. LOCATIONS
export const matchLocationFilters = (profile, filters) => {
  if (filters.selectedPax && (profile.pax || 0) < parseInt(filters.selectedPax)) return false;
  
  // Starkstrom & Sperrstunde
  if (filters.powerSupply && profile.room1_power_supply !== filters.powerSupply) return false;
  if (filters.curfewTime && profile.room1_curfew_time < filters.curfewTime) return false;
  
  return true;
};

// 3. MATERIAL (Equipment)
export const matchEquipmentFilters = (profile, category, caseType, minQty) => {
  const equipment = profile.equipment;
  const hasEquipment = Array.isArray(equipment) && equipment.length > 0;

  if (!hasEquipment && (category !== 'all' || caseType !== 'all' || minQty !== 'all')) return false;

  if (category && category !== 'all') {
    const matchCat = equipment.some(eq => {
      const text = `${eq.item || ''} ${eq.detail || ''}`.toLowerCase();
      if (category === 'audio') return text.includes('audio') || text.includes('ton') || text.includes('sound');
      if (category === 'licht') return text.includes('licht') || text.includes('beleuchtung') || text.includes('lamp');
      return text.includes(category);
    });
    if (!matchCat) return false;
  }

  if (caseType && caseType !== 'all') {
    const matchCase = equipment.some(eq => {
      const detail = (eq.detail || '').toLowerCase();
      if (caseType === 'flightcase') return detail.includes('case') || detail.includes('flightcase');
      if (caseType === 'lose') return !detail.includes('case') && !detail.includes('flightcase');
      return true;
    });
    if (!matchCase) return false;
  }

  if (minQty && minQty !== 'all') {
    const matchQty = equipment.some(eq => {
      const qty = parseInt((eq.detail || '').match(/\d+/)?.[0]) || 1;
      return qty >= parseInt(minQty);
    });
    if (!matchQty) return false;
  }

  return true;
};

// 4. CREWS & STAFF
export const matchCrewFilters = (profile, filters) => {
  // Hier die neuen Filter für Techniker, Hands und Crews (z.B. Gewerk, Tagessatz)
  return true;
};
