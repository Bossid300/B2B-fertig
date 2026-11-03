import React, { useState, useEffect } from 'react';
import { Landmark, Save, Eye, EyeOff, DollarSign, FileText } from 'lucide-react';
import { saveProfile } from '../services/apiService';
import { getProfilesDb } from '../services/apiService';

export default function ProfileFinanzBox({ currentProfileId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showFinance, setShowFinance] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    rate_hour: true,
    rate_day: true,
    payment_terms: true,
    tax_type: true,
    company_uid: false,
    steuernummer: false,
    gage_min: true,
    gage_max: true,
    duration_max: true
  });
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

  const canEdit = isOwner || currentProfileId === localStorage.getItem( 'gigsda_profile_id' );

  // 1. DATABASE PIPELINE: Lädt Finanzkonditionen live 
  useEffect(() => {
  getProfilesDb(currentProfileId)
    .then(profiles => {
      const found = profiles.find(
        p => p?.id === currentProfileId
      );
      if (!found) return;
      const profile =
        found.profile_json
          ? JSON.parse(found.profile_json)
          : found;

      setProfile(profile);
      setProfileData(profile);
      setShowFinance(
        profile.show_finance === true
      );
      setFieldVisibility({
        rate_hour: profile.show_rate_hour !== false,
        rate_day: profile.show_rate_day !== false,
        payment_terms: profile.show_payment_terms !== false,
        tax_type: profile.show_tax_type !== false,
        company_uid: profile.show_company_uid === true,
        steuernummer: profile.show_steuernummer === true,
        gage_min: profile.show_gage_min !== false,
        gage_max: profile.show_gage_max !== false,
        duration_max: profile.show_duration_max !== false
      });
      setFormData({
        company_uid:
          profile.company_uid ||
          profile.uid ||
          '',
        steuernummer:
          profile.steuernummer || '',
        tax_type:
          profile.tax_type || 'regel',
        rate_hour:
          profile.rate_hour || '',
        rate_day:
          profile.rate_day || '',
        payment_terms:
          profile.payment_terms ||
          '14_netto',
        gage_min:
          profile.gage_min || '',
        gage_max:
          profile.gage_max || '',
        duration_max:
          profile.duration_max || ''
      });
    })
  .catch(console.error);

}, [currentProfileId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE PIPELINE: Sichert das Abrechnungs-Protokoll permanent in die DB
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profileData,

        company_uid: formData.company_uid,
        steuernummer: formData.steuernummer,
        tax_type: formData.tax_type,
        rate_hour: formData.rate_hour,
        rate_day: formData.rate_day,
        payment_terms: formData.payment_terms,
        gage_min: formData.gage_min,
        gage_max: formData.gage_max,
        duration_max: formData.duration_max,

        show_finance: showFinance,
        ...Object.fromEntries(
          Object.entries(fieldVisibility).map(([field, visible]) => [`show_${field}`, visible])
        )
      };
      
      const saveProfileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;

      await saveProfile({
        profileId: saveProfileId,
        profile: updatedProfile
      });

      setProfile(updatedProfile);
      setProfileData(updatedProfile);
      alert(
        "B2B Abrechnungs-Protokoll erfolgreich verschlüsselt eingebrannt! 💾📇"
      );
      setIsEditing(false);
    } catch (e) {
      console.error(
        "Fehler beim Speichern der Finanzen:",
        e
      );
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
const canShowField = (field) => canEdit || fieldVisibility[field];
const hasVisibleFinanceField = Object.entries(formData).some(
  ([field, value]) => value && canShowField(field)
);
if (!canEdit && !hasVisibleFinanceField) return null;

const toggleFieldVisibility = (field) => {
  setFieldVisibility(prev => ({ ...prev, [field]: !prev[field] }));
};
const renderFieldToggle = (field) => (
  <button
    type="button"
    onClick={() => toggleFieldVisibility(field)}
    aria-label={`Sichtbarkeit ${field} umschalten`}
    title={fieldVisibility[field] ? 'Für andere sichtbar' : 'Für andere ausgeblendet'}
    className="text-slate-400 hover:text-white"
  >
    {fieldVisibility[field] ? <Eye size={12} /> : <EyeOff size={12} />}
  </button>
);

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
    <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
      
      {/* HEADER DER BOX */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Landmark size={14} className="text-amber-500" />
          <span className="text-xs font-black tracking-widest uppercase">// Finanz- und Abwicklungsvereinbarung</span>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <button 
              type="button" 
              onClick={async () => {
                try {
                  const updatedShow =
                    !showFinance;
                  const updatedProfile = {
                    ...profileData,
                    show_finance: updatedShow
                  };
                  const profileId =
                    updatedProfile.id ||
                    updatedProfile.profileId ||
                    localStorage.getItem(
                      'gigsda_profile_id'
                    );

                  await saveProfile({
                    profileId,
                    profile: updatedProfile
                  });

                  setProfile(updatedProfile);
                  setProfileData(updatedProfile);
                  setShowFinance(updatedShow);
                } catch (e) {
                  console.error(
                    'Fehler beim Umschalten der Finanzsichtbarkeit:',
                    e
                  );
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
              data-profile-edit-trigger onClick={() => setIsEditing(true)}
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
      {(canShowField('rate_hour') || canShowField('rate_day') || canShowField('gage_min') || canShowField('gage_max') || canShowField('duration_max') || canShowField('payment_terms')) && <div className="space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900/50 pb-1 flex items-center gap-1">
          <DollarSign size={10} /> Honorar & Kalkulationsbasis
        </div>
        
        {canShowField('rate_hour') && <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Stundensatz (B2B Basis):</span>
          <span className="text-white font-bold">{rate_hour ? `${rate_hour} ,- EUR` : 'Auf Anfrage'}</span>
        </div>}
        
        {canShowField('rate_day') && <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Tagessatz / Dry-Hire:</span>
          <span className="text-amber-400 font-black">{rate_day ? `${rate_day} ,- EUR` : 'Auf Anfrage'}</span>
        </div>}

        {(canShowField('gage_min') || canShowField('gage_max')) && <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Gagen-Spanne (Live):</span>
          <span className="text-emerald-400 font-bold">
            {canShowField('gage_min') || canShowField('gage_max')
              ? `${canShowField('gage_min') ? gage_min || 0 : 'Privat'} - ${canShowField('gage_max') ? gage_max || '∞' : 'Privat'} EUR`
              : 'Auf Anfrage'}
          </span>
        </div>}

        {canShowField('duration_max') && <div className="flex justify-between py-1 border-b border-slate-900/30">
          <span className="text-slate-500">Max. Spieldauer:</span>
          <span className="text-white font-medium">{duration_max ? `${duration_max} Min.` : 'Nicht spezifiziert'}</span>
        </div>}
        
        {canShowField('payment_terms') && <div className="flex justify-between py-1">
          <span className="text-slate-500">Zahlungsziel / Fälligkeit:</span>
          <span className="text-white font-medium">{getPaymentTermsLabel(payment_terms)}</span>
        </div>}
      </div>}


          {/* BUSINESS CREDENTIALS */}
          {(canShowField('company_uid') || canShowField('steuernummer') || canShowField('tax_type')) && <div className="space-y-2 p-3 bg-slate-900/10 border border-slate-900 rounded-2xl">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900/50 pb-1 flex items-center gap-1">
              <FileText size={10} /> Fiskalische Stammdaten
            </div>
            {canShowField('company_uid') && <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500">Umsatzsteuer-ID (UID):</span> 
              <span className="text-white font-mono">{company_uid || 'Nicht hinterlegt'}</span>
            </div>}
            {canShowField('steuernummer') && <div className="flex justify-between py-1 border-b border-slate-900/30">
              <span className="text-slate-500">Steuernummer (Finanzamt):</span> 
              <span className="text-white font-mono">{steuernummer || 'Intern verankert'}</span>
            </div>}
            {canShowField('tax_type') && <div className="flex justify-between py-1">
              <span className="text-slate-500">Steuerliche Verrechnung:</span> 
              <span className="text-slate-300 font-medium truncate max-w-[60%]">{getTaxTypeLabel(tax_type)}</span>
            </div>}
          </div>}

        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LINKER BLOCK: SÄTZE & FRISTEN */}
            <div className="space-y-3 p-3 bg-slate-900/20 border border-slate-900 rounded-2xl">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">// KALKULATIONS-INPUTS</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// STUNDENSATZ (EUR)</span>{renderFieldToggle('rate_hour')}</div>
                  <input type="number" name="rate_hour" value={rate_hour || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 65" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// TAGESSATZ (EUR)</span>{renderFieldToggle('rate_day')}</div>
                  <input type="number" name="rate_day" value={rate_day || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 500" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// ZAHLUNGSZIEL</span>{renderFieldToggle('payment_terms')}</div>
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
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// MINDESTGAGE (EUR)</span>{renderFieldToggle('gage_min')}</div>
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
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// MAXIMALGAGE (EUR)</span>{renderFieldToggle('gage_max')}</div>
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
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// MAX. SPIELDAUER (MIN)</span>{renderFieldToggle('duration_max')}</div>
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
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// UMSATZSTEUER-ID (UID)</span>{renderFieldToggle('company_uid')}</div>
                <input type="text" name="company_uid" value={company_uid || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono uppercase" placeholder="e.g. ATU12345678" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// STEUERNUMMER</span>{renderFieldToggle('steuernummer')}</div>
                <input type="text" name="steuernummer" value={steuernummer || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono" placeholder="e.g. 12 345/6789" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500 font-bold">// STEUERLICHE EINSTUFUNG</span>{renderFieldToggle('tax_type')}</div>
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
            <button type="button" data-profile-action="cancel" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">Abbrechen</button>
            <button type="submit" data-profile-action="save" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)]"><Save size={12} /> Speichern</button>
          </div>
        </form>
      )}
    </div>
  );
}
