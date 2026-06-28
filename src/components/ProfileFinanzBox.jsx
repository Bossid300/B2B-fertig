import React, { useState, useEffect } from 'react';
import { Landmark, Save, Eye, EyeOff, DollarSign, FileText } from 'lucide-react';

export default function ProfileFinanzBox({ currentProfileName, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showFinance, setShowFinance] = useState(false);
  const [formData, setFormData] = useState({
    rate_hour: '',
    rate_day: '',
    payment_terms: '',
    tax_type: '',
    company_uid: '',
    steuernummer: '',
    gage_min: '',
    gage_max: '',
    duration_max: ''
  });

  const targetUser = currentProfileName || localStorage.getItem('gigsda_user_name') || 'grober lackl';
  const canEdit = isOwner || targetUser.toLowerCase() === (localStorage.getItem('gigsda_user_name') || '').toLowerCase();

  // 1. DATABASE PIPELINE: Lädt Finanzkonditionen live aus gigsda_profiles
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
            setShowFinance(found.show_finance === true);
            setFormData({
              company_uid: found.company_uid || found.uid || '',
              steuernummer: found.steuernummer || '',
              tax_type: found.tax_type || 'regel',
              rate_hour: found.rate_hour || '',
              rate_day: found.rate_day || '',
              payment_terms: found.payment_terms || '14_netto',
              // HIER DIE BEIDEN ZEILEN ERGÄNZEN:
              gage_min: found.gage_min || '',
              gage_max: found.gage_max || '',
              duration_max: found.duration_max || ''
            });

          }
        }
      } catch (e) {
        console.error("Fehler in der Gigsda Finanz-Pipeline:", e);
      }
    }
  }, [targetUser, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Sichert das Abrechnungs-Protokoll permanent in die DB
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
            ...formData,
            show_finance: showFinance
          };
        }
        return p;
      });

      localStorage.setItem('gigsda_profiles', JSON.stringify(allProfiles));
      alert("B2B Abrechnungs-Protokoll erfolgreich verschlüsselt eingebrannt! 💾💼");
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Fehler beim Sichern der Finanzen:", e);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // FINANZ PROTOKOLL INITIALISIERT...
      </div>
    );
  }

  const isVisible = showFinance || canEdit;
  if (!isVisible) return null;

