import React from 'react';
import { Eye, EyeOff, User, Mail, Lock, Landmark, Link, Calendar, Award, Layers } from 'lucide-react';

export default function ProfileFormFields({ formData = {}, setFormData }) {
  
  // Zentrale Änderungsfunktion für Texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (typeof setFormData === 'function') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 👁️ Zentrale Umschaltfunktion für die Sichtbarkeits-Augen
  const toggleVisibility = (fieldName) => {
    if (typeof setFormData === 'function') {
      setFormData(prev => ({ 
        ...prev, 
        [`${fieldName}_visible`]: prev[`${fieldName}_visible`] === false ? true : false 
      }));
    }
  };

  // Hilfsfunktion: Prüft Sichtbarkeitsstatus
  const isFieldVisible = (fieldName) => {
    return formData[`${fieldName}_visible`] !== false;
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-400">
      
      {/* ========================================================================= */}
      {/* 🚀 OBEN: DEIN ELEGANTER, TRANSPARENTER GIGSDA-START-ASSISTENT            */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/10 border border-slate-900/80 rounded-3xl p-6 shadow-2xl space-y-4">
        <div>
          <span className="text-[8px] text-purple-400/80 font-black uppercase tracking-widest block font-mono">// PLATFORM INITIALIZATION</span>
          <h3 className="text-sm font-black text-white uppercase tracking-tight mt-0.5 flex items-center gap-1.5">
            ⭐ Dein Gigsda-Start-Assistent
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
          {/* Schritt 1 */}
          <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between h-24 relative hover:border-cyan-500/20 transition-all group">
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold group-hover:border-cyan-400/40 group-hover:text-cyan-400">1</div>
            <div>
              <span className="text-slate-300 font-bold block">✕ Portfolio befüllen</span>
              <p className="text-[10px] text-slate-500 font-sans mt-1 leading-tight">Trage deine Stammdaten und Gagen ein, um das Profil scharf zu schalten.</p>
            </div>
            <span className="text-cyan-400/80 font-bold text-[9px] uppercase tracking-wider block mt-2 hover:text-cyan-400 cursor-pointer">Jetzt eintragen ➔</span>
          </div>

          {/* Schritt 2 */}
          <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between h-24 relative text-slate-500">
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[8px]">2</div>
            <div>
              <span className="font-bold block text-slate-400">📋 Kanalliste absegnen</span>
              <p className="text-[10px] font-sans mt-1 leading-tight">Hinterlege deinen Bühnenbelegungsplan, damit Techs deine Kanäle einsehen können.</p>
            </div>
            <span className="text-slate-600 font-bold text-[9px] uppercase tracking-wider block mt-2">Rider öffnen ➔</span>
          </div>

          {/* Schritt 3 */}
          <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between h-24 relative text-slate-500">
            <div className="absolute top-3 right-3 w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[8px]">3</div>
            <div>
              <span className="font-bold block text-slate-400">📍 Umkreis-Radar orten</span>
              <p className="text-[10px] font-sans mt-1 leading-tight">Aktiviere deine GPS-Ortung im Sucher, um Clubs in deiner PLZ-Region zu scannen.</p>
            </div>
            <span className="text-slate-600 font-bold text-[9px] uppercase tracking-wider block mt-2">Radar scannen ➔</span>
          </div>
        </div>
      </div>

      <div className="text-slate-600 text-[9px] font-bold uppercase tracking-widest pt-2 font-mono">// // OP-INPUT.HTML - Profileingabemaske (Backstage)</div>

      {/* ========================================================================= */}
      {/* 💻 SEKTION A: STAMMDATEN, IDENTITÄT & DATENSCHUTZ AXIS                     */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900/60 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="text-cyan-400/80 font-bold text-[9px] uppercase tracking-widest border-b border-slate-900 pb-2 flex justify-between items-center">
          <span>// ▲ A. STAMMDATEN & IDENTITY-VERIFICATION</span>
          <span className="text-slate-700 Scaled text-[8px]">GIGSDA-ID: {formData.id || "USR-MEMBER-TEMP"}</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Künstler- / Locationname */}
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase">Künstler- / Locationname</label>
            <div className="relative">
              <input type="text" name="project_name" value={formData.project_name || ''} onChange={handleChange} placeholder="z.B. The Neon Sparks" className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl pl-3 pr-10 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/40" />
              <button type="button" onClick={() => toggleVisibility('project_name')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('project_name') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Vorname */}
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase">Vorname</label>
            <div className="relative">
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl pl-3 pr-10 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/40" />
              <button type="button" onClick={() => toggleVisibility('name')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('name') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Nachname */}
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase">Nachname</label>
            <div className="relative">
              <input type="text" name="nachname" value={formData.nachname || ''} onChange={handleChange} className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl pl-3 pr-10 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/40" />
              <button type="button" onClick={() => toggleVisibility('nachname')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('nachname') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Genre */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase">Genre</label>
            <input type="text" name="genre" value={formData.genre || ''} onChange={handleChange} placeholder="ROCK" className="w-full bg-slate-950/40 border border-slate-900/60 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500/40" />
          </div>

          {/* ⚡ DEINE GEODATEN-REIHE IN EINER LINIE (TIEFDUNKLER PREMIUM STYLE) */}
          {/* 1. PLZ */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">PLZ</label>
            <input type="text" name="plz" value={formData.plz || ''} onChange={handleChange} placeholder="5280" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
          </div>

          {/* 2. Stadt */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Stadt</label>
            <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Braunau" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
          </div>

          {/* 3. Straße & Hausnummer */}
          <div className="sm:col-span-5 space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Straße & Hausnummer</label>
            <div className="relative">
              <input type="text" name="street" value={formData.street || ''} onChange={handleChange} placeholder="Musterstraße 42" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('street')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('street') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📖 SEKTION B: BIOGRAFIE-SEKTOREN                                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="text-purple-400 font-black text-[9px] uppercase tracking-widest border-b border-slate-900 pb-2">// ▲ B. BIOGRAFIE-SEKTOREN</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Einleitung</label>
            <textarea name="einleitung" value={formData.einleitung || ''} onChange={handleChange} placeholder="Das Wichtigste in ein bis zwei Sätzen..." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all h-16 resize-none leading-relaxed" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Kontext / Karriere</label>
            <textarea name="karriere" value={formData.karriere || ''} onChange={handleChange} placeholder="Je nach Bedeutung des Musikers..." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all h-16 resize-none leading-relaxed" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Prozess / Privates</label>
            <textarea name="privates" value={formData.privates || ''} onChange={handleChange} placeholder="Kurze Beschreibung des privaten Lebens..." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all h-16 resize-none leading-relaxed" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💰 SEKTION C: FINANZEN, RECHNUNGS-UST, BANKDATEN & PAYPAL                  */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="text-emerald-400 font-black text-[9px] uppercase tracking-widest border-b border-slate-900 pb-2">// ▲ C. GAGENSTRUCTURE, FISCAL CODES & BANKING</div>
        
        {/* Gagen Zeile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Mindestgage (€)</label>
            <div className="relative">
              <input type="text" name="mindestgage" value={formData.mindestgage || ''} onChange={handleChange} placeholder="350" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('mindestgage')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('mindestgage') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Wunschgage (€)</label>
            <div className="relative">
              <input type="text" name="wunschgage" value={formData.wunschgage || ''} onChange={handleChange} placeholder="500" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('wunschgage')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('wunschgage') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">KM-Kosten (€)</label>
            <div className="relative">
              <input type="text" name="fahrtkosten" value={formData.fahrtkosten || ''} onChange={handleChange} placeholder="0.30" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('fahrtkosten')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('fahrtkosten') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* BANKDATEN & UST-NR BLOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-900">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Bankname</label>
            <div className="relative">
              <input type="text" name="bank_name" value={formData.bank_name || ''} onChange={handleChange} placeholder="Sparkasse Braunau" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('bank_name')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('bank_name') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">IBAN</label>
            <div className="relative">
              <input type="text" name="bank_iban" value={formData.bank_iban || ''} onChange={handleChange} placeholder="AT42 2040..." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('bank_iban')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('bank_iban') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">BIC</label>
            <div className="relative">
              <input type="text" name="bank_bic" value={formData.bank_bic || ''} onChange={handleChange} placeholder="SPKDAT21XXX" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('bank_bic')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('bank_bic') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Steuernummer / USt-ID</label>
            <div className="relative">
              <input type="text" name="tax_id" value={formData.tax_id || ''} onChange={handleChange} placeholder="ATU68403921" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('tax_id')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('tax_id') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* PAYPAL.ME DIGITAL PAYMENT LINK */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1">
              <span>PayPal.Me Express-Zahllink</span>
            </label>
            <div className="relative">
              <input type="text" name="paypal_link" value={formData.paypal_link || ''} onChange={handleChange} placeholder="paypal.me/WinstonJud" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-3 pr-10 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-purple-500/30 focus:bg-slate-950 transition-all" />
              <button type="button" onClick={() => toggleVisibility('paypal_link')} className="absolute right-3 top-2.5 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer">
                {isFieldVisible('paypal_link') ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Diskografie & Rider Zeilen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Diskografie</label>
            <input type="text" name="diskografie" value={formData.diskografie || ''} onChange={handleChange} placeholder="Demo Album 2025 // Live EP 2026" className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400/40 focus:bg-slate-950 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Referenzen & Support-Gigs</label>
            <input type="text" name="referenzen" value={formData.referenzen || ''} onChange={handleChange} placeholder="Support-Gig bei Rock am Inn // Gewinner Bandcontest..." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400/40 focus:bg-slate-950 transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Bandaufstellung (Rider)</label>
            <input type="text" name="bandaufstellung" value={formData.bandaufstellung || ''} onChange={handleChange} placeholder="Drums Center, Lead-Vocals vorne Mitte." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400/40 focus:bg-slate-950 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Backline</label>
            <input type="text" name="backline" value={formData.backline || ''} onChange={handleChange} placeholder="Marshall JCM800 Gitarren-Amp, Ampeg SVT Bass-Rig." className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-400/40 focus:bg-slate-950 transition-all" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖼️ SEKTION D: ALLE 4 SLIDER-BOXEN                                          */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="text-amber-400 font-black text-[9px] uppercase tracking-widest border-b border-slate-900 pb-2">// ▲ BANNER-SLIDER TEXTKONFIGURATION (VOLLSTÄNDIG)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* SLIDE 1 */}
          <div className="bg-slate-950 border border-slate-900/60 p-3 rounded-xl space-y-2">
            <span className="text-cyan-400 text-[8px] block font-black font-mono">// SLIDE 1 (Hauptbanner)</span>
            <input type="text" name="slide1_line1" value={formData.slide1_line1 || ''} onChange={handleChange} placeholder="// op-input.html" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
            <input type="text" name="slide1_line2" value={formData.slide1_line2 || ''} onChange={handleChange} placeholder="Spezialisiert: HOG4 Operator" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
          </div>
          
          {/* SLIDE 2 */}
          <div className="bg-slate-950 border border-slate-900/60 p-3 rounded-xl space-y-2">
            <span className="text-cyan-400 text-[8px] block font-black font-mono">// SLIDE 2 (Live 1)</span>
            <input type="text" name="slide2_line1" value={formData.slide2_line1 || ''} onChange={handleChange} placeholder="Live-Produktion" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
            <input type="text" name="slide2_line2" value={formData.slide2_line2 || ''} onChange={handleChange} placeholder="Großbühnen & Licht-Design" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-400" />
          </div>
          
          {/* SLIDE 3 */}
          <div className="bg-slate-950 border border-slate-900/60 p-3 rounded-xl space-y-2">
            <span className="text-cyan-400 text-[8px] block font-black font-mono">// SLIDE 3 (Live 2)</span>
            <input type="text" name="slide3_line1" value={formData.slide3_line1 || ''} onChange={handleChange} placeholder="Gala & Club-Betreuung" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
            <input type="text" name="slide3_line2" value={formData.slide3_line2 || ''} onChange={handleChange} placeholder="Perfekter Sound & Atmosphäre" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
          </div>
          
          {/* SLIDE 4 */}
          <div className="bg-slate-950 border border-slate-900/60 p-3 rounded-xl space-y-2">
            <span className="text-cyan-400 text-[8px] block font-black font-mono">// SLIDE 4 (Live 3)</span>
            <input type="text" name="slide4_line1" value={formData.slide4_line1 || ''} onChange={handleChange} placeholder="Festival Setup" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
            <input type="text" name="slide4_line2" value={formData.slide4_line2 || ''} onChange={handleChange} placeholder="Zuverlässige Systemtechnik" className="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-[11px] focus:outline-none focus:border-cyan-500/40 focus:bg-slate-900 transition-all" />
          </div>
          
        </div>
      </div>

    </div>
  );
}
