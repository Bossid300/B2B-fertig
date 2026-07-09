import React, { useEffect, useMemo, useState } from "react";
import ArtistTechRiderBox from "./components/ArtistTechRiderBox";
import LocationRaeumeBox from "./components/LocationRaeumeBox";
import ProfileSkillBox from "./components/ProfileSkillBox";
import ProfileEquipmentBox from "./components/ProfileEquipmentBox";
import RiderCard from "./components/cards/RiderCard";

export default function RiderZentrale({ onBack, activeEvent, setFavorites }) {
  
  const [currentEvent, setCurrentEvent] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(1);

  useEffect(() => {
    if (currentEvent?.locationRoom) {
      setSelectedRoom(
        currentEvent.locationRoom
      );
    }
  }, [currentEvent]);

  useEffect(() => {
    try {
      const events = JSON.parse(
        localStorage.getItem("gigsda_events") || "[]"
      );

      const allProfiles = JSON.parse(
        localStorage.getItem("gigsda_profiles") || "[]"
      );

      setProfiles(allProfiles);

      const targetId =
        activeEvent?.id ||
        activeEvent?.eventId ||
        activeEvent?._id;

      if (!targetId) {
        const activeStored = JSON.parse(
          localStorage.getItem("gigsda_active_event") || "null"
        );
        targetId = activeStored?.id;
      }

      const event = events.find(
        (ev) =>
          ev &&
          (
            ev.id === targetId ||
            ev.eventId === targetId ||
            ev._id === targetId
          )
      );

      if (event) {
        setCurrentEvent(event);
      }
    } catch (err) {
      console.error("RiderZentrale Load Error:", err);
    }
  }, [activeEvent]);

  const crewMembers = useMemo(() => {
    if (!currentEvent?.crewIds?.length) return [];

    return currentEvent?.crewIds
      .map((id) => profiles.find((p) => p.id === id))
      .filter(Boolean);
  }, [currentEvent, profiles]);

  const riderCenter = currentEvent?.riderCenter || {};

  const confirmedCount = crewMembers.filter(
    (member) => riderCenter?.[member.id]?.confirmed
  ).length;

  const progress =
    crewMembers.length > 0
      ? Math.round((confirmedCount / crewMembers.length) * 100)
      : 0;

  const handleConfirm = () => {
    if (!selectedMember || !currentEvent) return;

    try {
      const events = JSON.parse(
        localStorage.getItem("gigsda_events") || "[]"
      );

      const updatedEvents = events.map((evt) => {
        if (evt.id !== currentEvent?.id) return evt;

        return {
          ...evt,
          riderCenter: {
            ...(evt.riderCenter || {}),
            [selectedMember.id]: {
              confirmed: true,
              changed: false,
              changedAt: null,
              confirmedAt: Date.now(),
            },
          },
        };
      });

      localStorage.setItem(
        "gigsda_events",
        JSON.stringify(updatedEvents)
      );

      const updatedEvent = updatedEvents.find(
        (e) => e.id === currentEvent?.id
      );

      setCurrentEvent(updatedEvent);

      window.dispatchEvent(
        new CustomEvent("route-change")
      );

      window.dispatchEvent(
        new CustomEvent("request-sent")
      );

    } catch (err) {
      console.error(
        "Rider Bestätigung Fehler:",
        err
      );
    }
  };

  const handleRoomChange = (room) => {
    setSelectedRoom(room);

    try {
      const events = JSON.parse(
        localStorage.getItem("gigsda_events") || "[]"
      );

      const updatedEvents = events.map((evt) => {
        if (evt.id !== currentEvent?.id) return evt;

        return {
          ...evt,
          locationRoom: room,
        };
      });

      localStorage.setItem(
        "gigsda_events",
        JSON.stringify(updatedEvents)
      );

      const updatedEvent = updatedEvents.find(
        (e) => e.id === currentEvent?.id
      );

      setCurrentEvent(updatedEvent);

    } catch (err) {
      console.error("Raum speichern Fehler:", err);
    }
  };

  const getStatusColor = (memberId) => {
    const confirmed =
      riderCenter?.[memberId]?.confirmed;

    return confirmed
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/5"
      : "text-red-400 border-red-500/30 bg-red-500/5";
  };

  const getStatusLabel = (memberId) => {
    const confirmed =
      riderCenter?.[memberId]?.confirmed;

    return confirmed
      ? "🟢 BESTÄTIGT"
      : "🔴 OFFEN";
  };


  if (!currentEvent) {
    return (
      <div className="p-6 text-slate-500 font-mono">
        Lade Rider-Zentrale...
      </div>
    );
  }

  {/* Rider-Renderer bauen */}
  const renderRiderContent = () => {
    if (!selectedMember) return null;

    switch (selectedMember.role) {

      case "Künstler":
        return (
          <ArtistTechRiderBox
            profile={selectedMember}
          />
        );
      
      case "Location":
      case "Halle":
      case "Venue":
        return (
          <LocationRaeumeBox
            currentProfileName={selectedMember.name}
            isOwner={true}
            selectedRoom={selectedRoom}
          />
        );

      case "Techniker":
        return (
          <div className="space-y-6">
            <ProfileSkillBox
              currentProfileName={selectedMember.name}
              isOwner={true}
            />

            <ProfileEquipmentBox
              currentProfileName={selectedMember.name}
              isOwner={true}
            />
          </div>
        );

      case "Material":
        return (
          <div>
            Material-Rider kommt hier rein
          </div>
        );

      default:
        return (
          <div>
            Rider für {selectedMember.role}
          </div>
        );
    }
  };

  {/* Karten sortierung */}
  const roleOrder = {
    Veranstalter: 1,
    Künstler: 2,
    Location: 3,
    Techniker: 4,
    Material: 5,
    Security: 6,
    Logistik: 7,
    Catering: 8
  };

  crewMembers.sort(
    (a, b) =>
      (roleOrder[a.role] || 999) -
      (roleOrder[b.role] || 999)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 text-white font-mono animate-fade-in">

      {/* HEADER */}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

        <div className="flex justify-between items-center">

          <div>
            <span className="text-[8px] bg-cyan-500/10 border border-cyan-500 text-cyan-400 font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">
              // Ebene 02: Rider-Zentrale
            </span>

            <h2 className="text-2xl font-black text-white mt-2">
              Rider-Zentrale & Freigabestatus
            </h2>

            <div className="mt-2 text-cyan-400 font-bold uppercase">
              {currentEvent?.title || "Kein Projekt"}
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl hover:border-cyan-500/40 transition-all"
          >
            ‹ Dashboard
          </button>

        </div>

        {/* PROGRESS */}

        <div className="mt-6">

          <div className="flex justify-between text-xs mb-2">

            <span className="text-slate-400">
              {confirmedCount} von {crewMembers.length} bestätigt
            </span>

            <span className="font-black text-cyan-400">
              {progress}%
            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
              style={{
                width: `${progress}%`
              }}
            />
          </div>

        </div>

      </div>

      {/* CREW-KARTEN */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {crewMembers.map((member) => {

          const confirmed =
            riderCenter?.[member.id]?.confirmed;

          const changed =
            riderCenter?.[member.id]?.changed;

          const confirmedAt =
            riderCenter?.[member.id]?.confirmedAt;

          return (
          <RiderCard
            key={member.id}
            member={member}
            status={
              changed
                ? "geaendert"
                : confirmed
                  ? "bestaetigt"
                  : "offen"
            }

            progress={
              confirmed ? 100 : 0
            }
            confirmedAt={confirmedAt}
            selected={
              selectedMember?.id === member.id
            }
            onClick={() =>
              setSelectedMember(member)
            }
              onProfileClick={() => {
                if (typeof setFavorites === "function") {
                  setFavorites(member.name);
                }
              }}
            />
          );
        })}
      </div>

      {/* DETAILBEREICH */}

      {selectedMember && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <span className="text-[8px] uppercase tracking-widest text-cyan-400">
                // Aktiver Rider
              </span>

              <h2 className="text-xl font-black mt-2">
                {selectedMember?.name}
              </h2>

              <div className="text-slate-500 text-sm">
                {selectedMember?.role}
              </div>

                {selectedMember?.role === "Location" && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-slate-400 uppercase">
                      Aktiver Raum
                    </span>

                    <select
                      value={selectedRoom}
                      onChange={(e) =>
                        handleRoomChange(
                          Number(e.target.value)
                        )
                      }

                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white text-xs"
                    >
                      <option value={1}>Raum 1</option>
                      <option value={2}>Raum 2</option>
                      <option value={3}>Raum 3</option>
                    </select>
                  </div>
                )}

            </div>

            {!riderCenter?.[selectedMember.id]?.confirmed && (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl border border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:text-white transition-all"
              >
                ✅ Rider bestätigen
              </button>
            )}

          </div>

          <div className="mt-6 border-t border-slate-800 pt-6">

            <div className="text-slate-400 text-sm mb-4">
              {renderRiderContent()}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-[8px] uppercase text-slate-500">
                  Name
                </div>

                <div className="text-white font-bold mt-1">
                  {selectedMember?.name}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-[8px] uppercase text-slate-500">
                  Rolle
                </div>

                <div className="text-cyan-400 font-bold mt-1">
                  {selectedMember?.role}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}