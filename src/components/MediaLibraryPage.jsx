import { useCallback, useEffect, useState } from 'react';
import { Download, FileAudio, FileImage, FileText, FileVideo, Upload } from 'lucide-react';
import {
  getMediaAssets,
  getMediaDownloadUrl,
  uploadMediaFile
} from '../services/mediaService';

const MEDIA_LABELS = {
  image: 'Bild',
  document: 'Dokument',
  audio: 'Audio',
  video: 'Video'
};

const MediaIcon = ({ type }) => {
  const Icon = {
    image: FileImage,
    document: FileText,
    audio: FileAudio,
    video: FileVideo
  }[type] || FileText;

  return <Icon size={20} className="shrink-0 text-cyan-400" aria-hidden="true" />;
};

const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAssets = useCallback(async () => {
    setError('');
    setIsLoading(true);

    try {
      setAssets(await getMediaAssets());
    } catch (loadError) {
      setError(loadError.message || 'Medien konnten nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getMediaAssets()
      .then((loadedAssets) => {
        if (isMounted) setAssets(loadedAssets);
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(loadError.message || 'Medien konnten nicht geladen werden.');
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile || isUploading) return;
    const form = event.currentTarget;

    setError('');
    setNotice('');
    setIsUploading(true);

    try {
      await uploadMediaFile(selectedFile);
      setSelectedFile(null);
      form.reset();
      setNotice('Datei wurde sicher hochgeladen.');
      await loadAssets();
    } catch (uploadError) {
      setError(uploadError.message || 'Datei konnte nicht hochgeladen werden.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
          Gigsda Media Library
        </p>
        <h1 className="mt-2 text-3xl font-black text-white">Meine Medien</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Lade Dateien in deine private Medienbibliothek hoch. Die Zuordnung zu
          Profilen und Events folgt in einer späteren Phase.
        </p>
      </header>

      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-5"
      >
        <label htmlFor="media-upload" className="mb-3 block text-sm font-bold text-white">
          Datei hochladen
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="media-upload"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,audio/flac,video/mp4,video/webm,video/quicktime"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-bold file:text-cyan-300"
          />
          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={16} aria-hidden="true" />
            {isUploading ? 'Wird hochgeladen …' : 'Hochladen'}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Bilder bis 25 MB, Dokumente bis 50 MB, Audio bis 100 MB und Videos bis 250 MB.
          Nicht unterstützte oder nicht zum Dateiinhalt passende Formate werden abgelehnt.
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
        {notice && <p role="status" className="mt-3 text-sm text-emerald-300">{notice}</p>}
      </form>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white">Bibliothek</h2>
        <span className="text-xs text-slate-500">{assets.length} Dateien</span>
      </div>

      {isLoading ? (
        <p role="status" className="rounded-xl border border-slate-800 p-6 text-sm text-slate-400">
          Medienbibliothek wird geladen …
        </p>
      ) : error && assets.length === 0 ? (
        <p role="alert" className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-6 text-sm text-rose-300">
          {error}
        </p>
      ) : assets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-400">
          Noch keine Dateien vorhanden. Lade deine erste Datei hoch.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <MediaIcon type={asset.media_type} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white" title={asset.original_filename}>
                  {asset.original_filename}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {MEDIA_LABELS[asset.media_type] || asset.media_type} · {formatFileSize(Number(asset.size_bytes))}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  {new Date(`${asset.created_at.replace(' ', 'T')}Z`).toLocaleDateString()}
                </p>
              </div>
              <a
                href={getMediaDownloadUrl(asset.id)}
                className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-cyan-500/50 hover:text-cyan-300"
                aria-label={`Datei ${asset.original_filename} herunterladen`}
                title="Herunterladen"
              >
                <Download size={15} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
