export default function CommunityAlertModal({
  message,
  onClose
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">

      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl p-6">

        <h2 className="text-2xl font-black text-cyan-400 mb-4">
          🚨 COMMUNITY INFORMIERT
        </h2>

        <p className="text-slate-300 mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl"
        >
          WEITER
        </button>

      </div>
    </div>
  );
}