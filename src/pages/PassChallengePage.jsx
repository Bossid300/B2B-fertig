import { useEffect, useState } from "react";
import {
  getPassChallenge,
  submitPassChallenge
} from "../services/apiService";


export default function PassChallengePage({
  challengeId
}) {
  const [challenge, setChallenge] = useState(null);
  const [enteredWord, setEnteredWord] = useState("");
  const [message, setMessage] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  const storageKey =
  `challenge_${challengeId}`;

  useEffect(() => {
    loadChallenge();

    const existingTicket =
      localStorage.getItem(
        `challenge_${challengeId}`
      );

    if (existingTicket) {
      setTicketNumber(existingTicket);

      setMessage(
        "✅ Du nimmst bereits teil"
      );
    }

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
      <div className="p-10 text-white">
        Lade Challenge...
      </div>
    );
  }

  if (!challenge.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">

        <div className="text-center">

          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            {challenge.title}
          </h1>

          <div className="text-red-400 text-2xl md:text-4xl font-bold mb-8">
            Challenge beendet
          </div>

          {challenge.winner_ticket && (
            <div>

              <div className="text-xl md:text-3xl mb-4">
                🏆 Gewinner
              </div>

              <div className="text-4xl md:text-7xl font-bold text-green-400">
                {challenge.winner_ticket}
              </div>

            </div>
          )}

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 bg-slate-950 border border-slate-900 rounded-3xl font-mono text-white shadow-2xl space-y-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        {challenge.title}
      </h1>

      <div className="text-xl md:text-3xl mb-8">
        Gewinn:
        {" "}
        🎁 {challenge.prize}
      </div>

      <input
        value={enteredWord}
        onChange={(e) => setEnteredWord(e.target.value)}
        placeholder="Codewort eingeben"
        className="w-full
          h-16
          mb-4
          px-4
          text-center
          text-2xl
          rounded-xl
          border
          border-slate-600
          bg-slate-800
          text-white"
      />
      <button
        disabled={!!ticketNumber}
        onClick={() => {
          if (ticketNumber) {
            return;
          }
          const correct =
            enteredWord.trim().toLowerCase() ===
            challenge.secret_word.trim().toLowerCase();
          if (correct) {
            submitPassChallenge(challenge.id)
              .then((result) => {
                setTicketNumber(result.ticketNumber);
                localStorage.setItem(
                  storageKey,
                  result.ticketNumber
                );
                setMessage(
                  "✅ Teilnahme erfolgreich"
                );
              })
              .catch((error) => {
                console.error(error);
                setMessage(
                  "❌ Fehler bei der Teilnahme"
                );
              });
          } else {
            setMessage(
              "❌ Codewort falsch"
            );
          }
        }}
        className={`w-full
          h-16
          text-2xl
          font-bold
          rounded-xl
          bg-cyan-600
          text-white 
          ${
          ticketNumber
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-cyan-600"
        }`}
      >
        {ticketNumber
          ? "Bereits teilgenommen"
          : "Teilnehmen"}
      </button>
      
      {message && (
        <div className={`mt-4 p-2 rounded ${message.includes("✅") ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}
      {ticketNumber && (
        <div className="mt-4 p-4 bg-cyan-700 rounded">

          <div className="text-sm">
            Deine Losnummer
          </div>

          <div className="text-2xl font-bold mt-2">
            {ticketNumber}
          </div>

          <div className="text-sm mt-2">
            Bitte Screenshot speichern.
          </div>

        </div>
      )}
    </div>
    </div>
  );
}