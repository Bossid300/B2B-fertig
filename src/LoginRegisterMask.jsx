import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { createProfile, createAuthUser, getLoginUser, getProfileById } from './services/apiService';
import { Turnstile } from "@marsidev/react-turnstile";

export default function LoginRegisterMask({ isRegisteringInitial, onLoginSuccess }) {
  const [turnstileToken, setTurnstileToken] = useState('');

  const [isRegistering, setIsRegistering] = useState(isRegisteringInitial);
  
  // ⚡ FEHLERFREIE SPEICHER-ZUSTÄNDE (Exakt an die Inputs gekoppelt)
  const [loginField, setLoginField] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState('');

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaA] = useState(
    Math.floor(Math.random() * 14) + 1
  );

  const [captchaB] = useState(
    Math.floor(Math.random() * 14) + 1
  );

  const [honeypot, setHoneypot] = useState('');

  // 💥 FUNKTION 1: DAS INTELLIGENTE LOGIN (Durchsucht die Festplatte)
  // 🛠️ REAKTIVES LOGIN-UHRWERK (BOMBENFEST UND IMMUN GEGEN VARIABLEN-CRASHES)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const inputName =
      loginField
        ? loginField.trim()
        : "";

    // DEV LOGIN
    if (
      window.location.hostname === "localhost" &&
      inputName === "admin" &&
      loginPass === "admin"
    ) {

      localStorage.setItem("gigsda_logged_in", "true");
      localStorage.setItem("gigsda_user_name", "Winston Jud");
      localStorage.setItem("gigsda_reg_role", "Admin");

      // ECHTES PROFIL
      localStorage.setItem(
        "gigsda_profile_id",
        "GIGS-3582"
      );

      localStorage.setItem(
        "gigsda_session",
        JSON.stringify({
          authUserId: "AUTH-1785166313588",
          profileId: "GIGS-3582",
          loginAt: Date.now()
        })
      );
/* 
      if (!profile.name?.trim()) {
        // Profil-Assistent öffnen
      }
 */
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(
          "Winston Jud",
          "Admin"
        );
      }

      return;
    }

    const result = await getLoginUser(
      inputName,
      loginPass
    );

    if (!inputName) {
      if (typeof setErrorMsg === 'function') setErrorMsg('Bitte gib deine E-Mail-Adresse ein! 💡');
      return;
    }

    const matchedAuthUser = result.user;

    if (!result.success || !matchedAuthUser) {
      setErrorMsg("E-Mail oder Passwort falsch.");
      return;
    }

    const profileResult =
      await getProfileById(
        matchedAuthUser.profileId
      );

    const matchedProfile =
      profileResult.profile;

    if (!matchedProfile) {
      setErrorMsg("Profil konnte nicht geladen werden.");
      return;
    }

    localStorage.setItem(
      "gigsda_plan",
      matchedProfile.subscription_plan || "COMMUNITY"
    );

    localStorage.setItem(
      "gigsda_reg_role",
      matchedProfile.role || "Fan"
    );

    localStorage.setItem(
      "gigsda_user_name",
      matchedProfile.name
    );

    localStorage.setItem(
      "gigsda_profile_id",
      matchedProfile.id
    );

    localStorage.setItem(
      "gigsda_logged_in",
      "true"
    );

    localStorage.setItem(
      "gigsda_session",
      JSON.stringify({
        authUserId: matchedAuthUser.id,
        profileId: matchedProfile.id,
        loginAt: Date.now()
      })
    );

    setErrorMsg("");

    window.dispatchEvent(
      new CustomEvent("request-sent")
    );

    window.dispatchEvent(
      new CustomEvent("route-change")
    );

    if (typeof onLoginSuccess === "function") {
      onLoginSuccess(
        matchedProfile
      );
    }
  };

  // 💥 FUNKTION 2: DIE REGISTRIERUNG
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Honeypot
    if (honeypot.trim() !== '')
    {
      return;
    }

    // Captcha
    if (
      Number(captchaAnswer) !==
      (captchaA + captchaB)
    )
    {
      alert(
        'Die Sicherheitsprüfung wurde nicht korrekt gelöst.'
      );

      return;
    }

    if (!turnstileToken)
    {
      setErrorMsg(
        'Bitte die Cloudflare-Sicherheitsprüfung abschließen.'
      );

      return;
    }

    // 🔒 RIEGEL: Wenn keine Rolle ausgewählt wurde, bricht das Abschicken sofort ab!
    if (!regRole) {
      alert("Bitte wähle zuerst einen Kontotyp aus! ⚙️");
      return;
    }

    if (!regEmail.trim()) return;
    if (!regPass.trim()) return;

    // 1️⃣ Die eindeutige ID generieren (für beide Tabellen identisch)
    const generatedId = "GIGS-" + Math.floor(Math.random() * 9000 + 1000);

    // 2️⃣ ERSTER BLOCK: Das neutrale Basis-Profil
    const newProfile = {
      id: generatedId,
      name: 'Neues Mitglied',
      role: regRole
    };

    const referrer =
    localStorage.getItem(
      'gigsda_referrer'
    ) || '';

    const profileResult = await createProfile({

      turnstileToken,

      id: generatedId,
      name: '',
      role: regRole,
      profile_json: JSON.stringify({
        id: generatedId,
        name: '',
        role: regRole,
        city: '',
        bio: '',
        avatarUrl: '',
        skills: [],
        equipment: [],
        referred_by: referrer
      })
 
    });

    if (!profileResult.success)
    {
      if (profileResult.error === 'turnstile_failed')
      {
        setErrorMsg(
          'Cloudflare Sicherheitsprüfung fehlgeschlagen.'
        );
      }
      else if (profileResult.error === 'registration_limit')
      {
        setErrorMsg(
          'Zu viele Registrierungen von dieser IP. Bitte später erneut versuchen.'
        );
      }
      else if (profileResult.error === 'profile_exists')
      {
        setErrorMsg(
          'Interner ID-Konflikt. Bitte erneut versuchen.'
        );
      }
      else if (profileResult.error === 'turnstile_missing')
      {
        setErrorMsg(
          'Cloudflare Sicherheitsprüfung fehlt.'
        );
      }
      else
      {
        setErrorMsg(
          'Registrierung momentan nicht möglich.'
        );
      }

      return;
    }


    const authResult =
      await createAuthUser({
        id: "AUTH-" + Date.now(),
        email: regEmail,
        password: regPass,
        profileId: generatedId
      });

    if (!authResult.success)
    {
      if (
        authResult.error ===
        'email_exists'
      )
      {
        setErrorMsg(
          'Diese E-Mail-Adresse ist bereits registriert.'
        );
      }
      else
      {
        setErrorMsg(
          'Account konnte nicht erstellt werden.'
        );
      }

      return;
    }


    localStorage.setItem(
      "gigsda_profile_id",
      generatedId
    );

    localStorage.setItem(
      "gigsda_logged_in",
      "true"
    );

    localStorage.setItem(
      "gigsda_reg_role",
      regRole
    );

    localStorage.setItem(
      "gigsda_user_name",
      "Neues Mitglied"
    );

    localStorage.setItem(
      "gigsda_session",
      JSON.stringify({
        authUserId: "AUTH-" + Date.now(),
        profileId: generatedId,
        loginAt: Date.now()
      })
    );



    // 🚀 Erfolg an Daniels Hauptrouter funken
    onLoginSuccess(newProfile);
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6 p-4 font-mono text-xs text-slate-300 animate-fade-in">
      
      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-[11px] animate-pulse">
          ⚠️ SYSTEM-ALERT // {errorMsg}
        </div>
      )}

      {/* RESPONSIVE ZWEISPALTEN-FLEXGRID */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* LINKSEITE: FORMULAR-ZENTRALE */}
        <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
          
          {isRegistering ? (
            /* REGISTRIERUNGS-VIEW */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none uppercase">
                  Erstelle dein <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-black">Konto</span>.
                </h2>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block mt-1">// MITGLIEDER ÖKOSYSTEM INITIALISIERUNG</span>
              </div>

              {/* DIE 6 SYSTEM-ROLLEN */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[9px] text-slate-500 uppercase tracking-wider block">// Benutzerart festlegen</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'Fan', icon: '🎫', label: 'Fan', code: '[FAN_ZONE]' },
                    { id: 'Künstler', icon: '🎤', label: 'Künstler', code: '[ACT_READY]' },
                    { id: 'Location', icon: '📍', label: 'Location', code: '[VENUE_HUB]' },
                    { id: 'Veranstalter', icon: '💼', label: 'Veranstalter', code: '[ORG_CENTER]' },
                    { id: 'Techniker', icon: '🎛️', label: 'Techniker', code: '[CREW_PATCH]' },
                    { id: 'Catering', icon: '🍽️', label: 'Catering', code: '[FOOD_SUPP]' },
                    { id: 'Verleiher', icon: '🔌', label: 'Verleiher', code: '[PA_BACKLINE]' },
                    { id: 'Logistik', icon: '🚛', label: 'Logistik', code: '[CARGO_HUB]' },
                    { id: 'Security', icon: '🛡️', label: 'Security', code: '[GUARD_SYS]' },
                    { id: 'Design', icon: '🎭', label: 'Deko/Stage', code: '[STAGE_FX]' }
                  ].map(role => (
                    <button
                      key={role.id}
                      type="button"
                      // ERSETZE DEINE ZEILE 119 DURCH DIESEN UNZERSTÖRBAREN DOPPEL-BEFEHL:
                      onClick={() => { setRegRole(role.id); localStorage.setItem('gigsda_reg_role', role.id); }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-14 ${
                        regRole === role.id 
                          ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.15)]' 
                          : 'bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-800'
                      }`}
                    >
                      <span className="text-xs font-black">{role.icon} {role.label}</span>
                      <span className="text-[8px] text-cyan-500/60 block font-mono">{role.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input type="email" placeholder="E-Mail-Adresse" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-cyan-400" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input type="password" placeholder="Passwort vergeben" value={regPass} onChange={(e) => setRegPass(e.target.value)} className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-cyan-400" />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center gap-4">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-bold">
                    // Security Verification
                  </span>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white text-xs">
                      Bitte ausrechnen:
                    </span>

                    <div className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-cyan-400 font-black text-sm">
                        {captchaA} + {captchaB}
                      </span>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Ergebnis"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                />

                <div className="flex justify-center py-2">
                  <Turnstile
                    siteKey="0x4AAAAAAEZ82UJTgdRg2lFW"
                    onSuccess={(token) => {
                      setTurnstileToken(token);
                    }}
                  />
                </div>
              </div>

              <button 
              type="submit" 
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black h-11 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer mt-2 shadow-lg font-mono
              ">
                Konto erstellen & Einloggen ✨
              </button>

            </form>
          ) : (
            /* LOGIN-VIEW */
            <form onSubmit={handleLoginSubmit} className="space-y-5 my-auto py-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none uppercase">
                  Control Center <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-black">Login</span>.
                </h2>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block mt-1">// PROFI-ZUGANG SEKTION_03</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="E-Mail-Adresse" 
                    value={loginField} 
                    onChange={(e) => setLoginField(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input 
                    type="password" 
                    placeholder="Passwort" 
                    value={loginPass} 
                    onChange={(e) => setLoginPass(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black h-11 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl font-mono">
                Einloggen 💥
              </button>
            </form>
          )}


          {/* 🚪 DANIELS ORIGINALER FORMULAR-WECHSLER (Bereinigt und optimiert) */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
            {isRegistering ? (
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono cursor-pointer"
              >
                // BEREITS REGISTRIERT? HIER EINLOGGEN ⚡
              </button>
            ) : null}
          </div>

          {/* 📦 NEUE EIGENSTÄNDIGE REGISTRIERUNGS- UND VORTEILS-BOX (Wird nur im Login-Modus angezeigt) */}
          {!isRegistering && (
            <div className="mt-8 bg-slate-950/80 border border-slate-900 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
              {/* Dekorativer Cyberpunk-Lichtstreifen oben */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              
              <div className="mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono mb-1">
                  // NOCH KEIN GIGSDA-KONTO?
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tritt dem zweiseitigen B2B-Marktplatz bei und verbinde dich direkt mit der Industrie.
                </p>
              </div>

              {/* ⚡ DIE SCHÄRFSTEN B2B-VORTEILE AUF EINEN BLICK */}
              <ul className="space-y-2 mb-5 text-[11px] font-mono text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span><strong className="text-white">9 dedizierte B2B-Rollen:</strong> Volle Sichtbarkeit für Catering, Rental, Locations, Bands & Crew.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span><strong className="text-white">Regional-Radar-Finder:</strong> Werdet direkt in eurer Umgebung von Bookern gesucht und sofort per ID gefunden.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span><strong className="text-white">Projekt-Cockpit:</strong> Volle Kontrolle über eure Gigs, Gagen-Kalkulationen und die Crew-Shortlist.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span><strong className="text-white">Privacy Control:</strong> Bestimme selbst per Auge-Schalter, welche Stammdaten das Netzwerk sehen darf.</span>
                </li>
              </ul>

              {/* 🚀 DER DEUTLICHE CALL-TO-ACTION BUTTON */}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl shadow-lg transition-all duration-300 cursor-pointer text-center block hover:bg-slate-900/50"
              >
                JETZT REGISTRIEREN ⚡
              </button>

            </div>
          )}

        </div>

        {/* RECHTSEITE: SOCIAL MEDIA NETZWERK */}

      </div>

    </div>
  );
}
