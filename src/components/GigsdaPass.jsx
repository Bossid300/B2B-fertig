import React, { useState, useEffect } from 'react';
import { getProfilesDb } from '../services/apiService';
import QRCode from "react-qr-code";

export default function GigsdaPass({
  setView
}) {
    const [profile, setProfile] = useState(null);

    const targetUser =
    localStorage.getItem('gigsda_user_name');

    useEffect(() => {

    getProfilesDb()
        .then(profiles => {

        const found = profiles.find(
            p =>
            p &&
            (p.name || p.user_name || p.display_name)
                ?.trim()
                .toLowerCase() ===
            targetUser?.trim().toLowerCase()
        );

        if (found) {

            if (found.profile_json) {
            setProfile(
                JSON.parse(found.profile_json)
            );
            } else {
            setProfile(found);
            }

        }

        })
        .catch(console.error);

    }, [targetUser]);

    if (!profile) {
    return (
        <div className="p-8">
        Pass wird geladen...
        </div>
    );
    }


  return (
    <section className="rounded-3xl bg-slate-950 border border-cyan-500/20 p-8">
      <h2 className="text-2xl font-bold mb-8">
        Gigsda Pass
      </h2>
      <div className="space-y-8">
        {/* VORDERSEITE */}
        <div
        className="w-full max-w-[700px] md:aspect-[1.586/1]
                    mx-auto rounded-3xl
                    bg-slate-900
                    border border-cyan-500/20
                    p-8
                    relative overflow-hidden"
        >
        <div
        className="absolute
                    -bottom-20
                    -right-20
                    w-64
                    h-64
                    bg-fuchsia-500/15
                    rounded-full
                    blur-3xl
                    pointer-events-none"
        />
        <div className="h-full grid grid-cols-1 md:grid-cols-[250px_1px_1fr] items-center">

            {/* LINKE SEITE */}
            <div className="flex flex-col items-center justify-center">
                <div className="w-42 h-42 rounded-full p-[4px]
                            bg-gradient-to-r
                            from-cyan-400
                            to-fuchsia-500
                            shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                >
                    <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-40 h-40 rounded-full mx-auto object-cover"
                    />
                    <p className="text-cyan-400 mt-8 tracking-[0.25em] uppercase text-lg font-bold">
                    GIGSDA PASS
                    </p>
                </div>
            </div>

            {/* TRENNLINIE */}
            <div className="hidden md:block h-[80%] w-px bg-cyan-500/30" />

            {/* RECHTE SEITE */}
            <div className="text-center md:text-left  md:ml-10">
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

        {/* PASSPRINT */}
        <div className="flex justify-center py-4">
        <button
            onClick={() => setView('passPrint')}
            className="
            w-5 h-5
            rounded-full
            bg-yellow-400
            animate-pulse
            shadow-[0_0_15px_rgba(250,204,21,0.8)]
            "
            title="GIGSDA Pass drucken"
        />
        </div>


        {/* RÜCKSEITE */}
        <div
        className="w-full max-w-[700px] md:aspect-[1.586/1]
                    mx-auto rounded-3xl
                    bg-slate-900
                    border border-cyan-500/20
                    p-8
                    relative overflow-hidden"
        >
        <div
        className="absolute
                    -bottom-20
                    -right-20
                    w-64
                    h-64
                    bg-fuchsia-500/15
                    rounded-full
                    blur-3xl
                    pointer-events-none"
        />
            <div className="
            h-full
            grid
            grid-cols-1
            md:grid-cols-[1fr_1px_1fr]
            items-center
            ">
            {/* LINKE SEITE */}
            <div className="text-center md:text-left px-4
                ">
                <p className="text-cyan-400 tracking-[0.25em] uppercase text-lg font-bold mb-4">
                    GIGSDA
                </p>
                <h3 className="text-2xl md:text-4xl font-black leading-tight">
                    MUSIK.
                </h3>
                <h3 className="text-2xl md:text-4xl font-black leading-tight">
                    VERANSTALTUNGEN.
                </h3>
                <h3 className="text-2xl md:text-4xl font-black leading-tight text-cyan-400">
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
            <div className="hidden md:block h-[80%] w-px bg-cyan-500/30" />

            {/* RECHTE SEITE */}
            <div className="
                flex
                flex-col
                items-center
                justify-center
                ">
                <div className="w-40 h-40 rounded-2xl border border-cyan-500/20 flex items-center justify-center">
                <QRCode
                    value={`https://www.gigsda.com/2026?portfolio=${profile.id}`}
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