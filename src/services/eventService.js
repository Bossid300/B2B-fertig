const API_BASE = '/api';

import {
  getProfilesDb,
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

const isMissingOwnerName = (name) =>
  typeof name !== 'string' ||
  !name.trim() ||
  name.trim().toLowerCase() === 'unbekannt';

const getProfileData = (profile) => {
  if (!profile?.profile_json) return profile || {};

  try {
    const data = typeof profile.profile_json === 'string'
      ? JSON.parse(profile.profile_json)
      : profile.profile_json;

    return {
      ...profile,
      ...(data || {})
    };
  } catch {
    return profile;
  }
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

      const response = await fetch(
        `${API_BASE}/getEvents.php`
      );

      const text = await response.text();

      const data = JSON.parse(text);

      const dbEvents =
        data.events || [];

      const eventsNeedingOwnerName = dbEvents.some(event =>
        isMissingOwnerName(event.ownerName) &&
        (event.ownerId || event.owner_id)
      );

      let profilesById = new Map();
      if (eventsNeedingOwnerName) {
        try {
          const profiles = await getProfilesDb();
          profilesById = new Map(
            profiles
              .filter(profile => profile?.id != null)
              .map(profile => [
                String(profile.id),
                getProfileData(profile)
              ])
          );
        } catch (e) {
          console.error(
            'EVENT OWNER PROFILE LOOKUP FEHLER',
            e
          );
        }
      }

      const eventsWithOwnerNames = dbEvents.map(event => {
        if (!isMissingOwnerName(event.ownerName)) return event;

        const ownerId = event.ownerId || event.owner_id;
        const ownerProfile = ownerId != null
          ? profilesById.get(String(ownerId))
          : null;
        const ownerName =
          ownerProfile?.name ||
          ownerProfile?.display_name ||
          ownerProfile?.Klarname ||
          ownerProfile?.user_name ||
          ownerProfile?.project_name;

        return ownerName
          ? {
              ...event,
              ownerName
            }
          : event;
      });

      localStorage.setItem(
        EVENTS_KEY,
        JSON.stringify(eventsWithOwnerNames)
      );

      return eventsWithOwnerNames;

    } catch (e) {
      console.error(
        'EVENTSERVICE SYNC DB FEHLER ❌',
        e
      );

      return this.getEvents();
    }
  }
};