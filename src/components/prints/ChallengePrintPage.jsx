import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { getPassChallenge } from "../../services/apiService";

export default function ChallengePrintPage({
  challengeId,
}) {

  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const loadChallenge = async () => {
    try {

      const result =
        await getPassChallenge(challengeId);

      setChallenge(result.challenge);

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

  
  return (

    <div id="challenge-print">
      <div
        id="challenge-print"
        className="bg-white text-black p-4"
        style={{
          width: "190mm",
          margin: "0 auto"
        }}
      >
      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-2">
          GIGSDA
        </h1>

        <h2 className="text-3xl font-bold text-center mb-8">
          PASS CHALLENGE
        </h2>

        <div className="border-t border-b py-6 mb-8">
          <div className="text-xl font-bold">
            LOCATION
          </div>

          <div className="text-3xl">
            {locationName}
          </div>
        </div>

        <div className="border-b py-6 mb-8">
          <div className="text-xl font-bold">
            GEWINNSPIEL
          </div>

          <div className="text-3xl">
            {challenge?.prize}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-4">
            SO GEHT'S
          </h3>

          <ol className="text-xl space-y-3">
            <li>1. QR-Code scannen</li>
            <li>2. Das geheime Wort finden</li>
            <li>3. Codewort eingeben</li>
            <li>4. Losnummer erhalten</li>
            <li>5. Screenshot speichern</li>
          </ol>
        </div>

        <div className="flex justify-center mb-8">
          <div className="p-4 border-4 border-black">
            <QRCode
              value={qrLink}
              size={260}
            />
          </div>
        </div>

        <div className="text-center text-sm mb-4">
          {qrLink}
        </div>

        <div className="text-center text-2xl font-bold">
          Viel Glück 🍀
        </div>

        <div className="text-center mt-4">
          www.gigsda.com
        </div>

      </div>
    </div>
    </div>
  );
}