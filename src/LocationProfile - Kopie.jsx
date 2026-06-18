import React, { useState } from 'react';

export default function LocationProfile({ profileData, onBack, onUpdate }) {
  // 📡 Einzel-Edit-States für jedes Gewerk
  const [editBox, setEditBox] = useState(null); // 'tech', 'logistics', 'booking', 'contact'
  const [formData, setFormData] = useState({ ...profileData });

  // 📡 Unzerstörbare Speicher-Schnittstelle
  const handleInlineSave = (section) => {
    console.log(`🔒 Sektion gesichert: ${section}`, formData);
    if (typeof onUpdate === 'function') {
      onUpdate(formData);
    } else if (typeof profileData?.handleSave === 'function') {
      profileData.handleSave(formData);
    }
    setEditBox(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full min-h-screen bg-[#070913] text-white font-sans antialiased pb-24 px-4 md:px-8">
      
      {/* 🌌 HEADER-NAVIGATIONS-ZEILE */}
      <div className="max-w-6xl mx-auto flex items-center justify-between py-6 mb-8 border-b border-slate-900/60 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-black tracking-widest text-xs">// VENUE PROFILE</span>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">
            {formData.name || "Unbenannte Location"}
          </h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-1.5 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          ➔ Zurück
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* 🏢 BOX 1: TECHNICAL SPECS (KAPAZITÄT & BÜHNE) */}
        <div className="p-[1.5px] bg-gradient-to-r from-cyan-500/40 to-purple-600/40 rounded-2xl shadow-lg transition-all duration-300">
          <div className="w-full bg-[#0b0f19] rounded-[14px] p-5 relative min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                <h2 className="text-sm font-black uppercase font-mono tracking-widest text-cyan-400">// 🛠️ Tech Specs</h2>
                {editBox !== 'tech' && (
                  <button onClick={() => setEditBox('tech')} className="text-slate-500 hover:text-cyan-400 text-xs transition-colors cursor-pointer">✏️ Bearbeiten</button>
                )}
              </div>

              {editBox === 'tech' ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">KAPAZITÄT (PAX):</label><input type="number" value={formData.capacity || ''} onChange={(e) => handleInputChange('capacity', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">BÜHNENGRÖSSE:</label><input type="text" value={formData.stageSize || ''} onChange={(e) => handleInputChange('stageSize', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="z.B. 8m x 6m" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">STROMANSCHLUSS:</label><input type="text" value={formData.powerSpecs || ''} onChange={(e) => handleInputChange('powerSpecs', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" placeholder="z.B. 32A CEE Stage Right" /></div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">KAPAZITÄT:</span> <span className="text-white font-black">{formData.capacity || "Keine Angabe"} Pax</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">BÜHNE:</span> <span className="text-cyan-400 font-bold">{formData.stageSize || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">STROM:</span> <span className="text-white truncate max-w-[200px]">{formData.powerSpecs || "Keine Angabe"}</span></div>
                </div>
              )}
            </div>
            {editBox === 'tech' && (
              <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-slate-900"><button onClick={() => setEditBox(null)} className="px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-xs font-bold font-mono">Abbrechen</button><button onClick={() => handleInlineSave('tech')} className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg text-xs font-black font-mono">Sichern</button></div>
            )}
          </div>
        </div>

        {/* 🏢 BOX 2: LOGISTICS & BACKSTAGE (LOAD-IN & ANREISE) */}
        <div className="p-[1.5px] bg-gradient-to-r from-purple-600/40 to-pink-500/40 rounded-2xl shadow-lg transition-all duration-300">
          <div className="w-full bg-[#0b0f19] rounded-[14px] p-5 relative min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                <h2 className="text-sm font-black uppercase font-mono tracking-widest text-purple-400">// 📦 Logistik</h2>
                {editBox !== 'logistics' && (
                  <button onClick={() => setEditBox('logistics')} className="text-slate-500 hover:text-purple-400 text-xs transition-colors cursor-pointer">✏️ Bearbeiten</button>
                )}
              </div>

              {editBox === 'logistics' ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">LOAD-IN WEG:</label><input type="text" value={formData.loadInPath || ''} onChange={(e) => handleInputChange('loadInPath', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400" placeholder="z.B. Ebenerdig / Rampe" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">NIGHTLINER SPECS:</label><input type="text" value={formData.nightlinerSpecs || ''} onChange={(e) => handleInputChange('nightlinerSpecs', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400" placeholder="z.B. 1x Nightliner Parkplatz inkl. Schuko" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">BACKSTAGE SPEC:</label><input type="text" value={formData.backstageSpecs || ''} onChange={(e) => handleInputChange('backstageSpecs', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-purple-400" placeholder="z.B. 2x Garderobe abschließbar" /></div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">LOAD-IN:</span> <span className="text-white font-bold">{formData.loadInPath || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">NIGHTLINER:</span> <span className="text-purple-400 font-bold">{formData.nightlinerSpecs || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">BACKSTAGE:</span> <span className="text-white truncate max-w-[200px]">{formData.backstageSpecs || "Keine Angabe"}</span></div>
                </div>
              )}
            </div>
            {editBox === 'logistics' && (
              <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-slate-900"><button onClick={() => setEditBox(null)} className="px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-xs font-bold font-mono">Abbrechen</button><button onClick={() => handleInlineSave('logistics')} className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-black font-mono">Sichern</button></div>
            )}
          </div>
        </div>

        {/* 🏢 BOX 3: BOOKING CONDITIONS (SPERRSTUNDE & MERCH FEES) */}
        <div className="p-[1.5px] bg-gradient-to-r from-pink-500/40 to-purple-600/40 rounded-2xl shadow-lg transition-all duration-300">
          <div className="w-full bg-[#0b0f19] rounded-[14px] p-5 relative min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                <h2 className="text-sm font-black uppercase font-mono tracking-widest text-pink-400">// 📅 Booking Konditionen</h2>
                {editBox !== 'booking' && (
                  <button onClick={() => setEditBox('booking')} className="text-slate-500 hover:text-pink-400 text-xs transition-colors cursor-pointer">✏️ Bearbeiten</button>
                )}
              </div>

              {editBox === 'booking' ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px] font-bold">SPERRSTUNDE (CURFEW):</label>
                    <input type="text" value={formData.curfew || ''} onChange={(e) => handleInputChange('curfew', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-pink-400" placeholder="z.B. 23:00 Uhr Livemusic max" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px] font-bold">MERCHANDISE DEAL:</label>
                    <input type="text" value={formData.merchFee || ''} onChange={(e) => handleInputChange('merchFee', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-pink-400" placeholder="z.B. 10% Club-Fee / Free selling" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-slate-500 text-[10px] font-bold">CATERING ANBINDUNG:</label>
                    <input type="text" value={formData.cateringSpecs || ''} onChange={(e) => handleInputChange('cateringSpecs', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-pink-400" placeholder="z.B. Backstage-Küche / Warm Food incl." />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">SPERRSTUNDE:</span> <span className="text-white font-bold">{formData.curfew || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">MERCHANDISE:</span> <span className="text-pink-400 font-bold">{formData.merchFee || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">CATERING:</span> <span className="text-white truncate max-w-[200px]">{formData.cateringSpecs || "Keine Angabe"}</span></div>
                </div>
              )}
            </div>
            {editBox === 'booking' && (
              <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-slate-900">
                <button onClick={() => setEditBox(null)} className="px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-xs font-bold font-mono">Abbrechen</button>
                <button onClick={() => handleInlineSave('booking')} className="px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-xs font-black font-mono">Sichern</button>
              </div>
            )}
          </div>
        </div>

        {/* 🏢 BOX 4: CONTACT & EMERGENCY LINE (ANSPRECHPARTNER) */}
        <div className="p-[1.5px] bg-gradient-to-r from-cyan-500/40 to-pink-500/40 rounded-2xl shadow-lg transition-all duration-300">
          <div className="w-full bg-[#0b0f19] rounded-[14px] p-5 relative min-h-[260px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                <h2 className="text-sm font-black uppercase font-mono tracking-widest text-cyan-400">// 📞 Ansprechpartner</h2>
                {editBox !== 'contact' && (
                  <button onClick={() => setEditBox('contact')} className="text-slate-500 hover:text-cyan-400 text-xs transition-colors cursor-pointer">✏️ Bearbeiten</button>
                )}
              </div>

              {editBox === 'contact' ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">HAUSTECHNIK NAME:</label><input type="text" value={formData.techContactName || ''} onChange={(e) => handleInputChange('techContactName', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">TELEFON / LINE:</label><input type="text" value={formData.techContactPhone || ''} onChange={(e) => handleInputChange('techContactPhone', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" /></div>
                  <div className="flex flex-col gap-1"><label className="text-slate-500 text-[10px] font-bold">EMAIL KOOP:</label><input type="email" value={formData.techContactEmail || ''} onChange={(e) => handleInputChange('techContactEmail', e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400" /></div>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">KONTAKT:</span> <span className="text-white font-bold">{formData.techContactName || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">TELEFON:</span> <span className="text-cyan-400 font-bold">{formData.techContactPhone || "Keine Angabe"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500 font-bold">EMAIL:</span> <span className="text-white truncate max-w-[200px]">{formData.techContactEmail || "Keine Angabe"}</span></div>
                </div>
              )}
            </div>
            {editBox === 'contact' && (
              <div className="flex gap-2 justify-end mt-4 pt-2 border-t border-slate-900"><button onClick={() => setEditBox(null)} className="px-3 py-1 bg-slate-900 text-slate-400 rounded-lg text-xs font-bold font-mono">Abbrechen</button><button onClick={() => handleInlineSave('contact')} className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg text-xs font-black font-mono">Sichern</button></div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
