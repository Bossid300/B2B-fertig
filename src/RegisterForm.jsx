import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RegisterForm({ onBack }) {
  const [role, setRole] = useState('artist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const captchaQuestion = "Bitte addiere: 5 + 3";
  const captchaAnswer = "8";

  const handleRegister = (e) => {
    e.preventDefault();
    if (securityCode.trim() !== captchaAnswer) {
      alert("Sicherheitscode / Bot-Schutz ist nicht korrekt! Bitte versuche es erneut.");
      return;
    }
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl my-12 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-white uppercase tracking-wider">Konto erfolgreich erstellt!</h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          Willkommen bei Gigsda! Dein Account als <strong className="text-emerald-400 uppercase font-mono">{role === 'artist' ? 'Künstler' : role === 'venue' ? 'Location' : role === 'tech' ? 'Techniker' : 'Fan'}</strong> wurde angelegt. Vervollständige jetzt deine Daten im Backstage-Büro.
        </p>
        <button type="button" onClick={onBack} className="w-full h-10 bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg">
          Weiter zum Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">// Neuer Benutzerzugang</span>
          <h2 className="text-base font-black text-white">Konto erstellen</h2>
        </div>
        <button type="button" onClick={onBack} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        
        {/* 1. BENUTZERART AUSWÄHLEN */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold block">1. Wer bist du auf Gigsda?</label>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button type="button" onClick={() => setRole('artist')} className={`h-9 rounded-xl font-bold border transition-all ${role === 'artist' ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>🎸 Künstler</button>
            <button type="button" onClick={() => setRole('venue')} className={`h-9 rounded-xl font-bold border transition-all ${role === 'venue' ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>🏰 Location</button>
            <button type="button" onClick={() => setRole('tech')} className={`h-9 rounded-xl font-bold border transition-all ${role === 'tech' ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>🎛️ Techniker</button>
            <button type="button" onClick={() => setRole('fan')} className={`h-9 rounded-xl font-bold border transition-all ${role === 'fan' ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black' : 'bg-slate-950 border-slate-850 text-slate-400'}`}>🎫 Fan</button>
          </div>
        </div>

        {/* 2. Zugangsdaten */}
        <div className="space-y-3 pt-2 border-t border-slate-800/40">
          <label className="text-slate-400 font-bold block">2. Zugangsdaten</label>
          <div className="space-y-2">
            <div className="relative">
              <input type="email" required placeholder="E-Mail Adresse..." value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl h-9 px-3 text-white focus:outline-none font-sans" />
            </div>
            <div className="relative">
              <input type="password" required placeholder="Sicheres Passwort wählen..." value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl h-9 px-3 text-white focus:outline-none font-mono" />
            </div>
          </div>
        </div>

        {/* 3. BOT SCHUTZ */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
          <label className="text-slate-400 font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> 3. Sicherheitscode (Bot-Schutz)
          </label>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
            <span className="font-mono text-slate-400 font-bold tracking-wide bg-slate-900 border border-slate-800 px-2 py-1 rounded">{captchaQuestion}</span>
            <input type="text" required placeholder="Antwort..." value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} className="w-20 bg-slate-900 border border-slate-800 rounded-lg h-8 px-2 text-center text-white font-mono font-bold focus:outline-none" />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button type="submit" className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black h-10 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95">
            Registrierung abschließen
          </button>
        </div>

        {/* 4. SOCIAL MEDIA LOGINS (OHNE ICON-IMPORT FÜR 100% STABILITÄT) */}
        <div className="space-y-2 pt-3 border-t border-slate-800/60 text-center">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Oder via Social-Media</span>
          <button 
            type="button" 
            onClick={() => { setIsSuccess(true); setRole('artist'); }}
            className="w-full h-9 bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600 text-blue-400 hover:text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="font-mono lowercase text-xs font-bold">[f]</span> Blitz-Registrierung mit Facebook
          </button>
        </div>

      </form>
    </div>
  );
}
