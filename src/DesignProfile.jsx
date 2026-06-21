import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';
import ProfileHeaderBox from './components/ProfileHeaderBox'; // Ganz oben importieren

export default function DesignProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [localFields, setLocalFields] = useState({
    name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', availability: '', role: 'Design',
    design_focus: '', inventory_specs: '', pyro_license: '', company_uid: '', terms_conditions: ''
  });

  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      const freshData = currentProj || { id: "DSN-" + Math.floor(Math.random() * 9000 + 1000), name: ticketName || '', role: 'Design' };
      setUserData(freshData);
      setLocalFields({
        ...freshData, name: ticketName || '', role: 'Design',
        project_name: freshData?.project_name || '', design_focus: freshData?.design_focus || '',
        inventory_specs: freshData?.inventory_specs || '', pyro_license: freshData?.pyro_license || '',
        company_uid: freshData?.company_uid || '', terms_conditions: freshData?.terms_conditions || ''
      });
    } catch (e) { console.error(e); }
  }, [ticketName]);


  const handleInplaceChange = (e) => { setLocalFields(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  // ⭐ PRÜFT, OB DIESES DESIGN BEREITS EIN FAVORIT IST
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      const found = savedFavs.some(f => f && f.name && f.name.toLowerCase() === (ticketName || "").toLowerCase());
      setIsFavorite(found);
    } catch (e) { console.error(e); }
  }, [ticketName]);

  const handleToggleFavorite = () => {
    try {
      let savedFavs = JSON.parse(localStorage.getItem('gigsda_favorites') || '[]');
      if (isFavorite) {
        savedFavs = savedFavs.filter(f => f && f.name && f.name.toLowerCase() !== ticketName.toLowerCase());
        setIsFavorite(false);
        alert("Bühnenbildner aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Design',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Stage Design: ${localFields.project_name}` : 'Gemerkte Deko-Crew'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Bühnenbildner erfolgreich zu den Favoriten hinzugefügt! ★");
      }
      localStorage.setItem('gigsda_favorites', JSON.stringify(savedFavs));
    } catch (e) { console.error(e); }
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
      alert("B2B-Designprofil erfolgreich aktualisiert! 🎨⚡");
    } catch (e) { console.error(e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE DESIGN-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">

      <ProfileHeaderBox currentProfileName={ticketName} />
      <CrewRequestCenter currentProfileName={ticketName} />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-pink-400 uppercase font-black block tracking-widest">// EDIT-MODE: DESIGN CODE</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input type="text" name="project_name" value={localFields.project_name} onChange={handleInplaceChange} placeholder="Firmenname / Studio" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                <input type="text" name="design_focus" value={localFields.design_focus} onChange={handleInplaceChange} placeholder="Fokus (Bühnenbau, Visuals, Deko)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                <input type="text" name="inventory_specs" value={localFields.inventory_specs} onChange={handleInplaceChange} placeholder="Möbel / LED-Messebau Vorrat" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none sm:col-span-2" />
                <input type="text" name="pyro_license" value={localFields.pyro_license} onChange={handleInplaceChange} placeholder="Pyrotechnik-Zertifikat / Scheine vorhanden?" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none sm:col-span-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-slate-900 text-slate-400 text-[10px] font-bold uppercase rounded-xl">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/40 text-pink-400 text-[10px] font-bold uppercase rounded-xl">✓ SAVE</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-pink-400 uppercase font-black block tracking-widest">// STAGE ARTISTRY DETAILS</span>
                <p className="text-slate-400 font-bold uppercase">🎨 Design-Stil: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.design_focus || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">📦 Deko-Bestand: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.inventory_specs || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">💥 Pyrotechnik: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.pyro_license || 'Keine Angaben'}</span></p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono text-[10px]">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// DESIGNER STATE</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
              <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="text-slate-400 font-bold uppercase">Studio: <span className="text-white ml-1 font-normal">{localFields.project_name || 'Gigsda Creative'}</span></p>
          </div>
          {!isEditing && (
            <div className="pt-4 space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${isFavorite ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ DEKO EDITIEREN</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