const { company_uid, steuernummer, tax_type, rate_hour, rate_day, payment_terms, gage_min, gage_max, duration_max } = formData;

  const getTaxTypeLabel = (type) => {
    if (type === 'klein') return 'Kleinunternehmer-Regelung (§ 19 UStG)';
    if (type === 'befreit') return 'Umsatzsteuerbefreit (B2B Ausland / Reverse-Charge)';
    return 'Regelbesteuerung (zzgl. gesetzl. MwSt.)';
  };

  const getPaymentTermsLabel = (terms) => {
    if (terms === 'sofort') return 'Sofort nach Erhalt ohne Abzug';
    if (terms === '30_netto') return '30 Tage rein netto';
    if (terms === 'anzahlung') return '50% Anzahlung / Rest nach Abnahme';
    return '14 Tage rein netto';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Landmark size={14} className="text-amber-500" />
          <span className="text-xs font-black tracking-widest uppercase">// B2B FINANCE & SETTLEMENT PROTOCOL</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <button 
              type="button" 
              onClick={() => {
                const updatedShow = !showFinance;
                setShowFinance(updatedShow);
                const savedProfiles = localStorage.getItem('gigsda_profiles');
                if (savedProfiles) {
                  let all = JSON.parse(savedProfiles);
                  all = all.map(p => p && (p.name || p.user_name || p.display_name)?.toLowerCase() === targetUser.toLowerCase() ? { ...p, show_finance: updatedShow } : p);
                  localStorage.setItem('gigsda_profiles', JSON.stringify(all));
                }
              }} 
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${showFinance ? 'text-amber-400 border-amber-500/30 bg-amber-950/10' : 'text-slate-600 border-slate-800 bg-slate-900'}`}
            >
              {showFinance ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
          )}
          {canEdit && !isEditing && (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-[10px] font-black tracking-wider uppercase hover:border-amber-500 transition-all cursor-pointer"
            >
              ✏️ Konditionen
            </button>
          )}
        </div>
      </div>

      {/* TERNARY WEICHE: ANZEIGE ODER EDITIEREN */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
          
      {/* TARIFSÄTZE */}
      <div className="space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900/50 pb-1 flex items-center gap-1">
          <DollarSign size={10} /> Honorar & Kalkulationsbasis
        </div>
        
        <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Stundensatz (B2B Basis):</span>
          <span className="text-white font-bold">{rate_hour ? `${rate_hour} ,- EUR` : 'Auf Anfrage'}</span>
        </div>
        
        <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Tagessatz / Dry-Hire:</span>
          <span className="text-amber-400 font-black">{rate_day ? `${rate_day} ,- EUR` : 'Auf Anfrage'}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Gagen-Spanne (Live):</span>
          <span className="text-emerald-400 font-bold">
            {gage_min || gage_max ? `${gage_min || 0} - ${gage_max || '∞'} EUR` : 'Auf Anfrage'}
          </span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Max. Spieldauer:</span>
          <span className="text-white font-medium">{duration_max ? `${duration_max} Min.` : 'Nicht spezifiziert'}</span>
        </div>
        
        <div className="flex justify-between py-1">
          <span className="text-slate-500">Zahlungsziel / Fälligkeit:</span>
          <span className="text-white font-medium">{getPaymentTermsLabel(payment_terms)}</span>
        </div>
      </div>


          {/* BUSINESS CREDENTIALS */}
          <div className="space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900/50 pb-1 flex items-center gap-1">
              <FileText size={10} /> Fiskalische Stammdaten
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500">Umsatzsteuer-ID (UID):</span> 
              <span className="text-white font-mono">{company_uid || 'Nicht hinterlegt'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500">Steuernummer (Finanzamt):</span> 
              <span className="text-white font-mono">{steuernummer || 'Intern verankert'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Steuerliche Verrechnung:</span> 
              <span className="text-slate-300 font-medium truncate max-w-[60%]">{getTaxTypeLabel(tax_type)}</span>
            </div>
          </div>

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LINKER BLOCK: SÄTZE & FRISTEN */}
            <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// KALKULATIONS-INPUTS</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold">// STUNDENSATZ (EUR)</span>
                  <input type="number" name="rate_hour" value={rate_hour || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 65" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 font-bold">// TAGESSATZ (EUR)</span>
                  <input type="number" name="rate_day" value={rate_day || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 500" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// ZAHLUNGSZIEL</span>
                <select name="payment_terms" value={payment_terms || '14_netto'} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer">
                  <option value="14_netto">14 Tage rein netto</option>
                  <option value="sofort">Sofort nach Erhalt ohne Abzug</option>
                  <option value="30_netto">30 Tage rein netto</option>
                  <option value="anzahlung">50% Anzahlung / Rest nach Abnahme</option>
                </select>
              </div>
                        {/* EVENT- & LIVE-KALKULATION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold">// MINDESTGAGE (EUR)</span>
              <input 
                type="number" 
                name="gage_min" 
                value={gage_min || ''} 
                onChange={handleChange} 
                className="w-full bg-[#11192e]/30 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                placeholder="e.g. 400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold">// MAXIMALGAGE (EUR)</span>
              <input 
                type="number" 
                name="gage_max" 
                value={gage_max || ''} 
                onChange={handleChange} 
                className="w-full bg-[#11192e]/30 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                placeholder="e.g. 1200"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold">// MAX. SPIELDAUER (MIN)</span>
              <input 
                type="number" 
                name="duration_max" 
                value={duration_max || ''} 
                onChange={handleChange} 
                className="w-full bg-[#11192e]/30 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
                placeholder="e.g. 90"
              />
            </div>
          </div>

            </div>

            {/* RECHTER BLOCK: STEUERN & BEHÖRDEN */}
            <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// RECHTLICHE COMPLIANCE</span>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// UMSATZSTEUER-ID (UID)</span>
                <input type="text" name="company_uid" value={company_uid || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase" placeholder="e.g. ATU12345678" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// STEUERNUMMER</span>
                <input type="text" name="steuernummer" value={steuernummer || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 12 345/6789" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold">// STEUERLICHE EINSTUFUNG</span>
                <select name="tax_type" value={tax_type || 'regel'} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono cursor-pointer">
                  <option value="regel">Regenbesteuerung (zzgl. MwSt.)</option>
                  <option value="klein">Kleinunternehmer (§ 19 UStG)</option>
                  <option value="befreit">Steuerbefreit (Reverse-Charge)</option>
                </select>
              </div>
            </div>

          </div>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]"><Save size={12} /> Konditionen Einbrennen ✓</button>
          </div>
        </form>
      )}
    </div>
  );
}
