import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import {
  getPassChallenge,
  getProfileById
} from "../../services/apiService";

export default function ChallengePrintPage({
  challengeId,
}) {

  const [challenge, setChallenge] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const loadChallenge = async () => {
    try {

      const result =
        await getPassChallenge(challengeId);

      setChallenge(result.challenge);

      const profileResult =
        await getProfileById(
          result.challenge.location_profile_id
        );

      setProfile(profileResult.profile);

    } catch (error) {

      console.error(error);

    }
  };

  if (!challenge) {

    return (
      <div className="text-white p-10">
        Lade Aktionsblatt...
      </div>
    );

  }

  const qrLink =
    `https://gigsda.com/?challenge=${challenge.id}`;

  const locationName =
    localStorage.getItem(
      "gigsda_user_name"
    ) || "Location";

  const profileJson =
    profile?.profile_json
      ? JSON.parse(profile.profile_json)
      : null;

  return (

    
    <div className="bg-slate-900 min-h-screen py-8 flex justify-center items-center print:bg-white print:py-0">
      <div
        id="challenge-print"
        className="bg-white text-black p-8 rounded-xl shadow-2xl print:shadow-none print:p-4"
        style={{
          width: "190mm",
          margin: "0 auto"
        }}
      >
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center border-b-2 border-black pb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-wider">
              GIGSDA
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide mt-1">
              PASS CHALLENGE
            </h2>
          </div>

          {/* Location, Gewinn & Member Info Bereich */}
          <div className="grid grid-cols-2 gap-8 pt-2">

            {/* Linke Spalte */}
            <div className="space-y-5">

              <div>
                <div className="text-sm font-bold tracking-wider text-slate-600 uppercase">
                  Location
                </div>

                <div className="text-2xl font-extrabold text-black">
                  {profileJson?.Klarname}
                </div>
                <div className="text-xl font-extrabold text-black">
                  {challenge.title}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold tracking-wider text-slate-600 uppercase">
                  Gewinnspiel
                </div>

                <div className="text-xl font-bold text-black">
                  {challenge?.prize}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold tracking-wider text-slate-600 uppercase">
                  Ansprechpartner
                </div>

                <div className="text-base font-bold text-black">
                  {profile?.name}
                </div>

                <div className="text-sm font-mono text-slate-700">
                  MEMBER-ID: {profile?.id}
                </div>
              </div>

            </div>

            {/* Rechte Spalte */}
            <div className="flex justify-center items-start">

              <div className="border-2 border-black p-2 bg-slate-50 rounded-lg w-56 h-56 overflow-hidden">

                <img
                  src={
                    profile?.avatarMediaUrl ||
                    profileJson?.avatarUrl
                  }
                  alt=""
                  className="w-full h-full object-cover"
                />

              </div>

            </div>

          </div>

          {/* So geht's */}
          <div className="grid grid-cols-2 gap-8 border-t-2 border-black pt-6">

            {/* Linke Seite */}
            <div>

              <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">
                So geht's
              </h3>

              <ol className="text-base space-y-2 font-medium list-decimal list-inside">
                <li>QR-Code scannen</li>
                <li>Das geheime Wort finden</li>
                <li>Codewort eingeben</li>
                <li>Losnummer erhalten</li>
                <li>Screenshot speichern</li>
                <li>Gewinnerverlosung nicht verpassen!</li>
              </ol>

            </div>

            {/* Rechte Seite */}
            <div className="flex flex-col items-center justify-center">

              <div className="p-4 border-4 border-black bg-white rounded-lg shadow-md">

                <QRCode
                  value={qrLink}
                  size={180}
                />

              </div>

              <div className="mt-3 text-sm font-semibold uppercase tracking-wide">
                Jetzt teilnehmen
              </div>

            </div>

          </div>

          {/* Footer & Sponsor */}
          <div className="border-t-2 border-black pt-4 mt-6">

            <div className="text-center text-xl font-bold mb-4">
              Viel Glück 🍀
            </div>

            <img
              src="https://www.gigsda.com/og-image.jpg"
              alt="GIGSDA"
              className="w-full rounded-lg border border-slate-300"
            />

          </div>

        </div>
      </div>
    </div>
  );
}