import {
  saveEvent as saveEventDb
} from './apiService';

const EVENTS_KEY = 'gigsda_events';

const normalizeEventDate = (value) => {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return null;
};

const prepareEventForDb = (event) => {
  const normalizedDate =
    normalizeEventDate(
      event.date ||
      event.event_date
    );

  return {
    ...event,
    owner_id:
      event.ownerId ||
      event.owner_id ||
      null,

    event_date:
      normalizedDate,

    event_type:
      event.type ||
      event.event_type ||
      null,

    updatedAt:
      Date.now()
  };
};

export const eventService = {
  getEvents() {
    return JSON.parse(
      localStorage.getItem(EVENTS_KEY) || '[]'
    );
  },

  saveEvents(events) {
    // Nur lokaler Cache.
    // Keine komplette DB-Massensynchronisierung mehr.
    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(events)
    );
  },

  async saveEvent(event) {
    const events =
      this.getEvents();

    const eventId =
      event.id ||
      event.eventId ||
      event._id;

    const updatedEvents =
      events.some(ev =>
        ev &&
        (
          ev.id === eventId ||
          ev.eventId === eventId ||
          ev._id === eventId
        )
      )
        ? events.map(ev => {
            const evId =
              ev.id ||
              ev.eventId ||
              ev._id;

            return String(evId) === String(eventId)
              ? {
                  ...ev,
                  ...event
                }
              : ev;
          })
        : [
            event,
            ...events
          ];

    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(updatedEvents)
    );

    try {
      const result =
        await saveEventDb(
          prepareEventForDb(event)
        );

      console.log(
        'EVENTSERVICE SAVE SINGLE EVENT DB ✅',
        result
      );

      return result;
    } catch (e) {
      console.error(
        'EVENTSERVICE SAVE SINGLE EVENT DB FEHLER ❌',
        e
      );

      return {
        success: false,
        error: e
      };
    }
  },

  async syncFromDb() {
    try {
      const response =
        await fetch('/2026/api/getEvents.php');

      const data =
        await response.json();

      const dbEvents =
        data.events || [];

      console.log(
        'EVENTSERVICE EVENTS DB ✅',
        dbEvents
      );

      localStorage.setItem(
        EVENTS_KEY,
        JSON.stringify(dbEvents)
      );

      return dbEvents;
    } catch (e) {
      console.error(
        'EVENTSERVICE SYNC DB FEHLER ❌',
        e
      );

      return this.getEvents();
    }
  }
};