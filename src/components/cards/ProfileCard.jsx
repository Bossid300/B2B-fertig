import React from 'react';


export default function ProfileCard({
  user,
  onProfile,
  onRequest,
  isGuest = false
}) {


const roleStyles = {
  Veranstalter:
    "bg-pink-500/10 border border-pink-500/30 text-pink-400",
  Künstler:
    "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400",
  Techniker:
    "bg-purple-500/10 border border-purple-500/30 text-purple-400",
  Location:
    "bg-orange-500/10 border border-orange-500/30 text-orange-400",
  Material:
    "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
  Verleiher:
    "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400",
  Catering:
    "bg-amber-500/10 border border-amber-500/30 text-amber-400",
  Logistik:
    "bg-blue-500/10 border border-blue-500/30 text-blue-400",
  Security:
    "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400",
  Design:
    "bg-violet-500/10 border border-violet-500/30 text-violet-400",
  Fan:
    "bg-slate-500/10 border border-slate-500/30 text-slate-300"
};
const role = user.role || user.type || "Künstler";
const roleClass =
  roleStyles[role] ||
  "bg-slate-900 border-slate-800 text-slate-400";

  
const roleTextColor = {
  Veranstalter: "text-pink-400",
  Künstler: "text-cyan-400",
  Techniker: "text-purple-400",
  Location: "text-orange-400",
  Material: "text-yellow-400",
  Verleiher: "text-yellow-400",
  Catering: "text-amber-400",
  Logistik: "text-blue-400",
  Security: "text-indigo-400",
  Design: "text-violet-400",
  Fan: "text-slate-300"
};
const idClass =
  roleTextColor[role] || "text-slate-400";

  return (
    <div 
        className="bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col group hover:border-slate-800 transition-all duration-300 min-h-[300px]"
    >
        {/* OBERES BANNER-BILD */}
        <div className="h-24 w-full relative overflow-hidden bg-slate-900">
        <img 
            // 🔒 DER UNZERSTÖRBARE BANNER-LINK: Holt das echte slide1_url direkt aus eurem Datenbank-Eintrag!
            src={user.slide1_url || user.bannerUrl || 'https://unsplash.com'} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <span
            className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm z-10 ${roleClass}`}
            >
            {user.role || user.type || 'Künstler'}
            </span>
        </div>

        {/* AVATARBILD */}
        <div className="absolute top-12 left-4 z-20">
        <div className="w-16 h-16 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl">
            {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600 bg-slate-900">
                {user.name?.substring(0, 2).toUpperCase()}
            </div>
            )}
        </div>
        </div>

        {/* TEXT-KÖRPER */}
        <div className="p-4 pt-7 flex-grow flex flex-col justify-between pl-4">
        <div className="mb-4">
            <h3 className="text-xl font-black uppercase text-white tracking-wide group-hover:text-cyan-400 transition-colors">
            {user.name}
            </h3>
            <p className="text-[11px] uppercase mt-0.5">
            <span className="text-slate-600">
                // MEMBER-ID:
            </span>{" "}
            <span className={idClass}>
                {user.id || "N/A"}
            </span>
            </p>
        </div>

        {/* 🔒 UNZERSTÖRBARE LIVE-VARIABLEN: Holt die echten Werte direkt aus gigsda_profiles! */}
        <div className="pt-3 border-t border-slate-900 flex justify-between text-xs text-slate-400 font-mono">
            <span>STADT: <strong className="text-slate-200">{user.city || 'Nicht hinterlegt'}</strong></span>
            <span>GENRE: <strong className="text-slate-200">{user.genre || 'Allround'}</strong></span>
        </div>

        {/* BUTTONS */}
        {!isGuest && (
        <div className="grid grid-cols-2 gap-2 mt-5 pt-3 border-t border-slate-900/60">
            <button
            onClick={onProfile}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center"
            >
            PROFIL
            </button>

            {/* 📬 SCHIESST DAS ECHTE OVERLAY-POPUP AUF */}
            <button
            onClick={onRequest}
            className="bg-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase py-2 rounded-xl transition-all duration-300 cursor-pointer text-center tracking-wider w-full animate-pulse"
            >
            ANFRAGEN ✎
            </button>

        </div>
        )}
        </div>
    </div>
  );
}