import { useState } from 'react';

export default function GoogleMapsConsent({ children, height = '700px' }) {
  const [isAllowed, setIsAllowed] = useState(false);

  if (isAllowed) {
    return children;
  }

  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-4 bg-slate-900 px-6 text-center text-slate-300"
      style={{ height }}
    >
      <p className="max-w-xl text-sm leading-relaxed">
        Beim Laden der Karte wird eine Verbindung zu Google Maps hergestellt.
        Dabei können unter anderem Ihre IP-Adresse und Browserdaten an Google
        übermittelt werden. Mehr dazu in der{' '}
        <a
          className="text-cyan-400 underline hover:text-cyan-300"
          href="/datenschutz"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
      <button
        className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        onClick={() => setIsAllowed(true)}
        type="button"
      >
        Karte laden
      </button>
    </div>
  );
}
