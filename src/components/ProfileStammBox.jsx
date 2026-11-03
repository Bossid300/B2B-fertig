import { useState, useEffect, useRef } from 'react';
import { Pencil, Save, User, Eye, EyeOff, Image } from 'lucide-react';
import { saveProfile } from '../services/apiService';
import { getProfilesDb } from '../services/apiService';
import { geocodeAddress } from '../services/geoService';
import {
  getMediaAssets,
  getMediaAvatarUrl,
  getMediaPreviewUrl,
  setProfileAvatar,
  uploadMediaFile
} from '../services/mediaService';

export default function ProfileStammBox({ currentProfileId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({});
  const [avatarImages, setAvatarImages] = useState([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [isLoadingAvatarImages, setIsLoadingAvatarImages] = useState(false);
  const [isSettingAvatar, setIsSettingAvatar] = useState(false);
  const [avatarPickerError, setAvatarPickerError] = useState('');

  const [isAvatarChooserOpen,
        setIsAvatarChooserOpen] =
        useState(false);

  const fileInputRef = useRef(null);

  const canEdit = isOwner || currentProfileId === localStorage.getItem( 'gigsda_profile_id' );

  // 1. DATABASE PIPELINE: Lädt Stammdaten & Sichtbarkeits-Flags (Default: true)
  useEffect(() => {
    let isCurrent = true;

    const loadProfile = async () => {
      try {
        const profiles = await getProfilesDb(currentProfileId);
        if (!isCurrent) return;

        const found = profiles.find(
          p => p?.id === currentProfileId
        );
        if (!found) return;

        const profileData =
          found.profile_json
            ? JSON.parse(found.profile_json)
            : {};
        delete profileData.profile_json;

        const profileFields = { ...found };
        delete profileFields.profile_json;

        const mergedProfile = {
          ...profileFields,
          ...profileData,
          id: found.id,
          role: found.role,
          type: found.type
        };

        setProfile(mergedProfile);
        setFormData({
          role: mergedProfile.role || 'Künstler',
          avatarUrl: mergedProfile.avatarUrl || '',
          avatarMediaId: found.avatar_media_id || '',
          avatarMediaUrl: mergedProfile.avatarMediaUrl || '',
          category: mergedProfile.category || mergedProfile.project_name || '',
          Klarname: mergedProfile.Klarname || '',
          name: mergedProfile.name || '',
          vorname: mergedProfile.vorname || '',
          nachname: mergedProfile.nachname || '',
          plz: mergedProfile.plz || '',
          city: mergedProfile.city || '',
          street: mergedProfile.street || '',
          phone: mergedProfile.phone || '',
          email: mergedProfile.email || '',
          website: mergedProfile.website || '',
          genre: mergedProfile.genre || '',
          id: mergedProfile.id || '',
          ticketName: mergedProfile.ticketName || '',
          description: mergedProfile.description || '',

          show_category: mergedProfile.show_category !== false,
          show_Klarname: mergedProfile.show_Klarname !== false,
          show_name: mergedProfile.show_name !== false,
          show_name_real: mergedProfile.show_name_real !== false,
          show_vorname: mergedProfile.show_vorname !== false && mergedProfile.show_name_real !== false,
          show_nachname: mergedProfile.show_nachname !== false && mergedProfile.show_name_real !== false,
          show_phone: mergedProfile.show_phone !== false,
          show_email: mergedProfile.show_email !== false,
          show_address: mergedProfile.show_address !== false,
          show_street: mergedProfile.show_street !== false && mergedProfile.show_address !== false,
          show_plz: mergedProfile.show_plz !== false && mergedProfile.show_address !== false,
          show_city: mergedProfile.show_city !== false && mergedProfile.show_address !== false,
          show_website: mergedProfile.show_website !== false,
          show_genre: mergedProfile.show_genre !== false,
          show_description: mergedProfile.show_description !== false,
          show_avatarUrl: mergedProfile.show_avatarUrl !== false,
          show_stamm: mergedProfile.show_stamm !== false,

          is_demo: mergedProfile.is_demo === true
        });
      } catch (error) {
        if (isCurrent) {
          console.error(error);
        }
      }
    };

    loadProfile();

    return () => {
      isCurrent = false;
    };
  }, [currentProfileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const toggleVisibility = (fieldName) => {
    setFormData(prev => {
      const next = { ...prev, [fieldName]: !prev[fieldName] };
      if (next[fieldName] && fieldName !== 'show_stamm') {
        next.show_stamm = true;
      }
      if (next[fieldName] && ['show_vorname', 'show_nachname'].includes(fieldName)) {
        next.show_name_real = true;
      }
      if (next[fieldName] && ['show_street', 'show_plz', 'show_city'].includes(fieldName)) {
        next.show_address = true;
      }
      return next;
    });
  };



  const handleSetAvatar = async () => {
    if (!selectedAvatarId || isSettingAvatar) return;

    setAvatarPickerError('');
    setIsSettingAvatar(true);
    try {
      const result = await setProfileAvatar(selectedAvatarId);
      const avatarMediaUrl = result.avatar_url || getMediaAvatarUrl(selectedAvatarId);
      setFormData(prev => ({
        ...prev,
        avatarMediaId: selectedAvatarId,
        avatarMediaUrl
      }));
      setProfile(prev => ({
        ...prev,
        avatar_media_id: selectedAvatarId,
        avatarMediaId: selectedAvatarId,
        avatarMediaUrl
      }));
      setIsAvatarChooserOpen(false);
    } catch (error) {
      setAvatarPickerError(error.message || 'Avatar konnte nicht gesetzt werden.');
    } finally {
      setIsSettingAvatar(false);
    }
  };

  // 2. SAVE PIPELINE: Brennt Daten & Augen-Zustände sicher in die DB
  const handleSave = async (e) => {
    e.preventDefault();
      try {
        const profileId = String(
      currentProfileId ||
      profile?.id ||
          localStorage.getItem('gigsda_profile_id') ||
          ''
        );
        if (!profileId) {
          throw new Error('Profil-ID fehlt; Stammdaten können nicht gespeichert werden.');
        }

        const updatedProfile = {
          ...profile,
          ...formData,
          id: profileId
        };

        updatedProfile.name =
          `${formData.vorname || ''} ${formData.nachname || ''}`.trim();

        delete updatedProfile.project_name;
        delete updatedProfile.avatar_media_id;
        delete updatedProfile.avatarMediaId;
        delete updatedProfile.avatarMediaUrl;

        const geo =
          await geocodeAddress(
            `${formData.street || ''} ${formData.plz || ''} ${formData.city || ''}`
          );
        if (geo) {
          updatedProfile.lat = geo.lat;
          updatedProfile.lng = geo.lng;
        }

        await saveProfile({
          profileId,
          profile: updatedProfile
        });

        setProfile(updatedProfile);
        alert(
          "Stammdaten & Sichtbarkeiten erfolgreich eingeregelt! 💾"
        );
        setIsEditing(false);
      } catch (e) {
        console.error(
          "Fehler beim Brennen der Stammdaten:",
          e
        );
      }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl font-mono text-xs text-purple-400 animate-pulse">
        // STAMMDATEN-PIPELINE WIRD INITIALISIERT...
      </div>
    );
  }

  const { 
    category, Klarname, vorname, nachname, plz, city, street, phone, email, website, genre, id, description, avatarUrl, avatarMediaUrl,
    show_category, show_Klarname, show_vorname, show_nachname, show_phone, show_email, show_address, show_street, show_plz, show_city, show_website, show_genre, show_description, show_avatarUrl, show_stamm
  } = formData;



  const displayName =
    `${(show_vorname || canEdit) ? vorname || '' : ''} ${(show_nachname || canEdit) ? nachname || '' : ''}`.trim() ||
    'User';



  const renderEyeToggle = (active, flagName) => (
    <button
      type="button"
      onClick={() => toggleVisibility(flagName)}
      aria-label={active ? 'Feld öffentlich sichtbar' : 'Feld privat geschaltet'}
      title={active ? 'Für andere sichtbar' : 'Für andere ausgeblendet'}
      className={`p-2 rounded-xl border transition-all cursor-pointer ${
        active 
          ? 'bg-purple-950/20 border-purple-500/40 text-purple-400 hover:text-purple-300' 
          : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-500'
      }`}
    >
      {active ? <Eye size={13} /> : <EyeOff size={13} />}
    </button>
  );

  if (!canEdit && show_stamm === false) return null;

  const canShowField = (isVisible) => canEdit || isVisible !== false;
  const hasPublicStammData = [
    canShowField(show_avatarUrl) && (avatarMediaUrl || avatarUrl),
    (canShowField(show_vorname) && vorname) || (canShowField(show_nachname) && nachname),
    canShowField(show_Klarname) && Klarname,
    canShowField(show_category) && category,
    canShowField(show_genre) && genre,
    canShowField(show_phone) && phone,
    canShowField(show_email) && email,
    canShowField(show_website) && website,
    canShowField(show_address) && (
      (canShowField(show_street) && street) ||
      (canShowField(show_plz) && plz) ||
      (canShowField(show_city) && city)
    ),
    canShowField(show_description) && description
  ].some(Boolean);

  if (!canEdit && !hasPublicStammData) return null;


  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const asset =
        await uploadMediaFile(file);

      await setProfileAvatar(asset.id);

      setFormData(prev => ({
        ...prev,
        avatarMediaUrl:
          getMediaPreviewUrl(asset.id)
      }));

      setIsAvatarChooserOpen(false);

    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="profile-stamm w-full mx-auto bg-slate-950 border border-slate-900 p-6 rounded-3xl shadow-xl text-white relative">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <User size={18} />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-wide text-white">Profilinformationen</h2>
            <p className="mt-0.5 text-xs text-slate-400">Öffentliche Angaben und Kontakt</p>
          </div>
        </div>

        {canEdit && !isEditing && (
          <button
            type="button"
            data-profile-edit-trigger onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5"
          >
            <Pencil size={14} /> Bearbeiten
          </button>
        )}
        {canEdit && isEditing && renderEyeToggle(show_stamm, 'show_stamm')}
      </div>

      {!isEditing ? (
        <div className="space-y-5">
          <div className="profile-stamm-identity flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-cyan-300 border border-slate-700/70 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
            <div className="h-26 w-26 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 p-[2px]">
              <div className="h-full w-full overflow-hidden rounded-full bg-slate-950">
                {canShowField(show_avatarUrl) && (
                  <img
                    src={avatarMediaUrl || ((typeof avatarUrl === 'string' && avatarUrl.trim() !== "") ? avatarUrl : "https://unsplash.com")}
                    alt="Profil Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {displayName}
              </h3>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {category && canShowField(show_category) && (
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {category}
                  </span>
                )}
                {genre && canShowField(show_genre) && (
                  <span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-xs text-slate-300">
                    {genre}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                GIGSDA-ID <span className="text-slate-300">{id || 'SYS-NEW'}</span>
              </p>
              {canEdit && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
                  {show_avatarUrl
                    ? <Eye size={13} className="text-emerald-400" />
                    : <EyeOff size={13} className="text-slate-500" />}
                  <span>{show_avatarUrl ? 'Im Netzwerk sichtbar' : 'Privat / ausgeblendet'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-stamm-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {canShowField(show_Klarname) && (Klarname || canEdit) && <div className="profile-stamm-field">
              <span className="profile-stamm-label">Firmen- / Künstlername</span>
              <div className="profile-stamm-value">
                <span>{Klarname || 'Nicht hinterlegt'}</span>
                {canEdit && (show_Klarname ? <Eye size={14} /> : <EyeOff size={14} />)}
              </div>
            </div>}
            {canShowField(show_phone) && (phone || canEdit) && <div className="profile-stamm-field">
              <span className="profile-stamm-label">Telefon</span>
              <div className="profile-stamm-value">
                <span>{phone || 'Nicht hinterlegt'}</span>
                {canEdit && (show_phone ? <Eye size={14} /> : <EyeOff size={14} />)}
              </div>
            </div>}
            {canShowField(show_email) && (email || canEdit) && <div className="profile-stamm-field">
              <span className="profile-stamm-label">E-Mail</span>
              <div className="profile-stamm-value">
                <span className="break-all">{email || 'Nicht hinterlegt'}</span>
                {canEdit && (show_email ? <Eye size={14} /> : <EyeOff size={14} />)}
              </div>
            </div>}
            {canShowField(show_website) && (website || canEdit) && <div className="profile-stamm-field">
              <span className="profile-stamm-label">Website</span>
              <div className="profile-stamm-value">
              {website ? <a href={website} target="_blank" rel="noreferrer" className="break-all text-cyan-200 hover:text-cyan-100 hover:underline">{website}</a> : <span>Nicht hinterlegt</span>}
                {canEdit && (show_website ? <Eye size={14} /> : <EyeOff size={14} />)}
              </div>
            </div>}
            {canShowField(show_address) && (
              (canShowField(show_street) && street) ||
              (canShowField(show_plz) && plz) ||
              (canShowField(show_city) && city) ||
              canEdit
            ) && <div className="profile-stamm-field">
              <span className="profile-stamm-label">Adresse</span>
              <div className="profile-stamm-value">
                <span>
                  {[
                    canShowField(show_street) ? street : '',
                    [canShowField(show_plz) ? plz : '', canShowField(show_city) ? city : ''].filter(Boolean).join(' ')
                  ].filter(Boolean).join(', ') || 'Nicht hinterlegt'}
                </span>
                {canEdit && (show_address ? <Eye size={14} /> : <EyeOff size={14} />)}
              </div>
            </div>}
          </div>

          {description && canShowField(show_description) && (
            <div className="profile-stamm-description">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-slate-200">Über uns</h4>
                {canEdit && (show_description ? <Eye size={14} className="text-slate-400" /> : <EyeOff size={14} className="text-slate-500" />)}
              </div>
              <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{description}</p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSave} className="profile-stamm-form space-y-5">
          <section className="profile-stamm-edit-section">
            <div className="profile-stamm-section-heading">
              <div>
                <h3>Identität</h3>
                <p>Name, Kategorie und Profilbild</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_demo: !prev.is_demo }))}
                title={formData.is_demo ? 'DEMO' : 'LIVE'}
                className={`profile-stamm-mode ${formData.is_demo ? 'is-demo' : 'is-live'}`}
              >
                <span />
                {formData.is_demo ? 'Demo-Profil' : 'Live-Profil'}
              </button>
            </div>

            <div className="profile-stamm-edit-grid">
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-category">Kategorie / Beruf</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-category" type="text" name="category" value={category || ''} onChange={handleChange} className="profile-stamm-input" placeholder="z. B. Musiker / Songwriter" />
                  {renderEyeToggle(show_category, 'show_category')}
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-klarname">Firmen- / Künstlername</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-klarname" type="text" name="Klarname" value={Klarname || ''} onChange={handleChange} className="profile-stamm-input" placeholder="Name des Unternehmens oder Projekts" />
                  {renderEyeToggle(show_Klarname, 'show_Klarname')}
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-vorname">Vorname / Nachname</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="profile-stamm-input-row">
                    <input id="profile-vorname" type="text" name="vorname" placeholder="Vorname" value={vorname || ''} onChange={handleChange} className="profile-stamm-input" />
                    {renderEyeToggle(show_vorname, 'show_vorname')}
                  </div>
                  <div className="profile-stamm-input-row">
                    <input id="profile-nachname" type="text" name="nachname" placeholder="Nachname" value={nachname || ''} onChange={handleChange} className="profile-stamm-input" />
                    {renderEyeToggle(show_nachname, 'show_nachname')}
                  </div>
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-genre">Genre / Ausrichtung</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-genre" type="text" name="genre" value={genre || ''} onChange={handleChange} className="profile-stamm-input" placeholder="z. B. Rock, Metal" />
                  {renderEyeToggle(show_genre, 'show_genre')}
                </div>
              </div>
            </div>

            <div className="profile-stamm-avatar-tools">
              <div>
                <span className="profile-stamm-label">Profilbild</span>
                <p>
                  {isLoadingAvatarImages
                    ? 'Bilder werden geladen ...'
                    : avatarMediaUrl
                      ? 'Profilbild aus der Medienbibliothek aktiv'
                      : 'Wähle ein Bild aus deiner Medienbibliothek.'}
                </p>
                {avatarPickerError && <p className="text-rose-300">{avatarPickerError}</p>}
              </div>
              <button
                type="button"
                disabled={isLoadingAvatarImages}
                onClick={async () => {
                  setIsAvatarChooserOpen(true);
                  setAvatarPickerError('');
                  setIsLoadingAvatarImages(true);
                  try {
                    const assets = await getMediaAssets();
                    setAvatarImages(assets.filter(asset => asset.media_type === 'image'));
                  } catch (error) {
                    setAvatarPickerError(error.message || 'Bilder konnten nicht geladen werden.');
                  } finally {
                    setIsLoadingAvatarImages(false);
                  }
                }}
                className="profile-stamm-secondary-button disabled:cursor-wait disabled:opacity-60"
              >
                <Image size={15} /> {isLoadingAvatarImages ? 'Lädt ...' : 'Avatar wählen'}
              </button>
            </div>
            <div className="profile-stamm-edit-field mt-4">
              <label htmlFor="profile-avatar-url">Bild-URL (Fallback)</label>
              <div className="profile-stamm-input-row">
                <input id="profile-avatar-url" type="url" name="avatarUrl" value={avatarUrl || ''} onChange={handleChange} className="profile-stamm-input" placeholder="https://..." />
                {renderEyeToggle(show_avatarUrl, 'show_avatarUrl')}
              </div>
            </div>
          </section>

          <section className="profile-stamm-edit-section">
            <div className="profile-stamm-section-heading">
              <div>
                <h3>Kontakt & Standort</h3>
                <p>So erreichst du das Profil</p>
              </div>
            </div>
            <div className="profile-stamm-edit-grid">
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-phone">Telefon</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-phone" type="tel" name="phone" value={phone || ''} onChange={handleChange} className="profile-stamm-input" placeholder="+43 ..." />
                  {renderEyeToggle(show_phone, 'show_phone')}
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-email">E-Mail</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-email" type="email" name="email" value={email || ''} onChange={handleChange} className="profile-stamm-input" placeholder="name@beispiel.at" />
                  {renderEyeToggle(show_email, 'show_email')}
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <label htmlFor="profile-website">Website</label>
                <div className="profile-stamm-input-row">
                  <input id="profile-website" type="url" name="website" value={website || ''} onChange={handleChange} className="profile-stamm-input" placeholder="https://..." />
                  {renderEyeToggle(show_website, 'show_website')}
                </div>
              </div>
              <div className="profile-stamm-edit-field">
                <div className="profile-stamm-label-row">
                  <label htmlFor="profile-street">Adresse</label>
                  {renderEyeToggle(show_address, 'show_address')}
                </div>
                <div className="profile-stamm-input-row">
                  <input id="profile-street" type="text" name="street" placeholder="Straße / Hausnummer" value={street || ''} onChange={handleChange} className="profile-stamm-input" />
                  {renderEyeToggle(show_street, 'show_street')}
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="profile-stamm-input-row">
                    <input type="text" name="plz" placeholder="PLZ" value={plz || ''} onChange={handleChange} className="profile-stamm-input" />
                    {renderEyeToggle(show_plz, 'show_plz')}
                  </div>
                  <div className="profile-stamm-input-row">
                    <input type="text" name="city" placeholder="Ort" value={city || ''} onChange={handleChange} className="profile-stamm-input" />
                    {renderEyeToggle(show_city, 'show_city')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isAvatarChooserOpen && (
            <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">

              <div className="w-full max-w-3xl rounded-3xl border border-cyan-500/30 bg-slate-950 p-6">

                <h3 className="text-xl text-white mb-4">
                  Avatar wählen
                </h3>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border border-cyan-500/40 p-3 text-cyan-300 mb-6"
                >
                  Neues Bild hochladen
                </button>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  {avatarImages.map(asset => (

                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(asset.id)}
                      className={`overflow-hidden rounded-xl border ${
                        selectedAvatarId === asset.id
                          ? 'border-cyan-400'
                          : 'border-slate-800'
                      }`}
                    >

                      <img
                        src={getMediaPreviewUrl(asset.id)}
                        alt={asset.original_filename}
                        className="aspect-square w-full object-cover"
                      />

                      <span className="block truncate p-2 text-[10px] text-slate-300">
                        {asset.original_filename}
                      </span>

                    </button>

                  ))}

                </div>

                <div className="mt-6 flex justify-between">

                  <button
                    type="button"
                    onClick={() => setIsAvatarChooserOpen(false)}
                    className="rounded-xl border border-slate-700 px-4 py-2"
                  >
                    Abbrechen
                  </button>

                  <button
                    type="button"
                    onClick={handleSetAvatar}
                    disabled={!selectedAvatarId}
                    className="rounded-xl bg-cyan-500 px-4 py-2 text-slate-950 font-bold"
                  >
                    Als Avatar verwenden
                  </button>

                </div>

              </div>

            </div>
          )}

          <section className="profile-stamm-edit-section">
            <div className="profile-stamm-section-heading">
              <div>
                <h3>Über uns</h3>
                <p>Die Beschreibung, die im Profil angezeigt wird</p>
              </div>
              {renderEyeToggle(show_description, 'show_description')}
            </div>
            <textarea id="profile-description" name="description" value={description || ''} onChange={handleChange} rows={6} className="profile-stamm-input min-h-36 resize-y" placeholder="Beschreibe dein Profil für das GIGSDA-Netzwerk..." />
          </section>

          {/* CONTROL STRIP */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-900">
            <button type="button" data-profile-action="cancel" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white uppercase text-[10px] font-black cursor-pointer">
              Abbrechen
            </button>
            <button type="submit" data-profile-action="save" className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 uppercase text-[10px] font-black tracking-wider cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.3)]"><Save size={12} /> Speichern</button>
          </div>
        </form>
      )}
    </div>
  );
}
