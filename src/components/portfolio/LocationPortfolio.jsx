import React from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';

export default function LocationPortfolio({
  profile,
  onBack = null,
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
                  Gigsda Location
                </p>

                <h1 className="text-5xl font-bold mt-2">
                {profile?.Klarname || profile?.name}
                </h1>

                <p className="text-slate-300 mt-3 text-lg">
                {profile.street}, {profile?.plz}{profile?.city}
                </p>

                <p className="text-slate-400 mt-2">
                {profile?.website || "-"}
                </p>

                <div className="no-print flex gap-3 mt-6">
                  <button className="px-5 py-3 rounded-xl bg-cyan-500 text-black font-semibold">
                      {profile?.role}
                  </button>

                  <button className="no-print px-5 py-3 rounded-xl border border-slate-700">
                      Route planen
                  </button>

                  <button className="no-print px-5 py-3 rounded-xl border border-slate-700">
                      Anfragen
                  </button>

                  <button className="no-print px-5 py-3 rounded-xl border border-slate-700">
                      Favorit hinzufügen
                  </button>
                </div>
                
            </div>
        </section>

        {/* WHY THIS LOCATION */}
        <section className="grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">✅ Events möglich</h3>
            <p className="text-slate-400">
            Konzerte, Partys und Veranstaltungen.
            </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">🚗 Parkplätze vorhanden</h3>
            <p className="text-slate-400">
            Komfortable Anreise für Gäste.
            </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
            <h3 className="font-bold mb-2">🍽️ Catering möglich</h3>
            <p className="text-slate-400">
            Flexible Versorgung für Events.
            </p>
        </div>
        </section>

        {/* LOCATION SNAPSHOT */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

          <h2 className="text-2xl font-bold mb-8">
            Location Snapshot
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {/* LINKS */}
            <div className="space-y-4">

              <p>
                <strong>📐 Fläche:</strong> {profile?.room1_area} m²
              </p>

              <p>
                <strong>🧍 Stehempfang:</strong> {profile?.room1_steh} Personen
              </p>

              <p>
                <strong>🍽️ Bankett / Gala:</strong> {profile?.room1_bankett} Personen
              </p>

              <p>
                <strong>🎭 Theater:</strong> {profile?.room1_theater} Personen
              </p>

              <p>
                <strong>🪑 U-Form:</strong> {profile?.room1_uform} Personen
              </p>

              <p>
                <strong>⚡ Strombedarf:</strong> {profile?.room1_power_supply}
              </p>

              <p>
                <strong>🌙 Sperrstunde:</strong> {profile?.room1_sperrstunde}
              </p>
              <p>
              <strong>Preise, Konditionen & Mietbedingungen:</strong>
              </p>
              <p>
              {profile?.room1_konditionen}
              </p>
              <p>
              <strong>Parken & ÖPNV-Anbindung:</strong>
              </p>
              <p>
              {profile?.room1_opnv}
              </p>
            </div>

            {/* RECHTS */}
            <div>

              <h3 className="font-bold text-cyan-400 mb-4">
                Über die Location
              </h3>

              <p className="text-slate-300 leading-relaxed">
                {profile?.description || "Keine Beschreibung vorhanden."}
              </p>

              <div className="mt-8">

                <h3 className="font-bold text-cyan-400 mb-4">
                  Inhouse-Technik & Equipment
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {profile?.room1_equipment || "Keine Angaben vorhanden."}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* RAUM & BÜHNE */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Raum & Bühne
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {profile?.room1_img && (
              <div>
                <p className="text-cyan-400 text-sm mb-3">
                  Veranstaltungsraum
                </p>
                <img
                  src={profile.room1_img}
                  alt="Veranstaltungsraum"
                  className="w-full h-auto rounded-xl border border-slate-800"
                />
                
              </div>
            )}

            {profile?.room1_tech_plan && (
              <div>
                <p className="text-cyan-400 text-sm mb-3">
                  Bühnenplan & Technik
                </p>
                <img
                  src={profile.room1_tech_plan}
                  alt="Bühnenplan & Technik"
                  className="w-full h-auto rounded-xl border border-slate-800"
                />
                
              </div>
            )}

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
            Location Contact
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

        {/* STANDORT */}
        <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

          <h2 className="text-2xl font-bold mb-6">
            📍 Standort
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <h3 className="font-bold text-cyan-400 mb-4">
                Adresse
              </h3>

              <p>
                {profile?.address}
              </p>

              <p className="mt-2">
                {profile?.city}
              </p>

              <a
                href={`https://www.google.com/maps?q=${profile?.lat},${profile?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Route planen
              </a>

            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800">

              <iframe
                src={`https://maps.google.com/maps?q=${profile?.lat},${profile?.lng}&z=15&output=embed`}
                width="100%"
                height="300px"
                className="border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

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


        {/* GIGSDAPASS - NUR FÜR OWNER */}
        {isOwner && (
        <GigsdaPass 
          profile={profile}
          />
        )}

    </div>
  );
}