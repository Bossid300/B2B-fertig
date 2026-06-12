import React, { useState, useEffect } from 'react';
import CrewRequestCenter from './CrewRequestCenter';

export default function SecurityProfile({ ticketName, onNavigate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [localFields, setLocalFields] = useState({
    name: ticketName || '', project_name: '', vorname: '', nachname: '', website: '', city: '', plz: '', street: '', phone: '', email: '',
    avatarUrl: '', bannerUrl: '', slide1_url: '', slide2_url: '', slide3_url: '', availability: '', role: 'Security',
    // Specific fields
    guard_count: '', certifications: '', crowd_management: '', company_uid: '', terms_conditions: ''
  });

  useEffect(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('gigsda_profiles') || '[]');
      const currentProj = savedProfiles.find(p => p && p.name && p.name.trim().toLowerCase() === (ticketName || "").trim().toLowerCase());
      const freshData = currentProj || { id: "SEC-" + Math.floor(Math.random() * 9000 + 1000), name: ticketName || '', role: 'Security' };
      setUserData(freshData);
      setLocalFields({
        ...freshData, name: ticketName || '', role: 'Security',
        project_name: freshData?.project_name || '', guard_count: freshData?.guard_count || '',
        certifications: freshData?.certifications || '', crowd_management: freshData?.crowd_management || '',
        company_uid: freshData?.company_uid || '', terms_conditions: freshData?.terms_conditions || ''
      });
    } catch (e) { console.error(e); }
  }, [ticketName]);

  const slides = [
    localFields.bannerUrl || 'https://unsplash.com',
    localFields.slide1_url || 'https://unsplash.com',
    localFields.slide2_url || 'https://unsplash.com',
    localFields.slide3_url || 'https://unsplash.com'
  ];

  const nextSlide = () => { setCurrentSlide((prev) => (prev + 1) % slides.length); };
  const prevSlide = () => { setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); };
  const handleInplaceChange = (e) => { setLocalFields(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  // ⭐ PRÜFT, OB DIESE SECURITY BEREITS EIN FAVORIT IST
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
        alert("Sicherheitsdienst aus den B2B-Favoriten entfernt! ☆");
      } else {
        const newFav = {
          name: ticketName,
          role: 'Security',
          city: localFields.city || 'Nicht hinterlegt',
          avatarUrl: localFields.avatarUrl || '',
          note: localFields.project_name ? `Guard Service: ${localFields.project_name}` : 'Gemerkter Ordnungsdienst'
        };
        savedFavs.push(newFav);
        setIsFavorite(true);
        alert("Sicherheitsdienst erfolgreich zu den Favoriten hinzugefügt! ★");
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
      alert("B2B-Securityprofil erfolgreich aktualisiert! 🛡️⚡");
    } catch (e) { console.error(e); }
  };

  if (!userData) return <div className="p-6 text-xs text-slate-600 font-mono">// INITIALISIERE SECURITY-HUB...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl relative">
      <CrewRequestCenter currentProfileName={ticketName} />
      <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/60 relative mb-6 group">
        <img src={slides[currentSlide]} alt="Sec Slide" className="w-full h-full object-cover opacity-20 transition-all duration-500" />
        <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs">‹</button>
        <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs">›</button>
        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[8px] bg-red-500/10 border border-red-500 text-red-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">🛡️ SECURITY SERVICE</span>
          <h1 className="text-lg font-black uppercase text-white tracking-wide mt-1">{localFields.project_name || 'Unbenannter Sicherheitsdienst'}</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <span className="text-[8px] text-red-400 uppercase font-black block tracking-widest">// EDIT-MODE: SECURITY PROTOCOL</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input type="text" name="project_name" value={localFields.project_name} onChange={handleInplaceChange} placeholder="Firmenname" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                <input type="text" name="guard_count" value={localFields.guard_count} onChange={handleInplaceChange} placeholder="Stellbare Ordner (Anzahl)" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none" />
                <input type="text" name="certifications" value={localFields.certifications} onChange={handleInplaceChange} placeholder="Nachweise / § 34a GewO" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none sm:col-span-2" />
                <input type="text" name="crowd_management" value={localFields.crowd_management} onChange={handleInplaceChange} placeholder="Crowd-Management / Wellenbrecher-Erfahrung" className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[10px] outline-none sm:col-span-2" />
                <textarea rows="2" name="terms_conditions" value={localFields.terms_conditions} onChange={handleInplaceChange} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[10px] outline-none resize-none font-mono" placeholder="Mietkonditionen..." />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-slate-900 text-slate-400 text-[10px] font-bold uppercase rounded-xl">✕ CANCEL</button>
                <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-red-500/10 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase rounded-xl">✓ SAVE</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-[10px]">
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 space-y-3">
                <span className="text-[8px] text-red-400 uppercase font-black block tracking-widest">// SECURITY PROTECTION METRICS</span>
                <p className="text-slate-400 font-bold uppercase">🛡️ Zertifikate: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.certifications || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">👥 Crew-Größe: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.guard_count || 'Keine Angaben'}</span></p>
                <p className="text-slate-400 font-bold uppercase">🌊 Crowd-Control: <span className="text-white font-normal block mt-0.5 ml-3">{localFields.crowd_management || 'Keine Angaben'}</span></p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-5 flex flex-col justify-between min-h-[350px]">
          <div className="space-y-3 font-mono text-[10px]">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">// GUARD AVAILABILITY STATE</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
              <img src={localFields.avatarUrl || 'https://unsplash.com'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="text-slate-400 font-bold uppercase">Firma: <span className="text-white ml-1 font-normal">{localFields.project_name || 'Gigsda Guard'}</span></p>
            <p className="text-slate-400 font-bold uppercase">Stadt: <span className="text-white ml-1 font-normal">{localFields.city || 'Nicht hinterlegt'}</span></p>
          </div>
          {!isEditing && (
            <div className="pt-4 space-y-2">
              <button 
                onClick={handleToggleFavorite}
                className={`w-full text-[9px] font-bold uppercase py-1.5 rounded-xl text-center border font-mono transition-all cursor-pointer tracking-wider ${isFavorite ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
              >
                {isFavorite ? '★ AUS FAVORITEN ENTFERNEN' : '☆ ZU DEN FAVORITEN'}
              </button>
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-[9px] font-bold uppercase py-1.5 rounded-xl text-center tracking-wider font-mono cursor-pointer">⚙️ SECURITY EDITIEREN</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
