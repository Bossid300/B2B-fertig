import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox'; // Ganz oben importieren

export default function CaterProfile({ onBack, ticketName, setView, isOwner, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // 🔒 CRASH-SICHERER COCKPIT-SPEICHER FÜR DEN CATERER
  const [localFields, setLocalFields] = useState({
    name: ticketName || '',
    project_name: '',      // Firmenname (e.g. "Braunau Premium Catering")
    vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', 
    availability: '', 
    role: 'Catering', // Fest auf Daniels System-ID verdrahtet
    
    // 🍽️ SPECIFIC CATERER FIELDS
    foodForm: '',        // Buffet, Menü, Fingerfood
    foodMenu: '',        // Speiseplan / Spezialitäten
    allergies: '',       // Veggie, Vegan, Glutenfrei Angebote
    drinksSelection: '', // Softdrinks, Wein, Cocktails
    billingType: '',     // Pauschale / Nach Verbrauch
    staffNeeded: '',     // Servicepersonal stellbar (Ja/Nein)
    equipmentRent: '',   // Geschirr, Besteck, Gläser inklusive?
    furnitureRent: '',   // Stehtische, Barhocker lieferbar?
    wasteDisposal: '',   // Müllentsorgung & Reinigung
    serviceStyle: '',    // Fine Dining / Street Food Stil
    tastingRequested: '',// Probeessen möglich?
    terms_conditions: '' // Mindestpersonenanzahl / Storno
  });

  // 📡 CRASH-SICHERER LOAD-MECHANISMUS
  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      
      const freshData = currentProj || { 
        id: "CATER-" + Math.floor(Math.random() * 9000 + 1000), 
        name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', role: 'Catering', avatarUrl: ''
      };
      
      setUserData(freshData);
      
      setLocalFields({
        ...freshData,
        name: ticketName || '',
        project_name: freshData?.project_name || '',
        vorname: freshData?.vorname || '',
        nachname: freshData?.nachname || '',
        website: freshData?.website || '',
        city: freshData?.city || '',
        street: freshData?.street || '',
        plz: freshData?.plz || '',
        avatarUrl: freshData?.avatarUrl || '',
        availability: freshData?.availability || '',
        foodForm: freshData?.foodForm || '',
        foodMenu: freshData?.foodMenu || '',
        allergies: freshData?.allergies || '',
        drinksSelection: freshData?.drinksSelection || '',
        billingType: freshData?.billingType || '',
        staffNeeded: freshData?.staffNeeded || '',
        equipmentRent: freshData?.equipmentRent || '',
        furnitureRent: freshData?.furnitureRent || '',
        wasteDisposal: freshData?.wasteDisposal || '',
        serviceStyle: freshData?.serviceStyle || '',
        tastingRequested: freshData?.tastingRequested || '',
        terms_conditions: freshData?.terms_conditions || '',
        role: 'Catering'
      });
    } catch (e) { console.error("Fehler beim Caterer-Load:", e); }
  }, [ticketName]);


  const handleInplaceChange = (e) => {
    const { name, value } = e.target;
    setLocalFields(prev => ({ ...prev, [name]: value }));
  };
  // ⭐ PRÜFT, OB DIESER PARTNER BEREITS EIN FAVORIT IST
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      const found = savedFavs.some(f => f && f.name && f.name.toLowerCase() === (ticketName || "").toLowerCase());
      setIsFavorite(found);
    } catch (e) { console.error(e); }
  }, [ticketName]);

  // ⚡ TOGGLE-FUNKTION: FAVORIT HINZUFÜGEN ODER ENTFERNEN
  const handleToggleFavorite = () => {
    try {
      let savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      
      if (isFavorite) {
        // Entfernen
        savedFavs = savedFavs.filter(f => f && f.name && f.name.toLowerCase() !== ticketName.toLowerCase());
        setIsFavorite(false);
        alert("Partner aus den B2B-Favoriten entfernt! ☆");
      } else {
        // Hinzufügen
        const newFav = {
          name: ticketName,
          role: localFields.role || 'Catering',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Premium-Service: ${localFields.project_name}` : 'Gemerkter B2B-Partner'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Partner erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error("Fehler beim Favoriten-Toggle:", e); }
  };
  const handleSave = () => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles')) || [];
      const updatedProfile = { ...userData, ...localFields, name: ticketName };
      const index = savedProfiles.findIndex(p => p && p.name && p.name.trim().toLowerCase() === ticketName.toLowerCase());
      if (index > -1) { savedProfiles[index] = updatedProfile; } else { savedProfiles.push(updatedProfile); }
      localStorage.setItem('gigsda_profiles', JSON.stringify(savedProfiles));
      setUserData(updatedProfile);
      setIsEditing(false);
      alert("B2B-Catererprofil erfolgreich aktualisiert! 🥂🍽️");
    } catch (e) { console.error("Fehler beim Speichern:", e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE GASTRO-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      
      {/* 📡 AUTOMATISCHES CREW-REQUEST-CENTER (BLITZT NUR BEI NEUEN ANFRAGEN AUF) */}
      <CrewRequestCenter currentProfileName={ticketName} />
      <ProfileHeaderBox
        currentProfileName={ticketName}
        localFields={localFields} // oder wie dein Daten-State in dieser Datei heißt
        isFavorite={isFavorite}
        handleToggleFavorite={handleToggleFavorite}
      />

      {/* 📊 ASYMMETRISCHES 2-SPALTEN-LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* LINKS: EDITIERUNG ODER REAKTIVE DATENANZEIGE */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-emerald-400 uppercase font-black tracking-widest block">// EDIT-MODE: CATERING PROTOCOL</span>
              
              {/* GASTRO INPUTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Firmenname</label>
                  <input type="text" name="project_name" value={localFields.project_name} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Form (Buffet, Menü, Foodtruck)</label>
                  <input type="text" name="foodForm" value={localFields.foodForm} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Speiseplan / Auszug Spezialitäten</label>
                  <input type="text" name="foodMenu" value={localFields.foodMenu} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" placeholder="e.g. Mediterranes Galabuffet, Flying Fingerfood" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Allergien & Ernährungsformen</label>
                  <input type="text" name="allergies" value={localFields.allergies} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" placeholder="e.g. Vegane Menüs, Glutenfreie Alternativen verfügbar" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Getränke-Auswahl</label>
                  <input type="text" name="drinksSelection" value={localFields.drinksSelection} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Abrechnungsart</label>
                  <input type="text" name="billingType" value={localFields.billingType} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" placeholder="e.g. Pauschale / Nach Verbrauch" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Servicepersonal stellbar?</label>
                  <input type="text" name="staffNeeded" value={localFields.staffNeeded} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Miet-Equipment (Besteck, Gläser)</label>
                  <input type="text" name="equipmentRent" value={localFields.equipmentRent} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Müllentsorgung & Reinigung</label>
                  <input type="text" name="wasteDisposal" value={localFields.wasteDisposal} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Probeessen / Tasting möglich?</label>
                  <input type="text" name="tastingRequested" value={localFields.tastingRequested} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[8px] text-slate-600 uppercase block font-bold">Rahmenbedingungen & Mindestbuchung</label>
                  <textarea rows="2" name="terms_conditions" value={localFields.terms_conditions} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => { setLocalFields({ ...userData }); setIsEditing(false); }} className="px-3 py-1.5 bg-slate-900 border border-red-500/20 text-slate-400 text-[10px] font-bold uppercase rounded-xl">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase rounded-xl">✓ SAVE DETAILS</button>
              </div>
            </div>
          ) : (
            /* CATERER SCHREIBSCHUTZ DATENBLÖCKE */
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-emerald-400 uppercase font-black block tracking-widest">// CULINARY & SERVICE SPECS</span>
                <p className="text-slate-400 font-bold uppercase">🍽️ Gastro-Form: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.foodForm || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">📋 Speiseplan: <span className="text-white font-normal block mt-0.5 ml-3 whitespace-pre-line">{localFields.foodMenu || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🌱 Specials/Allergien: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.allergies || 'Keine Angaben'}</span></p>
              </div>

              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-amber-400 uppercase font-black block tracking-widest">// BEVERAGE & EQUIPMENT SETUP</span>
                <p className="text-slate-400 font-bold uppercase">🥂 Getränke: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.drinksSelection || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">💰 Abrechnung: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.billingType || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">👔 Personal/Rent: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.staffNeeded} | {localFields.equipmentRent}</span></p>
                <p className="text-slate-400 font-bold uppercase">🧹 Reinigung/Tasting: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.wasteDisposal} | Tasting: {localFields.tastingRequested}</span></p>
              </div>

              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-1.5">
                <span className="text-[8px] text-slate-500 uppercase font-black block tracking-widest">// CONDITIONS & CLAUSES</span>
                <p className="text-slate-300 leading-relaxed">{localFields.terms_conditions || 'Mietbedingungen auf Anfrage.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* RECHTS: STAMMDATENBOX MIT RECHTSBÜNDIGEM AVATAR */}
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-2">
              <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// CATERING PARTNER STATE</span>
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 shadow-lg">
                <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Caterer Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service: <span className="text-white ml-1 font-normal uppercase">{localFields.project_name || 'Gigsda Gastro'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-emerald-400">Verfügbar: <span className="text-white ml-1 font-normal uppercase">{localFields.availability || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stadt: <span className="text-white ml-1 font-normal uppercase">{localFields.city || 'Nicht hinterlegt'}</span></p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kontakt: <span className="text-white ml-1 font-normal uppercase">{localFields.vorname} {localFields.nachname || ''}</span></p>
          </div>
          {!isEditing && (
            <div className="pt-4 space-y-2">
              {/* ⭐ CYBERPUNK FAVORITEN TRIGGER BUTTON */}
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${
                  isFavorite 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>

              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ GASTRO EDITIEREN</button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
