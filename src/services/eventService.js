import {
  getEvents as getEventsDb,
  saveEvent
} from './apiService';

const EVENTS_KEY = 'gigsda_events';
const normalizeEventDate = (value) => {
  if (!value) return null;

  // erlaubt nur technisches DB-Datum: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return null;
};
export const eventService = {
  getEvents() {
    return JSON.parse(
      localStorage.getItem(EVENTS_KEY) || '[]'
    );
  },

  saveEvents(events) {
    localStorage.setItem(
      EVENTS_KEY,
      JSON.stringify(events)
    );

    events.forEach(async (event) => {
      try {
    const normalizedDate =
      normalizeEventDate(
        event.date ||
        event.event_date
      );

    const result =
      await saveEvent({
        ...event,
        owner_id:
          event.ownerId ||
          event.owner_id,

        event_date:
          normalizedDate,

        event_type:
          event.type ||
          event.event_type,

        updatedAt:
          Date.now()
      });

        console.log(
          'EVENTSERVICE SAVE EVENT DB ✅',
          result
        );
      } catch (e) {
        console.error(
          'EVENTSERVICE SAVE EVENT DB FEHLER ❌',
          e
        );
      }
    });
  },

  async syncFromDb() {
    try {
      const dbEvents =
        await getEventsDb();

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