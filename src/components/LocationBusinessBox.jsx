import { useEffect, useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { getProfilesDb, saveProfile } from '../services/apiService';

const LOCATION_USAGE_OPTIONS = [
  { key: 'location_rental_possible', label: 'Vermietung möglich' },
  { key: 'location_external_promoters_allowed', label: 'Fremdveranstalter erlaubt' },
  { key: 'location_club_operation_possible', label: 'Clubbetrieb möglich' },
  { key: 'location_concert_operation_possible', label: 'Konzertbetrieb möglich' },
  { key: 'location_corporate_events_possible', label: 'Firmenveranstaltungen möglich' },
  { key: 'location_weddings_possible', label: 'Hochzeiten möglich' },
  { key: 'location_workshops_possible', label: 'Workshops / Seminare möglich' },
  { key: 'location_dry_hire_possible', label: 'Dry Hire möglich' },
  { key: 'location_external_catering_allowed', label: 'Fremdcatering erlaubt' },
  { key: 'location_external_security_allowed', label: 'Eigene Security erlaubt' },
];

const BUSINESS_FIELDS = [
  'location_rental_model',
  'location_rental_price_from',
  'location_rental_price_to',
  'payment_terms',
  'company_uid',
  'steuernummer',
  'tax_type',
];

const createEmptyUsage = () =>
  Object.fromEntries(LOCATION_USAGE_OPTIONS.map(({ key }) => [key, false]));

const createEmptyBusinessData = () =>
  Object.fromEntries(BUSINESS_FIELDS.map((key) => [key, '']));

const createFieldVisibility = (profile = {}) => ({
  payment_terms: profile.show_payment_terms !== false,
  company_uid: profile.show_company_uid === true,
  steuernummer: profile.show_steuernummer === true,
  tax_type: profile.show_tax_type !== false,
});

const hasValue = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).trim() !== '';

const PAYMENT_TERMS_LABELS = {
  sofort: 'Sofort nach Erhalt ohne Abzug',
  '14_netto': '14 Tage rein netto',
  '30_netto': '30 Tage rein netto',
  anzahlung: '50% Anzahlung / Rest nach Abnahme',
};

const TAX_TYPE_LABELS = {
  regel: 'Regelbesteuerung (zzgl. MwSt.)',
  klein: 'Kleinunternehmer-Regelung (§ 19 UStG)',
  befreit: 'Umsatzsteuerbefreit (Reverse-Charge)',
};

const getProfileData = (profile) => {
  if (!profile?.profile_json) return profile;

  const parsedProfile =
    typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;

  return {
    ...profile,
    ...parsedProfile,
    id: profile.id,
  };
};

