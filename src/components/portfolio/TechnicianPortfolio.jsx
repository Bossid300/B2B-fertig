import React from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';
export default function TechnicianPortfolio({
  profile,
  onBack = null,
  setView
}) {

const loggedInProfileId =
  localStorage.getItem('gigsda_profile_id');

const isOwner =
  String(loggedInProfileId) === String(profile?.id);
  
  const handlePrintPdf = () => {
    window.print();
    };

    const events =
    eventService.getEvents();

    const references =
      events.filter(evt => {
        const hasJoined =
          Array.isArray(evt.crew) &&
          evt.crew.some(member =>
            member &&
            member.name === profile?.name &&
            (
              member.status === "accepted" ||
              member.status === "confirmed"
            )
          );
        const isOwner =
          evt.ownerId === profile?.id;
        return hasJoined || isOwner;
      });


    if (!profile) {
      return null;
    }


    console.log(profile);


  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      {/* 01 // HERO STAGE */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950">
            <div className="relative h-[550px] overflow-hidden">
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
                {profile?.genre}
                </p>


                <PortfolioActionBar
                    profile={profile}
                    isOwner={isOwner}
                    setView={setView}
                />
                
            </div>
        </section>


        {/* TECHNICAN STORY */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Technican Story
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                Einleitung
                </h3>

                <p className="text-slate-300 leading-relaxed">
                    {profile?.bio_einleitung || "Keine Einleitung vorhanden."}
                </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                    Karriere
                </h3>
                <p className="text-slate-300 leading-relaxed">
                    {profile?.bio_karriere || "Keine Karriereinformationen vorhanden."}
                </p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                    Persönliches
                </h3>

                <p className="text-slate-300 leading-relaxed">
                    {profile?.bio_privates || "Keine weiteren Informationen vorhanden."}
                </p>
            </div>

        </div>

        </section>

        {/* SNAPSHOT */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
        <h2 className="text-2xl font-bold mb-8">
            Technican Snapshot
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

            <div className="space-y-4">
                <p>
                <strong>Kompetenzen:</strong>
                    <ul className="space-y-2 mt-3">
                    {profile?.skills?.map((skill, idx) => (
                        <li key={idx}>
                        • {skill}
                        </li>
                    ))}
                    </ul>
                </p>

                <p>
                <strong>Zertifizierung:</strong>
                    <ul className="space-y-2 mt-3">
                    {profile?.certificates?.map((cert, idx) => (
                        <li key={idx}>
                        • {cert}
                        </li>
                    ))}
                    </ul>
                </p>

                <p>
                <strong>Eigenes Equipment:</strong>
                    <ul className="space-y-2 mt-3">
                    {profile?.equipment?.map((eq, idx) => (
                        <li key={idx}>
                        • {eq.item}
                        </li>
                    ))}
                    </ul>
                </p>

            </div>

            <div>
                <p className="text-slate-400 leading-relaxed">
                {profile?.description || "Keine Beschreibung vorhanden."}
                </p>
            </div>

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

        
        {/* FINANZEN */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-8">
            Honorare
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                Stundensatz
            </h3>

            <p>{profile?.rate_hour} €</p>
            <h3 className="font-semibold mb-3">
                Tagessatz
            </h3>

            <p>{profile?.rate_day} €</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                Gage min
            </h3>

            <p>{profile?.gage_min} €</p>
            
            <h3 className="font-semibold mb-3">
                Gage max
            </h3>

            <p>{profile?.gage_max} €</p>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h3 className="font-semibold mb-3">
                Max Dauer
            </h3>
            <p>{profile?.duration_max} h</p>
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

        {/* FÜR VERANSTALTER ODER AGENCY */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

            <h2 className="text-2xl font-bold mb-8">
                    Für Veranstalter oder Agency
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                <h3 className="font-semibold mb-4">
                        Printinfo als PDF öffnen
                </h3>
                    <a
                        href="/profiles/Techniker Portfolio - Ride the Light (Buzz Lightyear).pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                        📄 Portfolio PDF öffnen
                    </a>
                </div>
            </div>
        </section>


        {/* GIGSDAPASS - NUR FÜR OWNER */}
        {isOwner && (
        <GigsdaPass 
          profile={profile}
          />
        )}

    </div>
  );
}