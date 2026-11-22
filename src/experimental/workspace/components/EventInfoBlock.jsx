import React, { useMemo } from 'react';

export default function EventInfoBlock({ event, crew = [], profiles = [] }) {
  if (!event) {
    return null;
  }

  // Berechne KPIs aus verfügbaren Daten
  const kpis = useMemo(() => {
    const crewCount = event.crewIds?.length || 0;
    
    // Anfragen: Crew-Mitglieder mit Status "pending/angefragt"
    const requestsCount = (event.crew || []).filter(member => {
      const status = String(member?.status || '').trim().toLowerCase();
      return ['pending', 'angefragt', 'requested'].includes(status);
    }).length;

    // Zusagen: Crew-Mitglieder mit Status "confirmed/bestätigt" oder acceptedDeals
    const confirmedCount = (event.crew || []).filter(member => {
      const status = String(member?.status || '').trim().toLowerCase();
      return ['accepted', 'confirmed', 'gebucht'].includes(status) || member?.confirmed === true;
    }).length;

    return {
      crewCount,
      requestsCount,
      confirmedCount
    };
  }, [event]);

  // Formatiere Datum
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch {
      return null;
    }
  };

  const eventDate = formatDate(event.date || event.eventDate || event.startDate);
  const eventId = event.id || event.eventId || event._id;
  const organizer = event.owner || event.ownerName || event.organizer;
  const location = event.location || event.ort || event.place;
  const address = event.address || event.adresse || event.street || '';

  return (
    <div className="workspace-event-info-block">
      {/* Linke Spalte: Event-ID und Titel */}
      <div className="event-info__left">
        {eventId && (
          <div className="event-info__id">
            <span className="event-info__id-label">Event-ID</span>
            <strong className="event-info__id-value">{eventId}</strong>
          </div>
        )}
        <h2 className="event-info__title">
          {event.title || event.name || 'Event'}
        </h2>
      </div>

      {/* Mittlere Spalte: Veranstalter, Lokation, Adresse */}
      <div className="event-info__middle">
        {organizer && (
          <div className="event-info__line">
            <strong>Veranstalter:</strong> {organizer}
          </div>
        )}

        {location && (
          <div className="event-info__line">
            <strong>Lokation:</strong> {location}
          </div>
        )}

        {address && (
          <div className="event-info__line">
            <strong>Adresse:</strong> {address}
          </div>
)}
      </div>

      {/* Rechte Spalte: KPI Bereich mit Datum */}
      <div className="event-info__kpis">
        {eventDate && (
          <div className="event-info__kpi-card">
            <span className="event-info__kpi-label">Datum</span>
            <strong className="event-info__kpi-value">{eventDate}</strong>
          </div>
        )}
        <div className="event-info__kpi-card">
          <span className="event-info__kpi-label">Crew</span>
          <strong className="event-info__kpi-value">{kpis.crewCount}</strong>
        </div>
        <div className="event-info__kpi-card">
          <span className="event-info__kpi-label">Anfragen</span>
          <strong className="event-info__kpi-value">{kpis.requestsCount}</strong>
        </div>
        <div className="event-info__kpi-card">
          <span className="event-info__kpi-label">Zusagen</span>
          <strong className="event-info__kpi-value">{kpis.confirmedCount}</strong>
        </div>
      </div>
    </div>
  );
}
