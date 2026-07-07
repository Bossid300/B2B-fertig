import React from "react";
import GigsdaPass from "../components/GigsdaPass";

const profiles =
  JSON.parse(localStorage.getItem("gigsda_profiles")) || [];

const profile =
  profiles.find(p => p.id === "GIGS-7677");


const events =
  JSON.parse(localStorage.getItem("gigsda_events")) || [];

const references = events.filter(evt => {
  const hasJoined =
    Array.isArray(evt.crew) &&
    evt.crew.some(member =>
      member &&
      member.name === profile?.name &&
      (member.status === "accepted" ||
       member.status === "confirmed")
    );

  const isOwner =
    evt.ownerId === profile?.id;

  return hasJoined || isOwner;
});


export default function ArtistPortfolio() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* 01 // HERO STAGE */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950">
            <div className="relative h-[500px] overflow-hidden">
            <img
            src={profile?.slide1_url}
            alt="Hero"
            className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
            </div>


            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-10">
                <p className="text-cyan-400 tracking-[0.8em] uppercase text-sm">
                Gigsda Portfolio
                </p>

                <h1 className="text-5xl font-bold mt-2">
                {profile?.name}
                </h1>

                <p className="text-slate-300 mt-3 text-lg">
                {profile?.category}
                </p>

                <p className="text-slate-400 mt-2">
                Rock • Akustik • Eigene Songs
                </p>

                <div className="no-print flex gap-3 mt-6">
                <button className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold">
                    Hörprobe
                </button>

                <button className="no-print px-5 py-3 rounded-xl border border-slate-700">
                    Booking
                </button>
                </div>
            </div>
        </section>

        {/* WHY THIS ARTIST */}
        <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">🎵 Eigene Songs</h3>
            <p className="text-slate-400">
            Authentische Musik mit eigenem Stil.
            </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">🎤 Live Erfahrung</h3>
            <p className="text-slate-400">
            Bühnenpräsenz und Livemusik.
            </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">🤝 Direkt buchbar</h3>
            <p className="text-slate-400">
            Transparent und unkompliziert.
            </p>
        </div>
        </section>

        {/* SNAPSHOT */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-8">
            Artist Snapshot
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

            <div className="space-y-4">
            <p>
            <strong>Genre:</strong> {profile?.genre || "-"}
            </p>

            <p>
            <strong>Standort:</strong> {profile?.city || "-"}
            </p>

            <p>
            <strong>Formation:</strong> {profile?.formation || "-"}
            </p>
            </div>

            <div>
            <p className="text-slate-400 leading-relaxed">
            {profile?.description || "Keine Beschreibung vorhanden."}
            </p>
            </div>

        </div>
        </section>

        {/* MEDIA SHOWCASE */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-8">
            Media Showcase
        </h2>
        <div className="grid md:grid-cols-3 gap-6">

            {[1, 2, 3].map((num) => {

            const name = profile?.[`audio${num}_name`];
            const url = profile?.[`audio${num}_url`];

            if (!url) return null;

            return (
                <div
                key={num}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
                >
                <h3 className="font-semibold mb-4">
                    {name}
                </h3>
                <audio controls className="w-full">
                    <source src={url} type="audio/mpeg" />
                    Dein Browser unterstützt Audio nicht.
                </audio>
                </div>
            );
            })}
        </div>
        </section>

        {/* GALLERY */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-8">
            Visual Gallery
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((num) => {
            const image = profile?.[`gallery_slot${num}_url`];
            const title = profile?.[`gallery_slot${num}_title`];
            if (!image) return null;
            return (
                <div
                key={num}
                className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
                >
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="p-4">
                    <p className="text-sm text-slate-300">
                    {title}
                    </p>
                </div>
                </div>
            );
            })}
        </div>
        </section>


        {/* BOOKING CENTER */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Booking Center
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                E-Mail
            </h3>

            <p>{profile?.email}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                Telefon
            </h3>

            <p>{profile?.phone}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                Webseite
            </h3>
            <p>{profile?.website}</p>
            </div>
        </div>
        </section>


        {/* ARTIST STORY */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Artist Story
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                Einleitung
                </h3>

                <p className="text-slate-300 leading-relaxed">
                    {profile?.einleitung || "Keine Einleitung vorhanden."}
                </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                    Karriere
                </h3>
                <p className="text-slate-300 leading-relaxed">
                    {profile?.karriere || "Keine Karriereinformationen vorhanden."}
                </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                    Persönliches
                </h3>

                <p className="text-slate-300 leading-relaxed">
                    {profile?.privates || "Keine weiteren Informationen vorhanden."}
                </p>
            </div>

        </div>

        </section>


        {/* REFERENCES */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            References
        </h2>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">

            <h3 className="text-xl font-semibold mb-4">
            Aktuelle Projekte & Engagements
            </h3>

            <p className="text-slate-400 leading-relaxed">
            Referenzen werden automatisch aus GIGSDA Projekten und Events
            generiert. Alle Veranstaltungen, Produktionen und Engagements,
            bei denen ein Künstler, Crew-Mitglied oder Veranstalter beteiligt
            ist, erscheinen hier automatisch.
            </p>

            <div className="mt-6 border-t border-slate-800 pt-6">

            <p className="text-cyan-400 font-mono text-sm">
                REFERENZSYSTEM AKTIV
            </p>

            {references.length > 0 ? (
            <div className="space-y-2 mt-4">
                {references.map(ref => (
                <div
                    key={ref.id}
                    className="rounded-xl bg-slate-950 border border-slate-800 p-3"
                >
                    <div className="font-semibold text-white">
                    {ref.title}
                    </div>

                    <div className="text-slate-400 text-sm">
                    {ref.date}
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-slate-500 text-sm mt-2">
                Noch keine automatisch erkannten Referenzen vorhanden.
            </p>
            )}

            </div>

        </div>

        </section>


        {/* TECH OVERVIEW */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Tech Overview
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Formation</h3>
            <p>{profile?.formation}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Hauptinstrument</h3>
            <p>{profile?.mainInstrument}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Nebeninstruments</h3>
            <p>{profile?.subInstruments}</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Showdauer</h3>
            <p>{profile?.duration_max} Minuten</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Setup / Check</h3>
            <p>{profile?.setup_time} Minuten</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">Monitoring</h3>
            <p>{profile?.rider_monitors}</p>
            </div>

        </div>

        </section>


        {/* TECHNICAL RIDER */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Technical Rider
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-4">
                Technical Rider PDF
            </h3>

                <a
                href={profile?.rider_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline break-all"
                >
                📄 Rider öffnen
                </a>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-4">
                Stageplot
            </h3>

            <a
                href={profile?.stageplot_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline break-all"
            >
                🗺️ Stageplot öffnen
            </a>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-4">
                Monitoring
            </h3>

            <p className="text-slate-300">
                {profile?.rider_monitors}
            </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-4">
                Backline
            </h3>

            <p className="text-slate-300">
                {profile?.rider_backline}
            </p>
            </div>

        </div>

        </section>


        {/* PASS */}
        <GigsdaPass profile={profile} />

    </div>
  );
}