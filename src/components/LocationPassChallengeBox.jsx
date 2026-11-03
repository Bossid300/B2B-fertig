import { useState, useEffect } from "react";
import {
  createPassChallenge,
  getPassChallenges,
  getPassChallengeEntries,
  savePassChallengeWinner,
  togglePassChallenge,
  updatePassChallenge,
  deletePassChallenge
} from "../services/apiService";

import QRCode from "react-qr-code";
import ChallengePrintPage from "./prints/ChallengePrintPage";

export default function LocationPassChallengeBox({
  currentProfileId,
  isOwner
}) {

const [showCreateModal, setShowCreateModal] = useState(false);
const [title, setTitle] = useState("");
const [secretWord, setSecretWord] = useState("");
const [prize, setPrize] = useState("");
const [editingChallenge, setEditingChallenge] = useState(null);
const [challenges, setChallenges] = useState([]);
const [showEntriesModal, setShowEntriesModal] = useState(false);
const [entries, setEntries] = useState([]);
const [selectedChallenge, setSelectedChallenge] = useState(null);
const [winner, setWinner] = useState(null);
const [showQrModal, setShowQrModal] = useState(false);
const [qrLink, setQrLink] = useState("");
const [showPrintPreview, setShowPrintPreview] = useState(false);
const [printChallenge, setPrintChallenge] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [challengeToDelete, setChallengeToDelete] = useState(null);

useEffect(() => {
  loadChallenges();
}, [currentProfileId]);

const loadChallenges = async () => {
  try {
    const result = await getPassChallenges(
      currentProfileId
    );

    setChallenges(result.challenges || []);

  } catch (error) {
    console.error(error);
  }
};

const loadEntries = async (challengeId) => {
  try {

    const result =
      await getPassChallengeEntries(
        challengeId
      );
    setEntries(result.entries || []);
    setWinner(null);

    const challenge =
      challenges.find(
        (c) => c.id === challengeId
      );
    setSelectedChallenge(challenge);
    if (
      challenge &&
      challenge.winner_ticket
    ) {
      setWinner({
        ticket_number:
          challenge.winner_ticket,
      });
    }
    setShowEntriesModal(true);
  } catch (error) {
    console.error(error);
  }
};

const handleSave = async () => {
  try {
    let result;
    if (editingChallenge) {
      result = await updatePassChallenge({
        id: editingChallenge.id,
        title,
        secretWord,
        prize,
      });

      setEditingChallenge(null);

    } else {
      result = await createPassChallenge({
        locationProfileId: currentProfileId,
        title,
        secretWord,
        prize,
      });
    }

    console.log(result);

    await loadChallenges();
    setTitle("");
    setSecretWord("");
    setPrize("");
    setShowCreateModal(false);
  } catch (error) {
    console.error(error);
  }
};

if (!isOwner) {
  return null;
}


  return (
    <>
    <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white select-none mt-4">
        
        
        <h3 className="text-lg font-bold mb-2 text-white">
          GIGSDA Pass Challenge
        </h3>

        <p className="text-gray-600 mb-4">
          Erstelle eine Challenge für deine Besucher.
        </p>

        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          Challenge erstellen
        </button>

          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="w-full rounded-2xl border border-slate-800 p-4 mb-4 bg-slate-900"
            >
              <div>
                <strong>{challenge.title}</strong>
              </div>

              <div>
                Codewort: {challenge.secret_word}
              </div>

              <div>
                Preis: {challenge.prize}
              </div>

              <div>
                Teilnehmer: {challenge.participants}
              </div>

              <div>
                Status:
                {" "}
                {challenge.is_active
                  ? "✅ Aktiv"
                  : "⛔ Deaktiviert"}
              </div>

              {challenge.winner_ticket && (
                <div className="mt-2 text-green-600 font-bold">
                  🏆 Gewinner: {challenge.winner_ticket}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mt-3">

                <button
                  onClick={() => {

                  const url =
                    `https://gigsda.com/?challenge=${challenge.id}`;

                    setQrLink(url);

                    setShowQrModal(true);

                  }}
                  className="px-4 py-1.5
              rounded-lg
              border border-cyan-500/40
              bg-cyan-500/10
              text-cyan-300
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:bg-cyan-500/20
              hover:border-cyan-400
              transition"
                >
                  QR-Code für Besucher
                </button>
                <button
                  onClick={() => {

                    window.open(
                      `?printChallenge=${challenge.id}`,
                      "_blank"
                    );

                  }}
                  className="px-4 py-1.5
              rounded-lg
              border border-purple-500/40
              bg-purple-500/10
              text-purple-300
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:bg-purple-500/20
              hover:border-purple-400
              transition"
                >
                  Aktionsblatt drucken
                </button>


                <button
                  onClick={() => {

                    setTitle(challenge.title);
                    setSecretWord(challenge.secret_word);
                    setPrize(challenge.prize);

                    setEditingChallenge(challenge);

                    setShowCreateModal(true);

                  }}
                  className="px-4 py-1.5
              rounded-lg
              border border-amber-500/40
              bg-amber-500/10
              text-amber-300
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:bg-amber-500/20
              hover:border-amber-400
              transition"
                >
                  Bearbeiten
                </button>

                <button
                  onClick={async () => {

                    try {

                      await togglePassChallenge(
                        challenge.id,
                        challenge.is_active ? 0 : 1
                      );

                      await loadChallenges();

                    } catch (error) {

                      console.error(error);

                    }

                  }}
                  className={`px-4 py-1.5
              rounded-lg
              border ${
                challenge.is_active
                  ? "border-red-500/40"
                  : "border-green-500/40"
              }
              ${
                challenge.is_active
                  ? "bg-red-500/10"
                  : "bg-green-500/10"
              }
              text-${
                challenge.is_active
                  ? "red-300"
                  : "green-300"
              }
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:${
                challenge.is_active
                  ? "bg-red-500/20"
                  : "bg-green-500/20"
              }
              hover:border-${
                challenge.is_active
                  ? "red-400"
                  : "green-400"
              }
              transition`}
                >
                  {challenge.is_active
                    ? "Deaktivieren"
                    : "Aktivieren"}
                </button>

                <button
                  onClick={() =>
                    loadEntries(challenge.id)
                  }
                  className="px-4 py-1.5
              rounded-lg
              border border-green-500/40
              bg-green-500/10
              text-green-300
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:bg-green-500/20
              hover:border-green-400
              transition"
                >
                  Teilnehmer
                </button>

                <button
                  onClick={() => {

                    setChallengeToDelete(
                      challenge
                    );

                    setShowDeleteModal(true);

                  }}
                  className="px-4 py-1.5
              rounded-lg
              border border-red-500/40
              bg-red-500/10
              text-red-300
              text-xs
              font-bold
              uppercase
              tracking-wider
              hover:bg-red-500/20
              hover:border-red-400
              transition"
                >
                  Löschen
                </button>


              </div>
            </div>
          ))}
      </div>


      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-bold mb-4 text-white">
              {editingChallenge
                ? "Challenge bearbeiten"
                : "Neue Pass Challenge"}
            </h2>

            <label className="block mb-1">
              Titel
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              className="w-full mb-3 p-2 rounded"
            />
            <label className="block mb-1">
              Codewort
            </label>

            <input
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
              placeholder="Codewort"
              className="w-full mb-3 p-2 rounded"
            />
            <label className="block mb-1">
              Preis
            </label>

            <input
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="Preis"
              className="w-full mb-4 p-2 rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded"
              >
                Abbrechen
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Speichern
              </button>


            </div>

          </div>
        </div>
      )}

      {showEntriesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              Teilnehmer
            </h2>
            {selectedChallenge && (
              <div className="text-slate-300 mb-4">
                Challenge:
                {" "}
                {selectedChallenge.title}
              </div>
            )}
            <div className="max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-slate-700 py-2 text-white"
                >
                  {entry.ticket_number}
                </div>
              ))}
            </div>

            {winner && (
              <div className="mt-4 p-4 bg-green-700 rounded text-white">
                <div>
                  🎉 Gewinner
                </div>
                <div className="text-2xl font-bold mt-2">
                  {winner.ticket_number}
                </div>
              </div>
            )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={async () => {
                    if (!entries.length) return;
                    const randomIndex =
                      Math.floor(
                        Math.random() * entries.length
                      );
                    const selectedWinner =
                      entries[randomIndex];
                    setWinner(selectedWinner);
                    try {
                      await savePassChallengeWinner(
                        selectedChallenge.id,
                        selectedWinner.ticket_number
                      );
                      await loadChallenges();
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded"
                >
                  {winner
                    ? "Gewinner neu auslösen"
                    : "Gewinner ziehen"}
                </button>

                <button
                  onClick={() =>
                    setShowEntriesModal(false)
                  }
                  className="px-4 py-2 bg-slate-700 text-white rounded"
                >
                  Schließen
                </button>
              </div>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-white">
              QR-Link
            </h2>
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded mb-4">
                <QRCode
                  value={qrLink}
                  size={220}
                />
              </div>
              <div className="bg-slate-800 p-3 rounded text-white break-all w-full">
                {qrLink}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrLink);
                }}
                className="px-4 py-2 bg-cyan-600 text-white rounded"
              >
                Link kopieren
              </button>

              <button
                onClick={() =>
                  window.open(qrLink, "_blank")
                }
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Öffnen
              </button>

              <button
                onClick={() =>
                  setShowQrModal(false)
                }
                className="px-4 py-2 bg-slate-700 text-white rounded"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}


      {showPrintPreview && printChallenge && (
        <div className="fixed inset-0 bg-black z-50 overflow-auto">
          <div className="fixed top-4 right-4 flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Drucken
            </button>
            <button
              onClick={() =>
                setShowPrintPreview(false)
              }
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Schließen
            </button>
          </div>
          <ChallengePrintPage
            locationName="Arena Braunau"
            challenge={printChallenge}
            qrLink={qrLink}
          />
        </div>
      )}

      {showDeleteModal && challengeToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">
              Challenge löschen?
            </h2>
            <div className="text-slate-300 mb-4">
              {challengeToDelete.title}
            </div>
            <div className="flex gap-2">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded"
              >
                Abbrechen
              </button>

              <button
                onClick={async () => {
                  await deletePassChallenge(
                    challengeToDelete.id
                  );
                  await loadChallenges();
                  setShowDeleteModal(false);
                  setChallengeToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Ja, löschen
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}