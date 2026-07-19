import React from 'react';

export default function CrewCard({
  member,
  statusColor,
  statusLabel,
  actionContent,
  onRemove
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
const role =
  member.role || "Gewerk";
const roleClass =
  roleStyles[role] ||
  "bg-slate-900 border-slate-800 text-slate-400";






  return (
    <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-2xl relative overflow-hidden group">
        {/* OBERES BANNER-BILD */}
        <div className="h-24 w-full relative overflow-hidden bg-slate-900">
        <img 
            // 🔒 DER UNZERSTÖRBARE BANNER-LINK: Holt das echte slide1_url direkt aus eurem Datenbank-Eintrag!
            src={member.slide1_url || member.bannerUrl || 'https://unsplash.com'} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <span
            className={`absolute top-3 right-3 text-sm font-bold px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm z-10 ${roleClass}`}
            >
            {member.role || member.type || 'Künstler'}
            </span>
            
            <span
            className={`absolute top-3 left-3 text-sm font-black px-2 py-0.5 rounded-md tracking-wider uppercase backdrop-blur-sm ${statusColor}`}
            >
            {statusLabel}
            </span>

        </div>

        {/* AVATARBILD */}
        <div className="absolute top-12 left-4 z-20">
        <div className="w-16 h-16 rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl">
            {member.avatarUrl ? (
            <img src={member.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-600 bg-slate-900">
                {member.name?.substring(0, 2).toUpperCase()}
            </div>
            )}
        </div>
        </div>

      <div className="space-y-1">

        {actionContent}

      </div>

      <div className="flex justify-between items-center pt-2 gap-2">

        <h3 className="text-sm font-black text-white uppercase tracking-wide">
          {member.name}
        </h3>


        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-slate-600 hover:text-red-400 font-bold px-1.5 py-0.5 rounded-md hover:bg-red-500/10"
            title="Aus Projekt stornieren"
          >
            ✕
          </button>
        )}


      </div>

    </div>
  );
}