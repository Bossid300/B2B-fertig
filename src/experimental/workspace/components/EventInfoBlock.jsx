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
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const eventDate = formatDate(event.date || event.eventDate || event.startDate);
  const location = event.location || event.ort || event.place;
  const owner = event.owner || event.ownerName || event.organizer;
  const eventId = event.id || event.eventId || event._id;

  return (
    <div className="workspace-event-info-block">
      {/* Event Titel */}
      <div className="event-info__header">
        <h2 className="event-info__title">
          {event.title || event.name || 'Event'}
        </h2>
      </div>

      {/* Event Details */}
      <div className="event-info__details">
        {eventId && (
          <div className="event-info__detail-item">
            <span className="event-info__detail-label">Event-ID</span>
            <strong className="event-info__detail-value">{eventId}</strong>
          </div>
        )}

        {eventDate && (
          <div className="event-info__detail-item">
            <span className="event-info__detail-label">Datum</span>
            <strong className="event-info__detail-value">{eventDate}</strong>
          </div>
        )}

        {location && (
          <div className="event-info__detail-item">
            <span className="event-info__detail-label">Ort</span>
            <strong className="event-info__detail-value">{location}</strong>
          </div>
        )}

        {owner && (
          <div className="event-info__detail-item">
            <span className="event-info__detail-label">Owner</span>
            <strong className="event-info__detail-value">{owner}</strong>
          </div>
        )}
      </div>

      {/* KPI Bereich */}
      <div className="event-info__kpis">
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
