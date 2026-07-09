import React from "react";
import BaseCard from "./BaseCard";


export default function RiderCard({
  member,
  status = "offen",
  progress = 0,
  confirmedAt,
  selected = false,
  variant = "compact",
  onClick,
  onProfileClick
})

 {

    const confirmedDate = confirmedAt
    ? new Date(confirmedAt)
        .toLocaleDateString("de-DE")
    : null;

    const isCompact =
    variant === "compact";

  const statusColor = {
    offen: "text-red-400",
    pruefung: "text-amber-400",
    geaendert: "text-amber-400",
    bestaetigt: "text-emerald-400"
  };

  const statusLabel = {
    offen: "🔴 OFFEN",
    pruefung: "🟡 PRÜFUNG",
    geaendert: "🟡 GEÄNDERT",
    bestaetigt: "🟢 BESTÄTIGT"
  };

    const roleColors = {
    Veranstalter:
        "bg-pink-500/10 border-pink-500/30 text-pink-400",

    Künstler:
        "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",

    Location:
        "bg-orange-500/10 border-orange-500/30 text-orange-400",

    Techniker:
        "bg-purple-500/10 border-purple-500/30 text-purple-400",

    Material:
        "bg-amber-500/10 border-amber-500/30 text-amber-400",

    Security:
        "bg-red-500/10 border-red-500/30 text-red-400",

    Catering:
        "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
    }; 

  return (
    <BaseCard
      selected={selected}
      onClick={onClick}
    >
      <div className="p-4">

        {/* Rolle */}

        <div className="flex justify-between items-center">

        <span
        className={`
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            px-3
            py-1.5
            rounded-lg
            border

            ${
            roleColors[member?.role] ||
            "bg-slate-900 border-slate-700 text-slate-300"
            }
        `}
        >
        {member?.role}
        </span>

          <span
            className={`
              text-[10px]
              font-bold
              ${statusColor[status]}
            `}
          >
            {statusLabel[status]}
          </span>

        </div>

        {/* Avatar */}
        <div className="mt-4 flex justify-center">
            <div
                className="cursor-pointer"
                onClick={(e) => {
                e.stopPropagation();
                onProfileClick?.();
                }}
            >
                <div
                className="
                    w-16 h-16
                    rounded-full
                    overflow-hidden
                    border-2
                    border-slate-800
                "
                >
                {member?.avatarUrl ? (
                    <img
                    src={member.avatarUrl}
                    alt={member?.name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                    className="
                        w-full h-full
                        bg-slate-900
                        flex
                        items-center
                        justify-center
                        text-white
                        font-black
                    "
                    >
                    {member?.name?.slice(0, 2)}
                    </div>
                )}
                </div>
            </div>
        </div>

        {/* Name */}

        <div className="mt-4 text-center">
        <span
            onClick={(e) => {
            e.stopPropagation();
            onProfileClick?.();
            }}
            className="
            inline-block
            font-black
            uppercase
            text-white
            hover:text-cyan-400
            cursor-pointer
            transition-colors
            "
        >
            {member?.name}
        </span>
        
        {confirmedDate && (
        <>
            <div
            className="
                mt-1
                text-[12px]
                text-emerald-400
            "
            >
            ✅ Bestätigt
            </div>

            <div
            className="
                text-[12px]
                text-slate-500
            "
            >
            am {confirmedDate}
            </div>
        </>
        )}

        </div>

        {!isCompact && (
          <>
            <div className="
              mt-2
              text-center
              text-xs
              text-slate-500
            ">
              {member?.city || "Kein Ort"}
            </div>

            <div className="
              mt-4
              border-t
              border-slate-900
              pt-4
            ">
              <div className="
                flex
                justify-between
                text-xs
              ">
                <span className="text-slate-500">
                  Riderstatus
                </span>

                <span className="text-cyan-400 font-bold">
                  {progress}%
                </span>
              </div>
            </div>
          </>
        )}

      </div>
    </BaseCard>
  );
}