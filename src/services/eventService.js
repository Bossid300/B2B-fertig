const EVENTS_KEY = 'gigsda_events';

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
  }
};