export default function DSAContactPage() {
  return (
    <div className="min-h-screen bg-[#050B1F] text-slate-300">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 text-xs uppercase tracking-[0.4em] text-cyan-400">
            // DIGITAL SERVICES ACT
          </div>
          <h1 className="mb-6 text-4xl font-black text-white md:text-6xl">
            DSA-Kontaktstelle
          </h1>
        </div>

        <section className="space-y-6 rounded-3xl border border-cyan-500/10 bg-slate-900/60 p-8 leading-relaxed">
          <p>
            Für Meldungen rechtswidriger Inhalte, Beschwerden oder Anfragen
            nach dem Digital Services Act (DSA) kontaktieren Sie bitte:
          </p>
          <p>
            E-Mail:{' '}
            <a
              className="text-cyan-400 underline hover:text-cyan-300"
              href="mailto:support@gigsda.com"
            >
              support@gigsda.com
            </a>
          </p>
          <p>
            GIGSDA prüft eingehende Meldungen zeitnah und behält sich vor,
            Inhalte bei Verstößen gegen gesetzliche Vorgaben oder die
            Plattformregeln einzuschränken, zu entfernen oder Konten zu
            sperren.
          </p>
        </section>
      </div>
    </div>
  );
}
