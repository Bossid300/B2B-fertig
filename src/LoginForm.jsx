import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginForm({ onLoginSuccess, onBack, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotMode) {
      // Passwort vergessen Ablauf simulieren
      if (email) {
        setMessage('🔑 Ein Link zum Zurücksetzen wurde an deine E-Mail gesendet!');
      }
    } else {
      // Normaler Login-Erfolg simulieren
      if (email && password) {
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl my-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">{isForgotMode ? 'Passwort zurücksetzen' : 'Willkommen zurück'}</h2>
          <p className="text-xs text-slate-500 mt-1">gigsda.com Mitgliederbereich</p>
        </div>
        <button onClick={onBack} className="text-[11px] text-slate-500 hover:text-white transition-colors">Abbrechen</button>
      </div>

      {message ? (
        <div className="space-y-4 text-center py-4">
          <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">{message}</p>
          <button onClick={() => { setIsForgotMode(false); setMessage(''); }} className="text-xs text-cyan-400 hover:underline">Zurück zum Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500">E-Mail-Adresse</span>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-slate-600" />
              <input 
                type="email" required placeholder="deine@adresse.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl h-11 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700"
              />
            </div>
          </div>

          {!isForgotMode && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Passwort</span>
                <button type="button" onClick={() => setIsForgotMode(true)} className="text-[10px] text-slate-500 hover:text-cyan-400 transition-colors">Vergessen?</button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-4 h-4 text-slate-600" />
                <input 
                  type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl h-11 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-600 hover:text-slate-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold h-11 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-cyan-500/10">
            {isForgotMode ? 'Link anfordern' : 'Einloggen'} <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            Noch kein Konto?{' '}
            <button type="button" onClick={onSwitchToRegister} className="text-emerald-400 font-semibold hover:underline">Jetzt registrieren</button>
          </p>
        </form>
      )}
    </div>
  );
}
