const API_BASE =
  window.location.hostname === 'localhost'
    ? 'https://gigsda.com/api'
    : '/api';

export const freeSpotService = {

  async saveFreeSpot(freeSpot) {
    const response = await fetch(
      `${API_BASE}/saveFreeSpot.php`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(freeSpot),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Ungültige Antwort von saveFreeSpot.php');
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || 'Free Spot konnte nicht gespeichert werden.'
      );
    }

    return data;
  },

  async getFreeSpots() {
    const response = await fetch(
      `${API_BASE}/getFreeSpots.php`
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Ungültige Antwort von getFreeSpots.php');
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || 'Free Spots konnten nicht geladen werden.'
      );
    }

    return data.freeSpots || [];
  },

  async deleteFreeSpot(id, ownerId) {
    const response = await fetch(
      `${API_BASE}/deleteFreeSpot.php`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          owner_id: ownerId,
        }),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Ungültige Antwort von deleteFreeSpot.php');
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || 'Free Spot konnte nicht gelöscht werden.'
      );
    }

    return data;
  },

  async updateFreeSpot(freeSpot) {
    const response = await fetch(
      `${API_BASE}/updateFreeSpot.php`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(freeSpot),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        'Ungültige Antwort von updateFreeSpot.php'
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
        'Free Spot konnte nicht aktualisiert werden.'
      );
    }

    return data;
  },


};