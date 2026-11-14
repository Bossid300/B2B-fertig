import { useEffect } from 'react';
import PortfolioActionBar from '../portfolio/shared/PortfolioActionBar';

export default function SheetRouter({
  profile,
  onBack,
  setView,
  SheetComponent,
  roleLabel,
  showAllEvents = false,
  printMode = false,
}) {
  useEffect(() => {
    if (!printMode || !profile || !SheetComponent) return undefined;

    let cancelled = false;
    const printWhenReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) window.print();
        });
      });
    };

    printWhenReady();
    return () => {
      cancelled = true;
    };
  }, [printMode, profile, SheetComponent]);

  if (!profile || !SheetComponent) return null;

  const isOwner =
    String(localStorage.getItem('gigsda_profile_id')) === String(profile.id);

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }

    setView?.('radar');
  };

  const handlePrintInNewTab = () => {
    if (!profile.id) return;

    const sheetUrl = new URL(
      `/sheet/${encodeURIComponent(profile.id)}`,
      window.location.origin
    );
    sheetUrl.searchParams.set('print', '1');
    window.open(sheetUrl.href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {!printMode && (
        <div className="mx-auto max-w-6xl px-4 pt-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500"
            >
              Zurück zum Explorer
            </button>
            <div className="flex flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={handlePrintInNewTab}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                In neuem Tab öffnen &amp; drucken
              </button>

            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-950/80 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {roleLabel} Portfolio
            </p>
            <PortfolioActionBar
              profile={profile}
              isOwner={isOwner}
              setView={setView}
            />
          </div>
        </div>
      )}

      {/* Druck-ID-Container um das eigentliche Sheet */}
      <div id="sheet-print-area">
        <SheetComponent profile={profile} showAllEvents={showAllEvents} />
      </div>
    </div>
  );
}