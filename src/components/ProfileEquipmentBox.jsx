import React, { useState, useEffect } from 'react';
import { Truck, Plus, X, Save, Eye, EyeOff, Wrench } from 'lucide-react';

export default function ProfileEquipmentBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showEquipment, setShowEquipment] = useState(true);
  const [equipmentList, setEquipmentList] = useState([]);

  // Temporäre Zustände für die Inputs beim Hinzufügen
  const [newItem, setNewItem] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [isForRental, setIsForRental] = useState('false');

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt das Inventar live aus gigsda_profiles
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
            setProfile(found);
            setShowEquipment(found.show_equipment !== false);
            setEquipmentList(Array.isArray(found.equipment) ? found.equipment : []);
          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Equipment-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const addItem = () => {
    if (!newItem.trim()) return;
    setEquipmentList(prev => [
      ...prev, 
      { 
        item: newItem.trim(), 
        detail: newDetail.trim() || 'Vorhanden', 
        rental: isForRental === 'true' 
      }
    ]);
    setNewItem('');
    setNewDetail('');
  };

  const removeItem = (indexToRemove) => {
    setEquipmentList(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 2. SAVE PIPELINE: Brennt die Equipment-Matrix permanent in die DB
  const handleSave = (e) => {
    e.preventDefault();
    const savedProfiles = localStorage.getItem('gigsda_profiles');
    if (!savedProfiles) return;

    try {
      let allProfiles = JSON.parse(savedProfiles);
      if (!Array.isArray(allProfiles)) return;

      allProfiles = allProfiles.map(p => {
        if (p && (p.name || p.user_name || p.display_name)?.trim().toLowerCase() === targetUser.trim().toLowerCase()) {
          return { 
            ...p, 
            equipment: equipmentList, 
            show_equipment: showEquipment 
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Equipment- & Fuhrpark-Protokoll erfolgreich eingebrannt! 💾🔧");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern des Equipments:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // INVENTAR ENGINE DATENSTREAM INITIALISIERT...
      </div>
    );
  }

  const isVisible = showEquipment || canEdit;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Truck size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B EQUIPMENT, GEAR & INVENTAR</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && isEditing && (
            <button 
              type="button" 
              onClick={() => setShowEquipment(!showEquipment)} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showEquipment ? 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showEquipment ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-black tracking-wider uppercase hover:border-cyan-500 transition-all cursor-pointer"
            >
              ✏️ Inventar
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="space-y-2">
          {!isVisible ? (
            <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono uppercase tracking-wide">// INVENTARLISTE VOM PROTOKOLL-INHABER GESPERRT</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {equipmentList.length > 0 ? (
                equipmentList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/40 border border-slate-900 rounded-xl flex items-center justify-between text-xs group hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Wrench size={12} className="text-slate-500 shrink-0" />
                      <span className="text-white font-bold uppercase tracking-wide truncate">{item.item}</span>
                      <span className="text-slate-500 text-[10px] font-mono shrink-0">// {item.detail}</span>
                    </div>
                    {item.rental && (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-[8px] font-black tracking-wider uppercase shrink-0">
                        Dry-Hire Option
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-600 font-mono">// AKTUELL KEIN SPEZIFISCHES B2B-EQUIPMENT REGISTRIERT</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-3 bg-slate-900/20 border border-slate-900 rounded-2xl space-y-3">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// NEUEN AUSRÜSTUNGSGEGENSTAND HINZUFÜGEN</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input 
                type="text" 
                value={newItem} 
                onChange={(e) => setNewItem(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono col-span-1" 
                placeholder="Bezeichnung (e.g. Tonpult Vi3000)" 
              />
              <input 
                type="text" 
                value={newDetail} 
                onChange={(e) => setNewDetail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono col-span-1" 
                placeholder="Menge / Detail (e.g. 1x Case / Vorhanden)" 
              />
              <div className="flex gap-2 w-full">
                <select 
                  value={isForRental} 
                  onChange={(e) => setIsForRental(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  <option value="false">🔒 Eigenbedarf</option>
                  <option value="true">🌐 Dry-Hire Verleih</option>
                </select>
                <button type="button" onClick={addItem} className="px-4 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 cursor-pointer flex items-center justify-center shrink-0">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto pr-1">
            {equipmentList.map((item, idx) => (
              <div key={idx} className="p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="uppercase font-bold text-slate-200 truncate">{item.item}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">({item.detail})</span>
                  {item.rental && <span className="text-[8px] font-mono text-cyan-400 font-black tracking-widest">// B2B RENTAL</span>}
                </div>
                <button type="button" onClick={() => removeItem(idx)} className="text-slate-500 hover:text-rose-400 cursor-pointer shrink-0 ml-2">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 text-slate-950 hover:bg-cyan-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"><Save size={12} /> Inventar Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
