export default function ReportContentLink({
  contentType,
  contentId,
  title,
  className = ''
}) {
  const details = [
    `Inhaltstyp: ${contentType}`,
    `Titel: ${title || 'Nicht angegeben'}`,
    `ID: ${contentId || 'Nicht angegeben'}`,
    `URL: ${window.location.href}`
  ].join('\n');

  const mailto = `mailto:support@gigsda.com?subject=${encodeURIComponent('DSA-Meldung')}&body=${encodeURIComponent(details)}`;

  return (
    <a
      className={className}
      href={mailto}
      rel="noreferrer"
      target="_blank"
    >
      ⚠ Inhalt melden
    </a>
  );
}