export default function LocationBusinessBox({ currentProfileId, isOwner }) {
  const [profile, setProfile] = useState(null);
  const [usage, setUsage] = useState(createEmptyUsage);
  const [businessData, setBusinessData] = useState(createEmptyBusinessData);
  const [fieldVisibility, setFieldVisibility] = useState(createFieldVisibility);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const canEdit =
    isOwner ||
    String(currentProfileId) === localStorage.getItem('gigsda_profile_id');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profiles = await getProfilesDb(currentProfileId);
        const found = profiles.find(
          (item) => String(item?.id) === String(currentProfileId)
        );

        if (!found) {
          throw new Error('Location-Profil konnte nicht gefunden werden.');
        }

        const loadedProfile = getProfileData(found);
        setProfile(loadedProfile);
        setUsage(
          Object.fromEntries(
            LOCATION_USAGE_OPTIONS.map(({ key }) => [
              key,
              loadedProfile[key] === true,
            ])
          )
        );
        setBusinessData(
          Object.fromEntries(
            BUSINESS_FIELDS.map((key) => [
              key,
              key === 'company_uid'
                ? loadedProfile.company_uid ?? loadedProfile.uid ?? ''
                : loadedProfile[key] ?? '',
            ])
          )
        );
        setFieldVisibility(createFieldVisibility(loadedProfile));
        setError('');
      } catch (loadError) {
        console.error('Fehler beim Laden der Location-Nutzungsoptionen:', loadError);
        setError('Nutzungs- und Vermietungsoptionen konnten nicht geladen werden.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentProfileId, isEditing]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setUsage((previous) => ({ ...previous, [name]: checked }));
  };

  const handleBusinessDataChange = (event) => {
    const { name, value } = event.target;
    setBusinessData((previous) => ({ ...previous, [name]: value }));
  };

  const toggleFieldVisibility = (field) => {
    setFieldVisibility((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const renderFieldToggle = (field) => (
    <button
      type="button"
      onClick={() => toggleFieldVisibility(field)}
      aria-label={`Sichtbarkeit ${field} umschalten`}
      title={fieldVisibility[field] ? 'Für andere sichtbar' : 'Für andere ausgeblendet'}
      className="text-slate-400 hover:text-white"
    >
      {fieldVisibility[field] ? <Eye size={12} /> : <EyeOff size={12} />}
    </button>
  );

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const profiles = await getProfilesDb(currentProfileId);
      const found = profiles.find(
        (item) => String(item?.id) === String(currentProfileId)
      );

      if (!found) {
        throw new Error('Location-Profil konnte vor dem Speichern nicht geladen werden.');
      }

      const latestProfile = getProfileData(found);
      const updatedProfile = {
        ...latestProfile,
        ...usage,
        ...businessData,
        ...Object.fromEntries(
          Object.entries(fieldVisibility).map(([field, visible]) => [
            `show_${field}`,
            visible,
          ])
        ),
      };
      const profileId =
        updatedProfile.id ||
        updatedProfile.profileId ||
        currentProfileId;
      const result = await saveProfile({
        profileId,
        profile: updatedProfile,
      });

      if (result?.success === false) {
        throw new Error(result.error || 'Nutzungsoptionen konnten nicht gespeichert werden.');
      }

      setProfile({ ...updatedProfile, id: profileId });
      setIsEditing(false);
    } catch (saveError) {
      console.error('Fehler beim Speichern der Location-Nutzungsoptionen:', saveError);
      setError(saveError.message || 'Nutzungsoptionen konnten nicht gespeichert werden.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-orange-400 animate-pulse mt-4">
        // NUTZUNG &amp; VERMIETUNG WIRD GELADEN...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-red-400 mt-4">
        {error}
      </div>
    );
  }

  const activeOptions = LOCATION_USAGE_OPTIONS.filter(
    ({ key }) => usage[key]
  );
  const canShowFinanceField = (field) =>
    canEdit ||
    (
      profile.show_finance === true &&
      (
        field === 'company_uid' || field === 'steuernummer'
          ? profile[`show_${field}`] === true
          : profile[`show_${field}`] !== false
      )
    );

  return (
    <section className="w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl font-mono text-white mt-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
        <span className="text-xs font-black tracking-widest uppercase text-slate-200">
          // Nutzung &amp; Vermietung
        </span>
        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-orange-400 text-[10px] font-black tracking-wider uppercase hover:border-orange-500 transition-all"
          >
            Optionen bearbeiten
          </button>
        )}
      </div>

      {isEditing && canEdit ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span>Mietmodell</span>
                <input
                  type="text"
                  name="location_rental_model"
                  value={businessData.location_rental_model}
                  onChange={handleBusinessDataChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span>Mietpreis von (€)</span>
                <input
                  type="number"
                  min="0"
                  name="location_rental_price_from"
                  value={businessData.location_rental_price_from}
                  onChange={handleBusinessDataChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-400">
                <span>Mietpreis bis (€)</span>
                <input
                  type="number"
                  min="0"
                  name="location_rental_price_to"
                  value={businessData.location_rental_price_to}
                  onChange={handleBusinessDataChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </label>
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location-business-payment-terms">Zahlungsziel</label>
                    {renderFieldToggle('payment_terms')}
                  </div>
                  <select
                    id="location-business-payment-terms"
                    name="payment_terms"
                    value={businessData.payment_terms}
                    onChange={handleBusinessDataChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Nicht angegeben</option>
                    <option value="14_netto">14 Tage rein netto</option>
                    <option value="sofort">Sofort nach Erhalt ohne Abzug</option>
                    <option value="30_netto">30 Tage rein netto</option>
                    <option value="anzahlung">50% Anzahlung / Rest nach Abnahme</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location-business-uid">Umsatzsteuer-ID (UID)</label>
                    {renderFieldToggle('company_uid')}
                  </div>
                  <input
                    id="location-business-uid"
                    type="text"
                    name="company_uid"
                    value={businessData.company_uid}
                    onChange={handleBusinessDataChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location-business-tax-number">Steuernummer</label>
                    {renderFieldToggle('steuernummer')}
                  </div>
                  <input
                    id="location-business-tax-number"
                    type="text"
                    name="steuernummer"
                    value={businessData.steuernummer}
                    onChange={handleBusinessDataChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1 text-xs text-slate-400 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="location-business-tax-type">Steuerliche Einstufung</label>
                    {renderFieldToggle('tax_type')}
                  </div>
                  <select
                    id="location-business-tax-type"
                    name="tax_type"
                    value={businessData.tax_type}
                    onChange={handleBusinessDataChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Nicht angegeben</option>
                    <option value="regel">Regelbesteuerung (zzgl. MwSt.)</option>
                    <option value="klein">Kleinunternehmer-Regelung (§ 19 UStG)</option>
                    <option value="befreit">Umsatzsteuerbefreit (Reverse-Charge)</option>
                  </select>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCATION_USAGE_OPTIONS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={usage[key]}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500"
                />
                {label}
              </label>
            ))}
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button
              type="button"
              data-profile-action="cancel"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              data-profile-action="save"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 text-slate-950 hover:bg-orange-400 disabled:opacity-60 uppercase text-[10px] font-black tracking-wider"
            >
              <Save size={12} />
              {isSaving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {hasValue(businessData.location_rental_model) && (
              <div><dt className="text-slate-500">Mietmodell</dt><dd className="text-slate-200">{businessData.location_rental_model}</dd></div>
            )}
            {hasValue(businessData.location_rental_price_from) && (
              <div><dt className="text-slate-500">Mietpreis von</dt><dd className="text-slate-200">{businessData.location_rental_price_from} €</dd></div>
            )}
            {hasValue(businessData.location_rental_price_to) && (
              <div><dt className="text-slate-500">Mietpreis bis</dt><dd className="text-slate-200">{businessData.location_rental_price_to} €</dd></div>
            )}
            {canShowFinanceField('payment_terms') && hasValue(businessData.payment_terms) && (
              <div><dt className="text-slate-500">Zahlungsziel</dt><dd className="text-slate-200">{PAYMENT_TERMS_LABELS[businessData.payment_terms] || businessData.payment_terms}</dd></div>
            )}
            {usage.location_dry_hire_possible && (
              <div><dt className="text-slate-500">Dry-Hire</dt><dd className="text-slate-200">Möglich</dd></div>
            )}
            {canShowFinanceField('company_uid') && hasValue(businessData.company_uid) && (
              <div><dt className="text-slate-500">UID</dt><dd className="text-slate-200">{businessData.company_uid}</dd></div>
            )}
            {canShowFinanceField('steuernummer') && hasValue(businessData.steuernummer) && (
              <div><dt className="text-slate-500">Steuernummer</dt><dd className="text-slate-200">{businessData.steuernummer}</dd></div>
            )}
            {canShowFinanceField('tax_type') && hasValue(businessData.tax_type) && (
              <div><dt className="text-slate-500">Steuerliche Einstufung</dt><dd className="text-slate-200">{TAX_TYPE_LABELS[businessData.tax_type] || businessData.tax_type}</dd></div>
            )}
          </dl>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {activeOptions.length > 0 ? (
              activeOptions.map(({ key, label }) => (
                <li key={key} className="flex items-center gap-2">
                  <span className="text-emerald-400" aria-hidden="true">✓</span>
                  {label}
                </li>
              ))
            ) : (
              <li className="text-slate-500">
                Keine Nutzungs- oder Vermietungsoptionen ausgewählt.
              </li>
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
