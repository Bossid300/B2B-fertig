import EventCard from '../../../components/cards/EventCard.jsx';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { uploadEventBanner } from '../../../services/mediaService.js';
import { getTicketPriceRows, getTicketPricing } from '../../../utils/ticketPrices.js';
import { AmenitySelector } from '../../../components/AmenityTags.jsx';
import EventPromotionView from '../../../components/EventPromotionView.jsx';

const BANNER_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_BANNER_SIZE = 25 * 1024 * 1024;

function hasValue(value) {
  return value != null && String(value).trim() !== '';
}

export default function PromotionTab({
  activeEvent,
  promoData,
  setPromoData,
  isOwner,
  saveError,
  promotionDate,
  promotionDateValid,
  onPromotionDateChange,
  checkTarget,
  previewTarget
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [selectedPromoEvent, setSelectedPromoEvent] = useState(null);

  const location = [
    promoData.venueName,
    promoData.street,
    [promoData.zip, promoData.city].filter(hasValue).join(' ')
  ].filter(hasValue).join(', ');

  const title = promoData.title || activeEvent.title;
  const category = promoData.category || activeEvent.category || activeEvent.type || activeEvent.event_type;
  const description = promoData.description || activeEvent.description;
  const banner = promoData.promoImage || activeEvent.slide1_url;
  const ticketPricing = getTicketPricing(promoData);

  const checks = [
    { label: 'Eventtitel', complete: hasValue(title), required: true },
    { label: 'Kategorie', complete: hasValue(category), required: true },
    { label: 'Datum', complete: promotionDateValid, required: true },
    { label: 'Ort', complete: hasValue(promoData.venueName) || hasValue(promoData.city), required: true },
    { label: 'Beschreibung', complete: hasValue(description), required: true },
    { label: 'Line-Up', complete: hasValue(promoData.lineup) },
    { label: 'Ticketpreis', complete: getTicketPriceRows({ promotionData: promoData }).length > 0 },
    { label: 'FSK', complete: hasValue(promoData.fsk) },
    { label: 'Ticketlink', complete: hasValue(promoData.ticketLink) },
    { label: 'Bannerbild', complete: hasValue(banner), required: true }
  ];

  const requiredComplete = checks.every((check) => !check.required || check.complete);

  const update = (field) => (event) => {
    setPromoData((current) => ({ ...current, [field]: event.target.value }));
  };
  const updatePrice = (field) => (event) => {
    setPromoData((current) => ({ ...current, ticketPricing: 'paid', [field]: event.target.value }));
  };

  const handleBannerUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadError('');
    if ((file.type && !BANNER_TYPES.includes(file.type)) || file.size < 1 || file.size > MAX_BANNER_SIZE) {
      setUploadError('Bitte ein Bild im Format JPEG, PNG, GIF oder WebP mit maximal 25 MB auswählen.');
      return;
    }

    setUploading(true);
    try {
      const asset = await uploadEventBanner(file, activeEvent.id);
      if (!asset?.id || asset.media_type !== 'image' ||
          asset.banner_url !== `/api/media.php?event_banner=${encodeURIComponent(asset.id)}`) {
        throw new Error('Der Server hat keine gültige Bannerbild-URL zurückgegeben.');
      }
      setPromoData((current) => ({ ...current, promoImage: asset.banner_url }));
    } catch (error) {
      console.error('Bannerbild konnte nicht hochgeladen werden.', error);
      setUploadError(error.message || 'Das Bannerbild konnte nicht hochgeladen werden.');
    } finally {
      setUploading(false);
    }
  };


  const cardEvent = {
    ...activeEvent,
    promotionData: promoData,
    date: promotionDateValid ? promotionDate : '',
    event_date: promotionDateValid ? promotionDate : '',
    title,
    category,
    shortDescription: promoData.shortDescription,
    description,
    slide1_url: banner,
    entryTime: promoData.entryTime,
    startTime: promoData.startTime,
    endTime: promoData.endTime, // <-- NEU hinzugefügt
    ticketPrice: promoData.ticketPrice,
    ticketStatus: promoData.ticketStatus,
    fsk: promoData.fsk,
    lineup: promoData.lineup,
    amenities: promoData.amenities,
    city: location
  };

  const labelClass = 'flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300';
  const inputClass = 'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all';
  const selectClass = 'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer';
  const textareaClass = 'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all';

  return (
    <>
      {checkTarget && createPortal(
        <section className="workspace-promotion__panel" aria-labelledby="promotion-check-heading">
          <h2 id="promotion-check-heading">Promotion-Prüfung</h2>
          <p>Pflichtfelder sind mit * gekennzeichnet.</p>
          <ul className="workspace-promotion__checks">
            {checks.map((check) => (
              <li key={check.label} className={check.complete ? 'is-complete' : 'is-missing'}>
                <span aria-hidden="true">{check.complete ? '✓' : '✕'}</span>
                <span>{check.label}{check.required ? ' *' : ''}</span>
                <span className="workspace-promotion__sr-only">{check.complete ? ' vorhanden' : ' fehlt'}</span>
              </li>
            ))}
          </ul>
        </section>,
        checkTarget
      )}

      <section className="workspace-promotion__panel workspace-promotion__editor space-y-6 text-slate-200" aria-labelledby="promotion-editor-heading">
        <div className="border-b border-slate-800 pb-4">
          <h2 id="promotion-editor-heading" className="text-xl font-black text-white tracking-tight">
            Promotion-Bearbeitung
          </h2>
          {!isOwner && (
            <p className="text-sm text-amber-400 mt-1">
              Nur der Veranstalter kann die Promotion bearbeiten.
            </p>
          )}
          {saveError && (
            <p className="workspace-promotion__error mt-2 text-sm text-rose-400" role="alert">
              {saveError}
            </p>
          )}
        </div>

        <fieldset disabled={!isOwner} className="space-y-6 disabled:opacity-75">
          {/* 1. BASISDATEN & ZEITPLAN */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-400 font-bold">
              01 // Basisdaten & Zeitplan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <label className={`${labelClass} md:col-span-8`}>
                <span>Eventtitel *</span>
                <input
                  type="text"
                  value={promoData.title ?? ''}
                  onChange={update('title')}
                  className={`${inputClass} text-base font-medium`}
                />
              </label>

              <label className={`${labelClass} md:col-span-4`}>
                <span>Kategorie *</span>
                <input
                  type="text"
                  value={promoData.category ?? ''}
                  onChange={update('category')}
                  className={inputClass}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={labelClass}>
                <span>Datum (TT.MM.JJJJ) *</span>
                <input
                  type="date"
                  lang="de-DE"
                  min="1000-01-01"
                  max="9999-12-31"
                  value={promotionDate}
                  onChange={(event) => onPromotionDateChange(event.target.value)}
                  required
                  className={`${inputClass} font-mono scheme-dark`}
                />
                {promotionDateValid && (
                  <span className="workspace-promotion__date-hint text-xs font-mono normal-case tracking-normal text-emerald-400">
                    Ausgewählt: {promotionDate.split('-').reverse().join('.')}
                  </span>
                )}
                {!promotionDateValid && (
                  <span className="workspace-promotion__error text-xs normal-case tracking-normal text-rose-400">
                    Bitte ein gültiges Datum auswählen.
                  </span>
                )}
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={labelClass}>
                <span>Einlass</span>
                <input
                  type="time"
                  lang="de-DE"
                  value={promoData.entryTime ?? ''}
                  onChange={update('entryTime')}
                  className={`${inputClass} font-mono scheme-dark`}
                />
              </label>

              <label className={labelClass}>
                <span>Beginn</span>
                <input
                  type="time"
                  lang="de-DE"
                  value={promoData.startTime ?? ''}
                  onChange={update('startTime')}
                  className={`${inputClass} font-mono scheme-dark`}
                />
              </label>

              <label className={labelClass}>
                <span>Ende (ca.)</span>
                <input
                  type="time"
                  lang="de-DE"
                  value={promoData.endTime ?? ''}
                  onChange={update('endTime')}
                  className={`${inputClass} font-mono scheme-dark`}
                />
              </label>
            </div>
          </div>

          {/* 2. LOCATION */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-purple-400 font-bold">
              02 // Veranstaltungsort
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <label className={`${labelClass} md:col-span-12`}>
                <span>Locationname</span>
                <input
                  type="text"
                  value={promoData.venueName ?? ''}
                  onChange={update('venueName')}
                  className={inputClass}
                />
              </label>

              <label className={`${labelClass} md:col-span-6`}>
                <span>Adresse</span>
                <input
                  type="text"
                  value={promoData.street ?? ''}
                  onChange={update('street')}
                  className={inputClass}
                />
              </label>

              <label className={`${labelClass} md:col-span-2`}>
                <span>PLZ</span>
                <input
                  type="text"
                  value={promoData.zip ?? ''}
                  onChange={update('zip')}
                  className={`${inputClass} font-mono`}
                />
              </label>

              <label className={`${labelClass} md:col-span-4`}>
                <span>Ort</span>
                <input
                  type="text"
                  value={promoData.city ?? ''}
                  onChange={update('city')}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          {/* 3. TICKETS & STATUS */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-emerald-400 font-bold">
              03 // Tickets & Eventstatus
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <label className={`${labelClass} md:col-span-6`}>
                <span>Eintritt</span>
                <select value={ticketPricing} onChange={update('ticketPricing')} className={selectClass}>
                  <option value="paid">Ticketpreise</option>
                  <option value="free">Eintritt frei</option>
                  <option value="donation">Freiwillige Spende</option>
                </select>
              </label>

              {ticketPricing === 'paid' && (
                <>
                  <label className={`${labelClass} md:col-span-3`}>
                    <span>Vorverkauf</span>
                    <input
                      value={promoData.ticketPrice ?? ''}
                      onChange={updatePrice('ticketPrice')}
                      placeholder="z.B. 39,50 € zzgl. Gebühren"
                      className={inputClass}
                    />
                  </label>
                  <label className={`${labelClass} md:col-span-3`}>
                    <span>Abendkasse</span>
                    <input
                      value={promoData.boxOfficePrice ?? ''}
                      onChange={updatePrice('boxOfficePrice')}
                      placeholder="z.B. 45,00 €"
                      className={inputClass}
                    />
                  </label>
                </>
              )}

              <label className={`${labelClass} md:col-span-3`}>
                <span>FSK</span>
                <select value={promoData.fsk ?? ''} onChange={update('fsk')} className={selectClass}>
                  <option value="">Keine Angabe</option>
                  <option value="Ohne Altersbeschränkung">0</option>
                  <option value="Ab 12 Jahren">12</option>
                  <option value="Ab 16 Jahren">16</option>
                  <option value="Ab 18 Jahren">18</option>
                </select>
              </label>

              <label className={`${labelClass} md:col-span-6`}>
                <span>Eventstatus</span>
                <select value={promoData.ticketStatus ?? ''} onChange={update('ticketStatus')} className={selectClass}>
                  <option value="">Bitte wählen</option>
                  <option value="Verfügbar">Verfügbar</option>
                  <option value="Fast ausverkauft">Fast ausverkauft</option>
                  <option value="Ausverkauft">Ausverkauft</option>
                </select>
              </label>

              <label className={`${labelClass} md:col-span-12`}>
                <span>Ticketlink</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={promoData.ticketLink ?? ''}
                  onChange={update('ticketLink')}
                  className={inputClass}
                />
              </label>
            </div>
          </div>

          {/* 4. BANNER, BESCHREIBUNGEN & LINE-UP */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-mono uppercase tracking-widest text-amber-400 font-bold">
              04 // Banner, Beschreibungen & Line-Up
            </h3>

            <div className="workspace-promotion__banner grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={labelClass}>
                <span>Bannerbild *</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={promoData.promoImage ?? ''}
                  onChange={update('promoImage')}
                  disabled={uploading}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                <span>Bannerbild hochladen</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleBannerUpload}
                  disabled={uploading}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-cyan-400 file:font-semibold file:cursor-pointer hover:file:bg-slate-700 transition-all"
                />
              </label>

              {(uploading || uploadError) && (
                <div className="md:col-span-2">
                  {uploading && <p role="status" className="text-sm text-cyan-400">Bannerbild wird hochgeladen …</p>}
                  {uploadError && <p className="workspace-promotion__error text-sm text-rose-400" role="alert">{uploadError}</p>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`${labelClass} workspace-promotion__field--full`}>
                <span>Kurzbeschreibung</span>
                <textarea
                  rows={3}
                  value={promoData.shortDescription ?? ''}
                  onChange={update('shortDescription')}
                  className={textareaClass}
                />
              </label>

              <div className="workspace-promotion__field--full space-y-3">
                <span className={labelClass}>Fan-Annehmlichkeiten</span>
                <AmenitySelector promoData={promoData} setPromoData={setPromoData} disabled={!isOwner} />
                <label className={labelClass}>
                  <span>Weitere Annehmlichkeiten / Specials</span>
                  <textarea
                    rows={3}
                    value={promoData.amenities ?? ''}
                    onChange={update('amenities')}
                    placeholder="z.B. Freibier für alle"
                    className={textareaClass}
                  />
                </label>
              </div>

              <label className={`${labelClass} workspace-promotion__field--full`}>
                <span>Line-Up</span>
                <textarea
                  rows={4}
                  value={promoData.lineup ?? ''}
                  onChange={update('lineup')}
                  className={textareaClass}
                />
              </label>

              <label className={`${labelClass} workspace-promotion__field--full`}>
                <span>Ausführliche Beschreibung *</span>
                <textarea
                  rows={5}
                  value={promoData.description ?? ''}
                  onChange={update('description')}
                  className={textareaClass}
                />
              </label>
            </div>
          </div>
        </fieldset>
      </section>

      {previewTarget && createPortal(
        <section className="workspace-promotion__panel workspace-promotion__preview" aria-labelledby="promotion-preview-heading">
          <h2 id="promotion-preview-heading">Live-Vorschau</h2>

          <EventCard
            event={cardEvent}
            onViewEvent={setSelectedPromoEvent}
          />

          <div className="workspace-promotion__status">
            <strong>Status</strong>
            <span>🟡 In Planung</span>
          </div>
          <button type="button" className="workspace-promotion__publish" disabled>
            Veröffentlichen
          </button>
          <p>Status ist ein Platzhalter; die Sichtbarkeit bleibt unverändert.</p>
          <p>{requiredComplete
            ? 'Veröffentlichen ist noch nicht verfügbar.'
            : 'Pflichtfelder ergänzen. Veröffentlichen ist noch nicht verfügbar.'}</p>
        </section>,
        previewTarget
      )}

      {selectedPromoEvent && (
        <EventPromotionView
          event={selectedPromoEvent}
          onClose={() => setSelectedPromoEvent(null)}
        />
      )}

    </>
  );
}