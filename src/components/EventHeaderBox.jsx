export default function EventHeaderBox({
  activeEvent,
  promoImage,
  title,
  subtitle,
  isOwner,
  ownerName,
  onBack
}) {
  return (
    <div
      className="
        relative
        flex flex-col sm:flex-row
        justify-between
        items-start sm:items-center
        border border-slate-800
        p-6
        rounded-3xl
        shadow-xl
        gap-4
        overflow-hidden
      "
      style={{
        backgroundImage: promoImage
          ? `url(${promoImage})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-slate-950
          via-slate-950/95
          via-slate-950/80
          to-transparent
        "
      />

      <div className="relative z-10">
        {activeEvent && (
          <>
            <span className="
              text-[12px]
              text-emerald-400
              font-black
              uppercase
              tracking-wider
              bg-emerald-950/40
              border
              border-emerald-500/20
              px-2.5
              py-1
              rounded-md
              inline-block
            ">
              📍 Aktives Event: {activeEvent.title}
            </span>

            <p className="text-sm text-cyan-400 mt-2">
              {isOwner
                ? `👑 Owner: ${ownerName}`
                : `🎭 Crew`
              }
            </p>
          </>
        )}

        <h2 className="text-3xl font-bold text-white mt-2">
          {title}
        </h2>

        <p className="text-slate-400 text-sm">
          {subtitle}
        </p>
      </div>

      <button
        onClick={onBack}
        className="
          relative z-10
          bg-slate-950/90
          border border-slate-800
          px-4 py-2
          rounded-xl
          text-white
          text-sm
        "
      >
        ← Zurück
      </button>
    </div>
  );
}