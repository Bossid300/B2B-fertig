import { useState } from 'react';
import BaseCard from './BaseCard';

export default function FreeSpotCard({
  spot,
  owner,
  isOwner,
  canRequest,
  onDetails,
  onPortfolio,
  onEdit,
  onDelete,
  onRequest,
}) {
  const [expanded, setExpanded] = useState(false);

  if (!spot) return null;

  const bannerImage = owner?.slide1_url || owner?.bannerUrl;
  const avatarImage = owner?.avatarMediaUrl || owner?.avatarUrl;
  const ownerName =
    owner?.klarname ||
    owner?.name ||
    String(spot.owner_id || '') ||
    'Gigsda-Mitglied';
  const initials = String(ownerName).substring(0, 2).toUpperCase();

  return (
    <BaseCard className="group border-pink-500/30 hover:border-pink-400/60">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="relative block h-28 w-full overflow-hidden bg-gradient-to-br from-pink-950 via-slate-900 to-purple-950 text-left"
      >
        {bannerImage && (
          <img
            src={bannerImage}
            alt=""
            className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute right-3 top-3 rounded-md border border-pink-500/30 bg-slate-950/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-300 backdrop-blur-sm">
          Free Spot
        </span>
        <span className="absolute bottom-3 left-24 right-3 truncate text-xs text-white/80">
          {expanded ? 'Zum Einklappen klicken' : 'Für Details aufklappen'}
        </span>
      </button>

      <div className="relative px-4 pb-4 pt-3">
        <div className="absolute -top-9 left-4 h-16 w-16 overflow-hidden rounded-full border-2 border-slate-950 bg-slate-800 shadow-xl">
          {avatarImage ? (
            <img src={avatarImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-black text-pink-200">
              {initials}
            </div>
          )}
        </div>

        <div className="min-h-12 pl-20">
          <h4 className="truncate text-lg font-black text-white">{spot.title}</h4>
          <p className="truncate text-xs text-slate-400">
            {spot.category || 'Free Spot'}{spot.location ? ` · ${spot.location}` : ''}
          </p>
        </div>

        {expanded && (
          <div className="mt-4 space-y-2 border-t border-pink-500/20 pt-3 text-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Erstellt von {ownerName}
            </div>
            {spot.spot_date && (
              <div className="text-slate-300">
                📅 {new Date(`${spot.spot_date}T00:00:00`).toLocaleDateString('de-DE')}
              </div>
            )}
            {(spot.time_from || spot.time_to) && (
              <div className="text-slate-300">
                🕒 {spot.time_from || ''}
                {spot.time_from && spot.time_to ? ' – ' : ''}
                {spot.time_to || ''}
              </div>
            )}
            {spot.location && <div className="text-slate-300">📍 {spot.location}</div>}
            {spot.region && <div className="text-slate-300">🌐 {spot.region}</div>}
            {spot.description && (
              <p className="whitespace-pre-line pt-2 leading-relaxed text-slate-400">
                {spot.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 p-3">
        <button
          type="button"
          onClick={onDetails}
          className="rounded-xl border border-slate-700 bg-slate-900 py-2 text-xs font-bold uppercase text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Details
        </button>
        <button
          type="button"
          onClick={onPortfolio}
          className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 py-2 text-xs font-bold uppercase text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
        >
          Portfolio
        </button>

        {isOwner ? (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-pink-500/30 bg-pink-500/5 py-2 text-xs font-bold uppercase text-pink-300 transition hover:bg-pink-500/15"
            >
              Bearbeiten
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-red-500/30 bg-red-500/5 py-2 text-xs font-bold uppercase text-red-300 transition hover:bg-red-500/15"
            >
              Löschen
            </button>
          </>
        ) : canRequest ? (
          <button
            type="button"
            onClick={onRequest}
            className="col-span-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 py-2 text-xs font-bold uppercase text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
          >
            Anfragen
          </button>
        ) : null}
      </div>
    </BaseCard>
  );
}
