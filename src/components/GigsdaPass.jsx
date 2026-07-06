import React from "react";
import QRCode from "react-qr-code";

export default function GigsdaPass({ profile }) {
  if (!profile) return null;

  return (
    <section className="rounded-3xl bg-slate-950 border border-cyan-500/20 p-8">

      <h2 className="text-2xl font-bold mb-8">
        Gigsda Pass
      </h2>

      <div className="space-y-8">

        {/* VORDERSEITE */}

        <div className="w-full max-w-[700px] aspect-[1.586/1] mx-auto rounded-3xl bg-slate-900 border border-cyan-500/20 p-8">

        <div className="h-full grid grid-cols-[240px_1px_1fr] items-center">

            {/* LINKE SEITE */}
            <div className="flex flex-col items-center justify-center">
            <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-40 h-40 rounded-full mx-auto"
            />
            <p className="text-cyan-400 mt-4 tracking-[0.25em] uppercase text-lg font-bold mb-4">
                GIGSDA PASS
            </p>
            </div>

            {/* TRENNLINIE */}

            <div className="h-[80%] w-px bg-cyan-500/30 mx-auto" />

            {/* RECHTE SEITE */}
            <div className="pl-10">
            <p className="text-cyan-400 tracking-[0.25em] uppercase text-lg font-bold mb-4">
                VERIFIED MEMBER
            </p>
            <h3 className="text-5xl font-black leading-none">
                {profile.name}
            </h3>
            <div className="mt-6 text-3xl font-mono font-bold text-cyan-400 tracking-widest">
                {profile.id}
            </div>
            <div className="mt-6 inline-block px-5 py-2 rounded-full border border-cyan-500 text-cyan-400 text-sm font-bold tracking-wider">
                ARTIST MEMBER • 2026
            </div>
            </div>
        </div>
        </div>

        {/* RÜCKSEITE */}

        <div className="w-full max-w-[700px] aspect-[1.586/1] mx-auto rounded-3xl bg-slate-900 border border-cyan-500/20 p-8">
        <div className="h-full grid grid-cols-[1fr_1px_270px] items-center">

            {/* LINKE SEITE */}

            <div className="pl-6 pr-4">
            <p className="text-cyan-400 tracking-[0.25em] uppercase text-lg font-bold mb-4">
                GIGSDA
            </p>
            <h3 className="text-4xl font-black leading-tight">
                MUSIK.
            </h3>
            <h3 className="text-4xl font-black leading-tight">
                VERANSTALTUNGEN.
            </h3>
            <h3 className="text-4xl font-black leading-tight text-cyan-400">
                DABEI SEIN.
            </h3>
            <p className="mt-6 text-slate-400">
                Portfolio • Profil • Referenzen
            </p>
            <p className="mt-2 text-cyan-400 font-mono">
                www.gigsda.com
            </p>
            </div>

            {/* TRENNLINIE */}

            <div className="h-[80%] w-px bg-cyan-500/30 ml-auto mr-4" />

            {/* RECHTE SEITE */}
            <div className="flex flex-col items-center justify-center">

            <div className="w-40 h-40 rounded-2xl border border-cyan-500/20 flex items-center justify-center">
            <QRCode
                value={`https://www.gigsda.com/2026/profile/${profile.id}`}
                size={130}
                bgColor="transparent"
                fgColor="#ffffff"
            />
            </div>

            <p className="mt-4 text-cyan-400 text-xs tracking-[0.25em] uppercase">
                Digital Access
            </p>
            </div>
        </div>
        </div>

      </div>

    </section>
  );
}